const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');
const user = require('../models/user');


module.exports = {
  create,
  show
  // new: newDateEvent
}

function getData(arr, key, value) {
  return arr.filter((object) => object[key] === value);
}

function getTime(time = '10:00') {
  let timeSplit = time.split(':');
  let meridian;
  let hours = timeSplit[0];
  let minutes = timeSplit[1];
  if (hours > 12) {
    meridian = 'PM';
    hours -= 12;
  } else if (hours < 12) {
    meridian = 'AM';
    if (hours == 0) {
      hours = 12;
    }
  } else {
    meridian = 'PM';
  }   
  return `${hours}:${minutes} ${meridian}`;
}

/* SHOW DAY DETAILS */
async function show(req, res) {
  let dateWithEvents = await DateModel.findById(req.params.id).populate({
    path: 'event'
  });
  let date = dateWithEvents.date
  let events = dateWithEvents.event;
  let topThree = getData(events, "priority", "TOP 3");

  console.log("date with events", dateWithEvents);
  
  res.render('date/show', {
    title: 'Day View',
    user: req.user,
    topThree: topThree,
    events: events,
    date: date.toDateString(),
    getTime: getTime    
  })
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
                res.redirect(`/dashboard/show?date=${req.query.date}`);
              })
            })
          })
        })
      }
    })})
}