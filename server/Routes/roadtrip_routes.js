const express = require('express');
const router = express.Router();

const {newRoadTrip, addStop, removeStop, moveStop} = require('../Controllers/roadtrip_controller');

router.get('/newRoadTrip', newRoadTrip);
router.get('/addStop', addStop);
router.get('/removeStop', removeStop);
router.get('/moveStop', moveStop);

module.exports = router;