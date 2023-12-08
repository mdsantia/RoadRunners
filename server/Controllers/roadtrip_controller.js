const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const roadtrip_apis = require('./roadtrip_apis');
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

async function computeStops(left, right, selectedStops, allStops, idx, startDate, radius, optionNumber, attractionPref) {
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
    roadtrip_apis.getStops(midpoint, radius, attractionPref && attractionPref.length > 0 ? attractionPref : ['tourist_attraction'], null),
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
  if (idx < 1) {
    const mid = selectedStop.locationString;
    await Promise.all([
      computeStops(left, mid, selectedStops, allStops, idx + 1, startDate, radius, optionNumber, attractionPref),
      computeStops(mid, right, selectedStops, allStops, idx + 1, startDate, radius, optionNumber, attractionPref)
    ]); 
  }
}

async function buildARoute(req, optionNumber) {
  const { startLocation, endLocation, startDate, preferences } = req.query;
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
    computeStops(left, right, stops, allStops, 0, startDate, radius, optionNumber, preferences ? preferences.attractionSelection : null),
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
    //Convert to miles 
    sortedStops[i].distance = parseFloat((route.routes[0].legs[0].distance.value * 0.00062137119223733).toFixed(2));
    sortedStops[i].duration = route.routes[0].legs[0].duration.value;
  }

  return({stops: sortedStops, allStops: allStops});
}

async function getGasStationsAlongRoute(stops, mpg, tankSize, fuelType) {
  let promises = [];
  for (let i = 0; i < stops.length - 1; i++) {
    if (i === 0) {
      promises.push(roadtrip_apis.gasStationsForStop(stops[i], mpg, tankSize, 0, fuelType));
    } else {
      promises.push(roadtrip_apis.gasStationsForStop(stops[i], mpg, tankSize, stops[i - 1].distanceForGasStations, fuelType));
    }
  } 
  await Promise.all(promises);
}

async function getRestaurantsAlongRoute(stops, foodPref) {
  if(!foodPref || foodPref.length <= 0) {
    foodPref = ['fastfood'];
  }
  var poly = [];
  poly = [];
  for (let i = 0; i < stops.length - 1; i++) {
    poly.push(...stops[i].routeFromHere);
  }
  stops[1].restaurants = await roadtrip_apis.getRestaurants(poly, foodPref);
}

const yelpUrl = async (req, res) => {
  const {stops} = req.query;

  const promises = [];
  for (stop of stops) {

    promises.push(roadtrip_apis.getYelpURL(stop.location));
  }

  const urls = await Promise.all(promises);

  res.status(201).json(urls);
}

const getGasStations = async (req, res) => {
  const {stops, mpg, tankSize} = req.body;
  await getGasStationsAlongRoute(stops, mpg, tankSize, 'Regular');
  res.status(201).json(stops);
}

const newRoadTrip = async (req, res) => {
  let { startLocation, endLocation, startDate, endDate, mpg, preferences} = req.query;
  mpg = mpg===undefined||mpg<=0?10:mpg;
  console.log(`Creating new road trip, from ${startLocation} to ${endLocation}. Dates are ${startDate}-${endDate}`);
  
  const result = {options: [], allStops: []};
  let promises = [];
  for (let i = 0; i < 2; i++) {
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
  await getGasStationsAlongRoute(result.options[0], mpg, 14, 'Regular');

  await getRestaurantsAlongRoute(result.options[0], preferences ? preferences.diningSelection : null);

  res.status(201).json(result);
};

const getLiveEvents = async(req, res) => {
  const {startLocation, endLocation, startDate, endDate} = req.query;

  const events = await roadtrip_apis.callTicketmasterService(startLocation, endLocation, startDate, endDate);
  if (!events.message) {
    events.forEach(event => {
      event.location = {lat: parseFloat(event._embedded.venues[0].location.latitude), lng: parseFloat(event._embedded.venues[0].location.longitude)};
      event.locationString = `${event._embedded.venues[0].location.latitude},${event._embedded.venues[0].location.longitude}`;
      delete event._embedded;
      delete event._links;
    });
    res.status(201).json(events);
    return;
  }
  console.log(`Ticket Master Error: ${events.message}\n`.red.bold);
  res.status(401).json(events.message);

}

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
  const {newStop, stops} = req.body;

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
  const {indexToRemove, stops} = req.body;

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
  const {indexFrom, indexTo, stops} = req.body;

  const stop = stops[indexFrom];

  var newStops = await removeStopFrom(indexFrom, stops);

  const newIndexTo = indexTo > indexFrom ? indexTo - 1: indexTo;

  newStops = await addStopInto(stop, newIndexTo, newStops);

  res.status(201).json(newStops);
}

const rearrangeStops = async (req, res) => {
  const {stops} = req.body;

  for (let i = 0; i < stops.length - 1; i++) {
    if (stops[i].routeFromHere === null) {
      var request =  {
        origin: stops[i].locationString,
        destination: stops[i + 1].locationString,
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
    
      stops[i].routeFromHere = path;
      stops[i].distance = replacementRoute.routes[0].legs[0].distance.value;
      stops[i].duration = replacementRoute.routes[0].legs[0].duration.value;
    }
  }

  res.status(201).json(stops);
}
  
module.exports = {getWarnings, newRoadTrip, addStop, removeStop, moveStop, getLiveEvents, yelpUrl, rearrangeStops};