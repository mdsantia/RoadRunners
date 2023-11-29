const express = require('express');
const router = express.Router();

const {getAllTrips, getTrip, saveTrip, deleteTrip, clearAllTrips} = require('../Controllers/trip_controller');

// Get requests
router.get('/getTrips/:email', getAllTrips);
router.get('/getTrip/:id', getTrip);

// Post requests
router.post('/saveTrip', saveTrip);
router.post('/deleteTrip/:email/:id', deleteTrip);
router.post('/clearTrips/:email', clearAllTrips);

module.exports = router;