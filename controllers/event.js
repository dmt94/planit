const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');

module.exports = {
  create,
  new: newEvent,
  newEdit,
  delete: deleteEvent
}

function create(req, res) {
  for (let prop in req.body) {
    if (req.body[prop] === '') delete req.body[prop];
  }

  User.findOne(req.user, function(err, user) {
    console.log("USER found:", user);
    
    DateModel.findById(req.params.id, function(err, date) {
        Event.create({
          user: user._id,
          name: req.body.name,
          description: req.body.description,
          priority: req.body.priority,
          specialEvent: req.body.specialEvent,
          time: req.body.time
        }, function(err, event) {
          if (err) {
            console.log(err);
            return res.redirect(`/day/${req.params.id}/event/new`)
          };
          date.event.push(event._id);
          date.save(function (err) {
            res.redirect(`/day/${req.params.id}`)
          })})
        })
      })
    }

function newEvent(req, res) {
  res.render('event/new', {
    user: req.user,
    dateId: req.params.id,
    title: 'Add New Event',
    event: ""
  })
}

function newEdit(req, res) {
  let eventId = req.query.eventId;
  let dateId = req.params.id;
  
  Event.findById(eventId, function(err, event) {
    console.log("name", event.name);
    res.render('event/update', {
      user: req.user,
      title: event.name,
      dateId,
      eventId,
      event
    })
  })
}

function deleteEvent(req, res) {
  console.log(req.query);
  console.log(req);
  Event.findByIdAndDelete(req.query.eventId, function(err, event) {
    res.redirect(`/day/${req.params.id}`)
  })
}