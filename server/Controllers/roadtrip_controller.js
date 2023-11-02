const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const roadtrip_apis = require('./roadtrip_apis');
const joining = require('./roadtrip_joining');
const polyline = require('polyline');

function motionSickness(scale) {
  /* Notes on motion sickness */
  /* 
  1. Avoid Winding Roads: Try to avoid routes with a lot of sharp turns and winding roads.

  2. Use Highways: Highways tend to have smoother and straighter roads compared to local streets.

  3. Plan for Frequent Stops: Frequent stops can help people prone to carsickness.

  4. Avoid Heavy Traffic: Stop-and-go traffic can make carsickness worse. You can check real-time traffic conditions on Google Maps and try to avoid congested areas.

  5. Select the Right Vehicle: If you have the option, choose a vehicle with a smoother ride. Larger and more stable vehicles can often provide a more comfortable journey.

  6. Opt for Daytime Driving: If possible, drive during the day. 

  7. Proper Ventilation: Ensure good ventilation in the vehicle.

  8. Drive Smoothly: Try to maintain a steady speed and avoid sudden acceleration or braking. 

  9. Use Medication: If carsickness is a chronic issue for a passenger, consider over-the-counter motion sickness medication. Consult a healthcare professional for recommendations.
  */
  
}

function calculateMidpoint(decoded) {
  const midIdx = Math.floor(decoded.length / 2);
  return decoded[midIdx];
}

function decodePath(route) {
  const decoded = polyline.decode(route.routes[0].overview_polyline.points);
  const path = decoded.map((point) => {
    return { lat: point[0], lng: point[1] };
  });

  return path;
}

async function computeStops(left, right, selectedStops, allStops, idx, startDate, radius) {
  var request =  {
    origin: left,
    destination: right,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
  };
  const route = await roadtrip_apis.callDirectionService(request);
  const midpoint = calculateMidpoint(decodePath(route));
  const [amusement_parksResults, museumsResult, bowlingAlleyResult, touristAttractionResult, stadiumResult] = await Promise.all([
    roadtrip_apis.getStops(midpoint, radius, null, null, 'amusement_park'),
    roadtrip_apis.getStops(midpoint, radius, null, null, 'museum'),
    roadtrip_apis.getStops(midpoint, radius, null, null, 'bowling_alley'),
    roadtrip_apis.getStops(midpoint, radius, null, null, 'tourist_attraction'),
    roadtrip_apis.getStops(midpoint, radius, null, null, 'stadium')
  ]);

  const combinedStops = amusement_parksResults.concat(museumsResult, bowlingAlleyResult, touristAttractionResult, stadiumResult);
  combinedStops.sort((a, b) => {
    return b.rating - a.rating;
  });
  // Only add stops that are not already in the list and the first 4 stops
  let numStops = 0;
  let tempStops = [];
  let i = 0;
  while (numStops < 4 && i < combinedStops.length) {
    const stop = combinedStops[i];
    if (!allStops.some(existingStop => existingStop.place_id === stop.place_id)) {
      allStops.push(stop);
      numStops++;
      tempStops.push(stop);
    }
    i++;
  }
  const selectedStop = tempStops[0];
  selectedStops.push(selectedStop);
  if (idx < 2) {
    const mid = selectedStop.locationString;
    await Promise.all([
      computeStops(left, mid, selectedStops, allStops, idx + 1, startDate, radius),
      computeStops(mid, right, selectedStops, allStops, idx + 1, startDate, radius)
    ]); 
  }
}

