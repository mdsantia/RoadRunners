const express = require('express');
const router = express.Router();
const User = require('../Models/user_model');

const {checkAndSaveUser, addVehicle, removeVehicle, setPreferences, vehicleRanking, saveTrip, editVehicle} = require('../Controllers/user_controller');

/* POST Requests */
router.post('/checkAndSaveUser', checkAndSaveUser);
router.post('/addVehicle', addVehicle);
router.post('/removeVehicle', removeVehicle);
router.post('/setPreferences', setPreferences);
router.post('/saveTrip', saveTrip);
router.post('/vehicleRanking', vehicleRanking);
router.post('/editVehicle', editVehicle);

module.exports = router;