const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');

module.exports = {
  create
  // show,
  // new: newDateEvent
}

function create(req, res) {
  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);
  console.log("query", req.query);
  console.log(dateObj);
  console.log(req.body);

  console.log(req.body.name)

  User.findOne(req.user, function(err, user) {
    console.log(user);
    
    Event.create(req.body, function(err, event) {
      DateModel.create({
        date: dateObj,
        user: user._id
      }, function(err, date) {
        date.event.push(event);
        user.date.push(date);
        user.save(function(err) {
          console.log(user);
        })
      })
    })
  })
}