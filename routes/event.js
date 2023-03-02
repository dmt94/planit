const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../config/ensureLoggedIn');
const eventCtrl = require('../controllers/event');

router.get('/day/:id/event/new', ensureLoggedIn, eventCtrl.new);
router.post('/day/:id/event', ensureLoggedIn, eventCtrl.create);

// router.get('/day/:id/view/:eventId', eventCtrl.show);

router.get('/day/:id/event/edit', ensureLoggedIn, eventCtrl.newEdit);
router.put('/day/:id/event', eventCtrl.update);

router.delete('/day/:id/event', ensureLoggedIn, eventCtrl.delete);

module.exports = router;


/*
  <form
  action="/flights/<%= flight._id %>/tickets?_method=DELETE"
  method="POST"
  class="delete-form"
>
  <button type="submit">DELETE</button>
  </form>
*/

/* 
  <form
  action="/flights/<%= flight._id %>/tickets?_method=PUT"
  method="POST">

  </description goes here>

  <button type="submit">UPDATE</button>
  </form>

*/