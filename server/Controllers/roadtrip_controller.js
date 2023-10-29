const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const building = require('./roadtrip_building');
const joining = require('./roadtrip_joining');
const { GoogleApiKey } = require('../Constants');

async function callDirectionService (request) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';

  try {
    const response = await axios.get(baseUrl, {
      params: request,
    });
    
    if (response.data.status === 'OK') {
      const route = response.data;
      return route;
    } else {
      console.error(`Error getting directions by request: ${response.data.status}`.red.bold);
      return {message: response.data.status};
    }
  } catch (error) {
    console.error(`Error getting directions: ${error.message}`.red.bold);
    return {message: error.message};
  }
}

const newRoadTrip = async (req, res) => {
  const { startLocation, endLocation, startDate, endDate } = req.query;
  console.log(`Creating new road trip, from ${startLocation} to ${endLocation}. Dates are ${startDate}-${endDate}`);

  var request =  {
    origin: startLocation,
    destination: endLocation,
    provideRouteAlternatives: true,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
    // unitSystem: google.maps.UnitSystem.IMPERIAL,
    key: GoogleApiKey
  };

  const route = await callDirectionService(request);

  if (route.message) {
    res.status(409).json({ message: route.message });
  }
  
  const result = await building.getMidLocations(startLocation, 1000);
  request.destination = result[result.length - 1].locationString;

  if (request.destination.message) {
    res.status(409).json({ message: request.destination.message });
  }
  
  const routeToWaypoint = await callDirectionService(request);

  if (routeToWaypoint.message) {
    res.status(409).json({ message: route.message });
  }
  
  request.origin = request.destination;
  request.destination = endLocation;
  
  const routeFromWaypoint = await callDirectionService(request);
  
  if (routeFromWaypoint.message) {
    res.status(409).json({ message: route.message });
  }

  const completeRoute = joining.combineRoutes(routeToWaypoint.routes[0], routeFromWaypoint.routes[0]);
  
  if (completeRoute.message) {
    res.status(409).json({ message: completeRoute.message });
  }
  
  route.routes.push(completeRoute);
  
  res.status(201).json(route);
};
  
module.exports = {newRoadTrip};