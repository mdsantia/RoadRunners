const express = require('express');
const router = express.Router();

const {newUser} = require('../Controllers/user_controller');

router.post('/newUser', newUser);

module.exports = router;