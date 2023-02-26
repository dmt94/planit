const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const dashBoardCtrl = require('../controllers/dashboard');

/* GET users listing. */
router.get('/', ensureLoggedIn, dashBoardCtrl.index);
router.get('/view', ensureLoggedIn, dashBoardCtrl.view);

module.exports = router;
