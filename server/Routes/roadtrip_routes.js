const express = require('express');
const router = express.Router();

const {newRoadTrip} = require('../Controllers/roadtrip_controller');

router.get('/newRoadTrip', newRoadTrip);

module.exports = router;