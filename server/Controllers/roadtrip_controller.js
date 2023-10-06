const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

const apiKey = 'AIzaSyBQSWehf4LQiWZKhB7NNmh0LEOoWJmV3-Y';

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
    key: apiKey
  };

  const route = await callDirectionService(request);

  if (route.message) {
    res.status(409).json({ message: route.message });
  }
  
  request.waypoints = [
  // {
  //   location: 'Joplin, MO',
  //   stopover: false
  // },
  {
    location: 'Chicago, IL, USA',
    stopover: true
  }];
    
  const result = await callDirectionService(request);

  if (result.message) {
    res.status(409).json({ message: result.message });
  }

  console.log(route, result)
  route.routes.push(result.routes[0]);
  
  res.status(201).json(route);
};
  
module.exports = {newRoadTrip};