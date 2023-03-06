const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');
const askGPT = require('./askgpt');
const currentDate = require('./currentDate');

module.exports = {
  create,
  new: newEvent,
  newAI,
  newEdit,
  newEditAI,
  delete: deleteEvent,
  update: updateEvent,
  show
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

function show(req, res) {
  let eventId = req.query.eventId;
  
  Event.findById(eventId, function(err, event) {
    res.render('event/show', {
      title: 'Event',
      event: event,
      eventId: eventId,
      getTime: getTime
    })
  })
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
    time: req.body.time,
    date: new Date(`${req.body.date}T00:00`)
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
          time: req.body.time,
          date: new Date(`${req.body.date}T00:00`)
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

function renderNewEvent(req, res, message, url) {
  res.render('event/new', {
    user: req.user,
    dateId: req.params.id,
    title: 'Add New Event',
    event: "",
    message: message,
    url: url,
    currentDate: currentDate.currentDate
  })
}

function newEvent(req, res) {
  renderNewEvent(req, res, "", req._parsedOriginalUrl.path);
}

async function newAI(req, res) {
  let response = await askGPT.askGPT(req);
  renderNewEvent(req, res, response.data.choices[0].text, req._parsedOriginalUrl.path);
}

async function newEditAI(req, res) {
  let eventId = req.query.eventId;
  let dateId = req.params.id;
  let response = await askGPT.askGPT(req);
  Event.findById(eventId, function(err, event) {
    renderEditEvent(req, res, event, eventId, dateId, response.data.choices[0].text, req._parsedOriginalUrl.path)
  })
}

function renderEditEvent(req, res, event, eventId, dateId, message, url) {  
  res.render('event/update', {
    user: req.user,
    title: event.name,
    dateId: dateId,
    eventId: eventId,
    event: event,
    message: message,
    url: url,
    currentDate: currentDate.currentDate
  })  
}

function newEdit(req, res) {
  let eventId = req.query.eventId;
  let dateId = req.params.id;
  
  Event.findById(eventId, function(err, event) {
    renderEditEvent(req, res, event, eventId, dateId, "", req._parsedOriginalUrl.path)
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