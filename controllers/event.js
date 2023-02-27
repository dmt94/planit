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

  User.findOne(req.user, function(err, user) {
    console.log("USER found:", user);
    DateModel.findOne({date: dateObj, user: user._id}, function(err, date) {
      if (!date) {
        Event.create({
          user: user._id,
          name: req.body.name,
          description: req.body.description,
          priority: req.body.priority,
          specialEvent: req.body.specialEvent
        }, function(err, event) {
        
          DateModel.create({
            date: dateObj,
            user: user._id
          }, function(err, date) {
            console.log("DATE", date);
            console.log("EVENT", event);
            date.event.push(event._id);
            date.save(function (err) {
              user.date.push(date);
              user.save(function(err) {
                res.redirect(`/dashboard`);
              })
            })
          })
        })
      }
    })})
}