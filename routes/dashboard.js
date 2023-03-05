const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const dashBoardCtrl = require('../controllers/dashboard');

router.get('/', ensureLoggedIn, dashBoardCtrl.index);
router.post('/', ensureLoggedIn, dashBoardCtrl.indexAI)
router.get('/show', ensureLoggedIn, dashBoardCtrl.show);
router.post('/show', ensureLoggedIn, dashBoardCtrl.showAI);
router.get('/new', ensureLoggedIn, dashBoardCtrl.new);

module.exports = router;
