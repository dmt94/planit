const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const eventCtrl = require('../controllers/event');

/* GET users listing. */
router.post('/date/new', ensureLoggedIn, eventCtrl.create);

module.exports = router;
