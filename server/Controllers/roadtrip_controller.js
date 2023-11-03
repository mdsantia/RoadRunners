const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const roadtrip_apis = require('./roadtrip_apis');
const joining = require('./roadtrip_joining');
const polyline = require('polyline');

const getWarnings = (req, res) => {
  const {stops, scale} = req.query; /* Scale from 1 through 10 */
  const warnings = [];

  warnings.push(roadtrip_apis.motionSickness(stops, scale))

  res.status(201).json(newStops);
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

async function computeStops(left, right, selectedStops, allStops, idx, startDate, radius, optionNumber) {
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
  const [
    // amusement_parksResults, 
    museumsResult, 
    // bowlingAlleyResult, 
    touristAttractionResult, 
    // stadiumResult
  ] = await Promise.all([
    // roadtrip_apis.getStops(midpoint, radius, null, null, 'amusement_park'),
    roadtrip_apis.getStops(midpoint, radius, null, null, 'museum'),
    // roadtrip_apis.getStops(midpoint, radius, null, null, 'bowling_alley'),
    roadtrip_apis.getStops(midpoint, radius, null, null, 'tourist_attraction'),
    // roadtrip_apis.getStops(midpoint, radius, null, null, 'stadium')
  ]);

  const combinedStops = [].concat(
    // amusement_parksResults,
    museumsResult, 
    // bowlingAlleyResult, 
    touristAttractionResult, 
    // stadiumResult
    );
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
  const selectedStop = tempStops[optionNumber % tempStops.length];
  selectedStops.push(selectedStop);
  if (idx < 0) {
    const mid = selectedStop.locationString;
    await Promise.all([
      computeStops(left, mid, selectedStops, allStops, idx + 1, startDate, radius, optionNumber),
      computeStops(mid, right, selectedStops, allStops, idx + 1, startDate, radius, optionNumber)
    ]); 
  }
}

async function buildARoute(req, optionNumber) {
  const { startLocation, endLocation, startDate } = req.query;
  const stops = [];
  const radius = 50000; // 50 km
  const allStops = [];

  const startObj = {
    name: startLocation,
    location: null,
    category: 'start',
    icon: null,
    place_id: 'A',
    locationString: null,
    rating: null,
  }

  const endObj = {
    name: endLocation,
    location: null,
    category: 'end',
    icon: null,
    place_id: 'B',
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
    computeStops(left, right, stops, allStops, 0, startDate, radius, optionNumber),
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
    const optionNumber = i;
    promises.push(buildARoute(req, optionNumber));
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

async function addStopInto (newStop, into, stops) {
  const firstStop = parseInt(into) - 1;
  let promises = [];
  var request =  {
    origin: stops[firstStop].locationString,
    destination: newStop.locationString,
    travelMode: 'DRIVING',
    drivingOptions: {
      // departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
  };
  promises.push(roadtrip_apis.callDirectionService(request));
  request.origin = newStop.locationString;
  request.destination = stops[firstStop + 1].locationString;
  promises.push(roadtrip_apis.callDirectionService(request));
  const newRoutes = await Promise.all(promises);
  const decoded = newRoutes.map((route) => {
    return polyline.decode(route.routes[0].overview_polyline.points);
  });
  const paths = [];
  for (const points of decoded) {
    const path = points.map((point) => {
      return { lat: point[0], lng: point[1] };
    });
    paths.push(path);
  }
  stops[firstStop].routeFromHere = paths[0];
  stops[firstStop].distance = newRoutes[0].routes[0].legs[0].distance.value;
  stops[firstStop].duration = newRoutes[0].routes[0].legs[0].duration.value;
  newStop.routeFromHere = paths[1];
  newStop.distance = newRoutes[1].routes[0].legs[0].distance.value;
  newStop.duration = newRoutes[1].routes[0].legs[0].duration.value;

  const newStops = stops
  .slice(0, firstStop + 1) // Create a new array from the start to the specified position.
  .concat(newStop) // Concatenate the new element to the new array.
  .concat(stops.slice(firstStop + 1)); // Concatenate the remaining elements.

  return newStops;
}

const addStop = async (req, res) => {
  const {newStop, stops} = req.query;

  var connectTo = roadtrip_apis.nearestNextStop(newStop, stops);
  const distance = roadtrip_apis.calculateDistance(connectTo, newStop);

  var leftDistance = Infinity;
  var rightDistance = Infinity;
  if (connectTo > 0) {
    leftDistance = roadtrip_apis.calculateDistance(stops[connectTo - 1], newStop);
  } 
  if (connectTo < stops.length - 1) {
    rightDistance = roadtrip_apis.calculateDistance(stops[connectTo + 1], newStop);
  }

  const into = leftDistance + distance > rightDistance + distance? connectTo: connectTo + 1;

  const newStops = await addStopInto(newStop, into, stops);

  for(let i = 0; i < newStops.length; i++) {
    const newLocation = {lat: parseFloat(newStops[i].location.lat), lng: parseFloat(newStops[i].location.lng)};
    newStops[i].location = newLocation;
  }

  res.status(201).json(newStops);
}

async function removeStopFrom (index, stops) {
  const indexToRemove = parseInt(index);
  var request =  {
    origin: stops[indexToRemove - 1].locationString,
    destination: stops[indexToRemove + 1].locationString,
    travelMode: 'DRIVING',
    drivingOptions: {
      // departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
  };
  
  const replacementRoute = await roadtrip_apis.callDirectionService(request)

  const decoded = polyline.decode(replacementRoute.routes[0].overview_polyline.points);
  const path = decoded.map((point) => {
    return { lat: point[0], lng: point[1] };
  });

  stops[indexToRemove - 1].routeFromHere = path;
  stops[indexToRemove - 1].distance = replacementRoute.routes[0].legs[0].distance.value;
  stops[indexToRemove - 1].duration = replacementRoute.routes[0].legs[0].duration.value;

  stops.splice(indexToRemove, 1);

  return stops;
}

const removeStop = async (req, res) => {
  const {indexToRemove, stops} = req.query;

  if (indexToRemove <= 0 || indexToRemove >= stops.length - 1) {
    throw new Error("Invalid index");
  }

  const newStops = await removeStopFrom(indexToRemove, stops);
  for(let i = 0; i < newStops.length; i++) {
    const newLocation = {lat: parseFloat(newStops[i].location.lat), lng: parseFloat(newStops[i].location.lng)};
    newStops[i].location = newLocation;
  }
  res.status(201).json(newStops);
}

const moveStop = async (req, res) => {
  const {indexFrom, indexTo, stops} = req.query;

  const stop = stops[indexFrom];

  var newStops = await removeStopFrom(indexFrom, stops);

  const newIndexTo = indexTo > indexFrom ? indexTo - 1: indexTo;

  newStops = await addStopInto(stop, newIndexTo, newStops);

  res.status(201).json(newStops);
}
  
module.exports = {getWarnings, newRoadTrip, addStop, removeStop, moveStop};