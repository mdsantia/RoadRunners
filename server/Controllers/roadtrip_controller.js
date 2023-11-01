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
  const midpoint = decoded[midIdx];
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
  console.log(midpoint);
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
  allStops.push(combinedStops.slice(0, 4));
  if (idx < 2) {
    const mid = `${midpoint.lat},${midpoint.lng}`
    await Promise.all([
      computeStops(left, mid, selectedStops, allStops, idx + 1),
      computeStops(mid, right, selectedStops, allStops, idx + 1)
    ]);
  }
}

async function buildARoute(req) {
  const { startLocation, endLocation, startDate } = req.query;
  const stops = [];
  const routes = new Map(); 
  const radius = 50000;
  const allStops = [];

  var request =  {
    origin: startLocation,
    destination: endLocation,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
  };

  const route = await roadtrip_apis.callDirectionService(request);
  const midpoint = calculateMidpoint(decodePath(route));
  stops.push({idx: 0, name: startLocation});
  // Use Promise.all to await all the API calls concurrently
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
  const selectedStops = combinedStops.slice(0, 4);
  allStops.push(selectedStops);

  let left = await roadtrip_apis.getGeoLocation(startLocation); 
  left = `${left.lat},${left.lng}`;
  let right = await roadtrip_apis.getGeoLocation(endLocation);
  right = `${right.lat},${right.lng}`;
  const mid = `${midpoint.lat},${midpoint.lng}`;

  await Promise.all([
    computeStops(left, mid, selectedStops, allStops, 0, startDate, radius),
    computeStops(mid, right, selectedStops, allStops, 0, startDate, radius)
  ]);
  
  return(allStops);
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

  res.status(201).json(await buildARoute(req));
  /*const result = {routes: []};

  req.query.routeOption = 0;
  try {
    const route = await buildARoute(req);
    const decoded = polyline.decode(route.route.routes[0].overview_polyline.points);
    const path = decoded.map((point) => {
      return { lat: point[0], lng: point[1] };
    });
    const obj = {
      decodedPath: path,
      stops: route.stops,
      distance: route.route.routes[0].legs[0].distance,
      duration: route.route.routes[0].legs[0].duration,
    }
    result.routes.push(obj);
  } catch (error) {
    console.error(`Error getting directions by request: ${error}`.red.bold);
    res.status(409).json({ message: error });
    return;
  }
  for (let i = 1; i < 4; i++) {
    req.query.routeOption = i;
    let newOption = null;
    try {
      newOption = await buildARoute(req);
    } catch (error) {
      break;
    }
    const decoded = decodePath(newOption);
    const obj = {
      decodedPath: path,
      stops: newOption.stops,
      distance: newOption.route.routes[0].legs[0].distance,
      duration: newOption.route.routes[0].legs[0].duration,
    }
    result.routes.push(obj);
  }

  res.status(201).json(result);*/
};
  
module.exports = {newRoadTrip};