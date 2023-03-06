const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');
const askGPT = require('./askgpt');

module.exports = {
  create,
  show,
  showAI
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

async function renderDayView(req, res, message, url) {
  let dateWithEvents = await DateModel.findById(req.params.id).populate({
    path: 'event'
  });
  let date = dateWithEvents.date
  let events = dateWithEvents.event;
  let high = getData(events, "priority", "HIGH");
  
  res.render('date/show', {
    title: 'Day View',
    user: req.user,
    high: high,
    events: events,
    date: date.toDateString(),
    getTime: getTime,
    dateObj: dateWithEvents,
    message: message,
    url: url
  })
}

function show(req, res) {
  renderDayView(req, res, "", req._parsedOriginalUrl.path);
}

async function showAI(req, res) {
  let response = await askGPT.askGPT(req);
  renderDayView(req, res, response.data.choices[0].text, req._parsedOriginalUrl.path);
}

function create(req, res) {
  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }

  User.findOne(req.user, function(err, user) {
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
          if (err) return; 
          DateModel.create({
            date: dateObj,
            user: user._id
          }, function(err, date) {
            if (err) return;
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