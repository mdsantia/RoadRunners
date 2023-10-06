const express = require('express');
const router = express.Router();

const {getYears, getMakes, getModels, getMPG} = require('../Controllers/vehiclesData_controller');

/* POST Requests */
router.get('/getYears', getYears);
router.get('/getMakes', getMakes);
router.get('/getModels', getModels);
router.get('/getMPG', getMPG);

module.exports = router;