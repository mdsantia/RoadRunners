const express = require('express');
const router = express.Router();
const User = require('../Models/user_model');

const {checkAndSaveUser, addVehicle, removeVehicle, setPreferences, vehicleRanking, editVehicle, deleteTrip, clearTrips} = require('../Controllers/user_controller');

/* POST Requests */
router.post('/checkAndSaveUser', checkAndSaveUser);
router.post('/addVehicle', addVehicle);
router.post('/removeVehicle', removeVehicle);
router.post('/setPreferences', setPreferences);
router.post('/vehicleRanking', vehicleRanking);
router.post('/editVehicle', editVehicle);
router.post('/deleteTrip', deleteTrip);
router.post('/clearTrips', clearTrips);

module.exports = router;