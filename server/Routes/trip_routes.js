const express = require('express');
const router = express.Router();

const {getAllTrips, getTrip, saveTrip, deleteTrip} = require('../Controllers/trip_controller');

// Get requests
router.get('/api/trip/getTrips/:email', getAllTrips);
router.get('/api/trip/getTrip/:id', getTrip);

// Post requests
router.post('/api/trip/saveTrip', saveTrip);
router.post('/api/trip/deleteTrip', deleteTrip);

module.exports = router;