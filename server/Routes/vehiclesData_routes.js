const express = require('express');
const router = express.Router();

const {getACar, getMPG} = require('../Controllers/vehiclesData_controller');

/* POST Requests */
router.get('/getACar', getACar);
router.get('/getMPG', getMPG);

module.exports = router;