const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const eventCtrl = require('../controllers/event');

router.get('/day/:id/event/new', ensureLoggedIn, eventCtrl.new);
router.post('/day/:id/event/new', ensureLoggedIn, eventCtrl.newAI);
router.post('/day/:id/event', ensureLoggedIn, eventCtrl.create);

// router.get('/day/:id/view/:eventId', eventCtrl.show);

router.get('/day/:id/event/edit', ensureLoggedIn, eventCtrl.newEdit);
router.post('/day/:id/event/edit', ensureLoggedIn, eventCtrl.newEditAI);
router.put('/day/:id/event', eventCtrl.update);

router.delete('/day/:id/event', ensureLoggedIn, eventCtrl.delete);

module.exports = router;