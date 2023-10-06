const express = require('express');
const router = express.Router();

const {getACar} = require('../Controllers/vehiclesData_controller');

/* POST Requests */
router.get('/getACar', getACar);

module.exports = router;