const OpenAI = require('openai');
const {Configuration, OpenAIApi} = OpenAI;
const configuration = new Configuration({
  organization: "org-ur58xhyOEu4Z69CbXTO9Osb4",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const express = require('express');
const router = express.Router();

const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');

module.exports = {
  index,
  show,
  showAI,
  new: newDateEvent,
  indexAI,
  newDateEventAI
}
async function askGPT(req) {
  let user = req.user;
  let events = await Event.find({user: req.user});
  console.log(events);

  let message = req.body.message;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a personal assistant. Give suggestions, locations, tasks, events if asked. Present lists in a bullet format. Greet with a message for ${user}. Look up ${events} and its properties if asked. >${message}?`,
    max_tokens: 300,
    temperature: 0.45,
  });
  if (response.data) {
    if (response.data.choices) {
      return response;
    }
  }
return response;
}

//RENDER INDEX
function renderIndexDashboard(req, res, user, title, msg, url) {
  res.render('dashboard/index', {
    title: title,
    user: user,
    message: msg,
    url: url
  })
}
function index(req, res) {
  User.findOne(req.user, function(err, user)
   {    
    renderIndexDashboard(req, res, user, "Dashboard", "", req._parsedOriginalUrl.href);
  })
}
async function indexAI(req, res) {
  let response = await askGPT(req);
  User.findOne(req.user, function(err, user)
  {    
   renderIndexDashboard(req, res, user, "Dashboard", response.data.choices[0].text, req._parsedOriginalUrl.href);
 });
}

function renderDashboard(req, res, message) {
  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);
  User.findOne(req.user, function(err, user) {
    DateModel.findOne({date: dateObj, user: user._id}, async function(err, date) {
      if (!date) {
        res.render('dashboard/show', {
          user: req.user,
          datePicked: req.query.date,
          title: 'Dashboard',
          date: date,
          message: message,
          url: req._parsedOriginalUrl.path
        })
      } else {
        if (date.event) {    
          let dateWithEvents = await DateModel.findById(date._id).populate({
            path: 'event',
            priority: 'TOP 3'
          });
            res.render('dashboard/show', {
              user: req.user,
              datePicked: req.query.date,
              title: 'Dashboard',
              date: date,
              events: dateWithEvents.event,
              dateObjId: dateWithEvents._id,
              message: message,
              url: req._parsedOriginalUrl.path              
            })                    
        }
      }
     })}
    )
}

async function showAI(req, res) {
  let response = await askGPT(req);
  renderDashboard(req, res, response.data.choices[0].text);
}

async function show(req, res) {
  renderDashboard(req, res, "");
  }

function renderNewDateEvent(req, res, msg) {
  const aNewEvent = new Event();
  const dt = aNewEvent.date;
  let currentDate = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;

  currentDate += `-${dt.getDate().toString().padStart(2, '0')}`;

  console.log(currentDate)

  res.render('dashboard/new', {
    user: req.user,
    date: req.query.date,
    title: 'Dashboard',
    event: "",
    message: msg,
    url: req._parsedOriginalUrl.href,
    currentDate
  })
}
      
function newDateEvent(req, res) {
  renderNewDateEvent(req, res, "");
}

async function newDateEventAI(req, res) {
  let response = await askGPT(req);
  renderNewDateEvent(req, res, response.data.choices[0].text);
}