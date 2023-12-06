const express = require('express');
const router = express.Router();

const {getAllTrips, getTrip, saveTrip, deleteTrip, clearAllTrips, shareTrip, getAllSharedTrips} = require('../Controllers/trip_controller');

// Get requests
router.get('/getTrips/:email', getAllTrips);
router.get('/getTrip/:id', getTrip);
router.get('/getAllSharedTrips/:email', getAllSharedTrips);

// Post requests
router.post('/saveTrip', saveTrip);
router.post('/deleteTrip/:email/:id', deleteTrip);
router.post('/clearTrips/:email', clearAllTrips);
router.post('/shareTrip', shareTrip);

module.exports = router;