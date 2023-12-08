const express = require('express');
const router = express.Router();

const {getWarnings, newRoadTrip, addStop, removeStop, moveStop, getLiveEvents, yelpUrl, rearrangeStops} = require('../Controllers/roadtrip_controller');

router.get('/newRoadTrip', newRoadTrip);
router.get('/getLiveEvents', getLiveEvents);
router.get('/yelpUrl', yelpUrl);
router.get('/getWarnings', getWarnings);

/* Post Requests */
router.post('/addStop', addStop);
router.post('/removeStop', removeStop);
router.post('/moveStop', moveStop);
router.post('/rearrangeStops', rearrangeStops);
module.exports = router;