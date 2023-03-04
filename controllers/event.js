const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');

module.exports = {
  create,
  new: newEvent,
  newEdit,
  delete: deleteEvent,
  update: updateEvent
}

function updateEvent(req, res) {
  let filter = {
    _id: req.query.eventId
  };
  if (!req.body.name) return;
  let update = {
    name: req.body.name,
    description: req.body.description,
    priority: req.body.priority,
    specialEvent: req.body.specialEvent,
    time: req.body.time
  };
  Event.findOneAndUpdate(filter, update, function(err, event) {
    event.save();
  });
  res.redirect(`/day/${req.params.id}`)
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
    event: "",
    message: ""
  })
}

function newEdit(req, res) {
  let eventId = req.query.eventId;
  let dateId = req.params.id;
  
  Event.findById(eventId, function(err, event) {
    res.render('event/update', {
      user: req.user,
      title: event.name,
      dateId,
      eventId,
      event,
      message: ""
    })
  })
}

function deleteEvent(req, res) {
  DateModel.find({user: req.user._id}, function(err, date){
    date.forEach(dateObj => {      
      let eventForDate = dateObj.event;
      let indexOfEvent = eventForDate.indexOf(req.query.eventId);
      if (eventForDate.includes(req.query.eventId)) {
        dateObj.event.splice(indexOfEvent, 1);
        dateObj.save(function(err) {
          Event.findOneAndDelete({_id: req.query.eventId}, function(err, event) {
          })
          res.redirect(`/day/${req.params.id}`);
        })                
      }
    })
  })
}