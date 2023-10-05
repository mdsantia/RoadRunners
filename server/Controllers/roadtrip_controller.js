const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/user_model');
const axios = require('axios');

const newRoadTrip = async (req, res) => {
  req = req.query;
  const startLocation = req.startLocation;
  const endLocation = req.endLocation;
  const startDate = req.startDate;
  const endDate = req.endDate;
  console.log(`Creating new road trip, from ${startLocation} to ${endLocation}. Dates are ${startDate}-${endDate}`);

  try {
    const apiKey = 'AIzaSyBQSWehf4LQiWZKhB7NNmh0LEOoWJmV3-Y';
    const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';

    const response = await axios.get(baseUrl, {
      params: {
        origin: startLocation,
        destination: endLocation,
        mode: 'driving', // Use 'driving' for driving directions
        key: apiKey,
      },
    });

    if (response.data.status === 'OK') {
      const route = response.data; // Get the first route
      console.log(route);
      res.status(201).json(route);
    } else {
      res.status(409).json({ message: response.data.status });
      console.error('Error getting directions:', response.data.status);
    }
  } catch (error) {
      res.status(409).json({ message: error.message });
  }
};
  
module.exports = {newRoadTrip};