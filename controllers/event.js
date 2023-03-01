const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');

module.exports = {
  create,
  new: newEvent
}

function create(req, res) {
  console.log(req.params);
  let eventId = req.params.id;

  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);

  User.findOne(req.user, function(err, user) {
    console.log("USER found:", user);
    DateModel.findOne({date: dateObj, user: user._id}, function(err, date) {
        Event.create({
          user: user._id,
          name: req.body.name,
          description: req.body.description,
          priority: req.body.priority,
          specialEvent: req.body.specialEvent,
          time: req.body.time
        }, function(err, event) {        
          DateModel.create({
            date: dateObj,
            user: user._id
          }, function(err, date) {
            date.event.push(event._id);
            date.save(function (err) {
              user.date.push(date);
              user.save(function(err) {
                // res.redirect(`/day/${req.query.id}`);
              })
            })
          })
        })
    })})
}

function newEvent(req, res) {
  console.log(req.params.id)
  res.render('event/new', {
    user: req.user,
    dateId: req.params.id,
    title: 'Add New Event',
  })
}