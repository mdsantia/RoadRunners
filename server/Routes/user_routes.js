const express = require('express');
const router = express.Router();

const {checkAndSaveUser, addVehicle} = require('../Controllers/user_controller');

/* POST Requests */
router.post('/checkAndSaveUser', checkAndSaveUser);
router.post('/addVehicle', addVehicle);

module.exports = router;