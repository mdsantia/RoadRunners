const express = require('express');
const router = express.Router();

const {shareTrip} = require('../Controllers/shareTrip');

/* Post Requests */
router.post('/shareTrip', shareTrip);

module.exports = router;