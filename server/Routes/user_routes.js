const express = require('express');
const router = express.Router();

const {checkAndSaveUser, addVehicle, removeVehicle, setPreferences, saveTrip} = require('../Controllers/user_controller');

/* POST Requests */
router.post('/checkAndSaveUser', checkAndSaveUser);
router.post('/addVehicle', addVehicle);
router.post('/removeVehicle', removeVehicle);
router.post('/setPreferences', setPreferences);
router.post('/saveTrip', saveTrip);

module.exports = router;