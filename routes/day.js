const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const dayCtrl = require('../controllers/day');

router.post('/new', ensureLoggedIn, dayCtrl.create);
router.get('/:id', ensureLoggedIn, dayCtrl.show);
router.post('/:id', ensureLoggedIn, dayCtrl.showAI);

module.exports = router;
