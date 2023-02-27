const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

// shortcut var to mongoose.connection object
const db = mongoose.connection;

module.exports = {
  create
  // show,
  // new: newDateEvent
}

function create(req, res) {
  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);
  
  console.log("REQ BODY", req.body);
  console.log("REQ DESC", req.body.description);
  console.log(Event);
  console.log(DateModel);

  User.findOne(req.user, function(err, user) {
    console.log(user);

    Event.create({
      user: user._id,
      name: req.body.name,
      description: req.body.description,
      priority: req.body.priority,
      specialEvent: req.body.specialEvent
    }, function(err, event) {
      
      console.log("EVENT created?", event);

      DateModel.create({
        date: dateObj,
        user: user._id
      }, function(err, date) {
        date.event.push(event);
        user.date.push(date);
        console.log("EVENT created?", event);
        console.log("DATE created?", date);

        user.save(function(err) {
          console.log(user);
          console.log("DATES", user.date);
          console.log("EVENTS", user.date.event);
          console.log("EVENTS INSIDE DATE", event);
          res.redirect(`/dashboard`);
        })
      })
    })
  })
}