async function buildARoute(req) {
  const { startLocation, endLocation, startDate } = req.query;
  const stops = [];
  const radius = 50000; // 50 km
  const allStops = [];

  const startObj = {
    name: startLocation,
    location: null,
    category: 'start',
    icon: null,
    place_id: null,
    locationString: null,
    rating: null,
  }

  const endObj = {
    name: endLocation,
    location: null,
    category: 'end',
    icon: null,
    place_id: null,
    locationString: null,
    rating: null,
  }
  
  let left = await roadtrip_apis.getGeoLocation(startLocation); 
  startObj.location = left;
  left = `${left.lat},${left.lng}`;
  startObj.locationString = left;
  let right = await roadtrip_apis.getGeoLocation(endLocation);
  endObj.location = right;
  right = `${right.lat},${right.lng}`;
  endObj.locationString = right;
  
  await Promise.all([
    computeStops(left, right, stops, allStops, 0, startDate, radius),
  ]);

  const sortedStops = [startObj];
  let current = startObj;

  /* Simple greedy sorting */
  while (stops.length > 1) {
    next = roadtrip_apis.nearestNextStop(current, stops);
    current = stops[next];
    stops.splice(next, 1);
    sortedStops.push(current);
  }

  sortedStops.push(stops[0]);
  sortedStops.push(endObj);
  
  for (let i = 0; i < sortedStops.length - 1; i++) {
     var request =  {
      origin: sortedStops[i].locationString,
      destination: sortedStops[i + 1].locationString,
      travelMode: 'DRIVING',
      drivingOptions: {
        departureTime: startDate, // + time
        trafficModel: 'pessimistic'
      },
    };
    const route = await roadtrip_apis.callDirectionService(request);
    const decoded = polyline.decode(route.routes[0].overview_polyline.points);
    const path = decoded.map((point) => {
      return { lat: point[0], lng: point[1] };
    });
    sortedStops[i].routeFromHere = path;
    sortedStops[i].distance = route.routes[0].legs[0].distance.value;
    sortedStops[i].duration = route.routes[0].legs[0].duration.value;
  }

  return({stops: sortedStops, allStops: allStops});
}

async function getGasStationsAlongRoute(route) {
  const gasStations = [];
  const routeSteps = route.routes[0].legs[0].steps;
  for (let i = 0; i < routeSteps.length; i++) {
    const step = routeSteps[i];
    const stepStart = step.start_location;
    const stepDistance = step.distance.value;
    const stepGasStations = await roadtrip_apis.getStops(stepStart, stepDistance, "Gas Station", null, 'gas_station');
    for (station of stepGasStations) {
      gasStations.push(station);
    }
  }
  return gasStations;
}

const newRoadTrip = async (req, res) => {
  const { startLocation, endLocation, startDate, endDate } = req.query;
  console.log(`Creating new road trip, from ${startLocation} to ${endLocation}. Dates are ${startDate}-${endDate}`);

  const result = {options: [], allStops: []};
  let promises = [];
  for (let i = 0; i < 5; i++) {
    req.optionNumber = i;
    promises.push(buildARoute(req));
  }
  const options = await Promise.all(promises);
  options.forEach(option => {
    result.options.push(option.stops);
    option.allStops.forEach(stop => {
      if (!result.allStops.some(existingStop => existingStop.place_id === stop.place_id)) {
        result.allStops.push(stop);
      }
    });
  })
  res.status(201).json(result);
};

const addStop = async (req, res) => {
  const {newStop, stops} = req.query;

  const connectTo = roadtrip_apis.nearestNextStop(newStop, stops);
  const distance = roadtrip_apis.calculateDistance(connectTo, newStop);

  var leftDistance = Infinity;
  var rightDistance = Infinity;
  if (connectTo > 0) {
    leftDistance = roadtrip_apis.calculateDistance(stops[connectTo - 1], newStop);
  } 
  if (connectTo < stops.length - 1) {
    rightDistance = roadtrip_apis.calculateDistance(stops[connectTo + 1], newStop);
  }

  const firstStop = leftDistance + distance > rightDistance + distance? connectTo + 1: connectTo - 1;

  let promises = [];
  var request =  {
    origin: stops[firstStop].locationString,
    destination: newStop.locationString,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
  };
  promises.push(roadtrip_apis.callDirectionService(request));
  request.origin = newStop.locationString;
  request.destination = stops[firstStop + 1].locationString;
  promises.push(roadtrip_apis.callDirectionService(request));
  const newRoutes = await Promise.all(promises);
  stops[firstStop].routeFromHere = newRoutes[0];
  newStop.routeFromHere = newRoutes[1];

  const newStops = stops
  .slice(0, firstStop + 1) // Create a new array from the start to the specified position.
  .concat(newStop) // Concatenate the new element to the new array.
  .concat(stops.slice(firstStop + 1)); // Concatenate the remaining elements.

  res.status(201).json(newStops);
}

const removeStop = async (req, res) => {
  const {indexToRemove, stops} = req.query;

  if (indexToRemove <= 0 || indexToRemove >= stops.length - 1) {
    throw new Error("Invalid index");
  }

  var request =  {
    origin: stops[indexToRemove - 1].locationString,
    destination: stops[indexToRemove + 1].locationString,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
  };
  
  const replacementRoute = await roadtrip_apis.callDirectionService(request)

  stops[indexToRemove - 1].routeFromHere = replacementRoute;

  const newStops = stops.splice(indexToRemove, 1);

  res.status(201).json(newStops);
}
  
module.exports = {newRoadTrip, addStop, removeStop};