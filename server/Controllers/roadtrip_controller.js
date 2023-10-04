const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../Models/user_model');
const axios = require('axios');

const newRoadTrip = async (req, res) => {
    console.log("Creating new road trip");
    const start = 'West Lafayette, IN, USA';
    const end = 'Los Angeles, CA, USA';

    try {
      const apiKey = 'AIzaSyBQSWehf4LQiWZKhB7NNmh0LEOoWJmV3-Y';
      const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
  
      const response = await axios.get(baseUrl, {
        params: {
          origin: start,
          destination: end,
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