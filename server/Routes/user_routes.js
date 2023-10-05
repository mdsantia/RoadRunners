const express = require('express');
const router = express.Router();

const {checkAndSaveUser, addVehicle, removeVehicle} = require('../Controllers/user_controller');

/* POST Requests */
router.post('/checkAndSaveUser', checkAndSaveUser);
router.post('/addVehicle', addVehicle);
router.post('/removeVehicle', removeVehicle);

module.exports = router;