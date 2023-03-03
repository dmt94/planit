const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const settingsCtrl = require('../controllers/settings');

router.get('/show', ensureLoggedIn, settingsCtrl.show);

router.delete('/delete', ensureLoggedIn, settingsCtrl.delete);

module.exports = router;
