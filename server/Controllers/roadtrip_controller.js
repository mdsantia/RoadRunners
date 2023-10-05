const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

const newRoadTrip = async (req, res) => {
  const { startLocation, endLocation, startDate, endDate } = req.query;
  console.log(`Creating new road trip, from ${startLocation} to ${endLocation}. Dates are ${startDate}-${endDate}`);

  const apiKey = 'AIzaSyBQSWehf4LQiWZKhB7NNmh0LEOoWJmV3-Y';
  const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';

  var request =  {
    origin: startLocation,
    destination: endLocation,
    // waypoints: [
    //   {
    //     location: 'Joplin, MO',
    //     stopover: false
    //   },{
    //     location: 'Oklahoma City, OK',
    //     stopover: true
    //   }],
    provideRouteAlternatives: true,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: startDate, // + time
      trafficModel: 'pessimistic'
    },
    // unitSystem: google.maps.UnitSystem.IMPERIAL,
    key: apiKey
  };
  try {
    const response = await axios.get(baseUrl, {
      params: request,
    });
    
    if (response.data.status === 'OK') {
      const route = response.data; // Get the first route
      // delete request.key;
      // delete request.origin;
      // delete request.endLocation;
      // const bounds = route.routes[0].bounds;
      // delete route.routes[0].bounds;
      // const convertedBounds = {'_.Gh': {
      //     Ta: {'zh': {
      //       lo: bounds.southwest.lng,
      //       hi: bounds.northeast.lng,
      //     }},
      //     rb: {'Eh': {
      //       lo: bounds.southwest.lat,
      //       hi: bounds.northeast.lat,
      //     }},
      //   },
      // };
      // route.routes[0].bounds = convertedBounds;
      // request.origin = {query: startLocation}
      // request.destination = {query: endLocation}
      // route.request = request;
      // console.log(route);
      res.status(201).json(route);
    } else {
      console.error(`Error getting directions by request: ${response.data.status}`.red.bold);
      res.status(409).json({ message: response.data.status });
    }
  } catch (error) {
    console.error(`Error getting directions: ${error.message}`.red.bold);
    res.status(409).json({ message: error.message });
  }
};
  
module.exports = {newRoadTrip};