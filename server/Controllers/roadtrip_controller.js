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

async function buildARoute(req) {
  const { startLocation, endLocation, startDate, endDate, routeOption } = req.query;
  let stops = [{name: startLocation, category: "A", location: await roadtrip_apis.getGeoLocation(startLocation)}];

  var request =  {
    origin: startLocation,
    destination: endLocation,
    // provideRouteAlternatives: true,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
    // unitSystem: google.maps.UnitSystem.IMPERIAL,
  };
  
  const result = await roadtrip_apis.getStops(await roadtrip_apis.getGeoLocation(startLocation), 100000, "Restaurant", null, 'food');

  if (result.message) {
    throw new Error(result.message);
  }
  
  stops.push(result[routeOption]);
  request.destination = result[routeOption].locationString;
  
  const routeToWaypoint = await roadtrip_apis.callDirectionService(request);

  if (routeToWaypoint.message) {
    throw new Error(routeToWaypoint.message);
  }
  
  request.origin = request.destination;
  request.destination = endLocation;
  
  const routeFromWaypoint = await roadtrip_apis.callDirectionService(request);
  
  if (routeFromWaypoint.message) {
    throw new Error(result.message);
  }

  const completeRoute = joining.combineRoutes(routeToWaypoint.routes[0], routeFromWaypoint.routes[0]);
  
  if (completeRoute.message) {
    throw new Error(result.message);
  }
  
  routeToWaypoint.routes[0] = completeRoute;
  stops.push({name: endLocation, category: "B", location: await roadtrip_apis.getGeoLocation(endLocation)});

  return {route: routeToWaypoint, stops: stops};
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

  const result = {routes: []};

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
    const decoded = polyline.decode(newOption.route.routes[0].overview_polyline.points);
    const path = decoded.map((point) => {
      return { lat: point[0], lng: point[1] };
    });
    const obj = {
      decodedPath: path,
      stops: newOption.stops,
      distance: newOption.route.routes[0].legs[0].distance,
      duration: newOption.route.routes[0].legs[0].duration,
    }
    result.routes.push(obj);
  }

  res.status(201).json(result);
};
  
module.exports = {newRoadTrip};