const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const dayCtrl = require('../controllers/day');

/* GET users listing. */
router.post('/new', ensureLoggedIn, dayCtrl.create);
router.get('/:id', ensureLoggedIn, dayCtrl.show);

module.exports = router;
