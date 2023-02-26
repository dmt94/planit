const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const dashBoardCtrl = require('../controllers/dashboard');

/* GET users listing. */
router.get('/', ensureLoggedIn, dashBoardCtrl.index);
router.get('/show', ensureLoggedIn, dashBoardCtrl.show);
router.get('/new', ensureLoggedIn, dashBoardCtrl.new);

module.exports = router;
