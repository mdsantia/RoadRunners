const express = require('express');
const router = express.Router();

const {checkAndSaveUser, firstTimeLogin} = require('../Controllers/user_controller');

/* POST Requests */
router.post('/checkAndSaveUser', checkAndSaveUser);

module.exports = router;