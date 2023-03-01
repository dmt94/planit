const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');

module.exports = {
  create,
  new: newEvent,
  newEdit
}

function create(req, res) {
  console.log(req.params);

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
  })
}

function newEdit(req, res) {
  console.log("REQ PARAMS", req.params);
  res.render('event/update', {
    user: req.user,
    title: 'Edit Event',
    dateId: req.params.id
  })
}