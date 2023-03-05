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
  indexAI
}
async function askGPT(req) {
  let message = req.body.message;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a personal assistant. Give suggestions, locations, tasks, events. Present lists in a bullet format. >${message}?`,
    max_tokens: 300,
    temperature: 0.45,
  });
  if (response.data) {
    if (response.data.choices) {
      return response;
    }
  }
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
  console.log('URL', req._parsedOriginalUrl);
  console.log('URL path', req._parsedOriginalUrl.href);
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
          url: req._parsedOriginalUrl.pathname
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
              url: req._parsedOriginalUrl.pathname              
            })                    
        }
      }
     })}
    )
}

async function showAI(req, res) {
  let repsonse = await askGPT(req);
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
          message: "",
          url: req._parsedOriginalUrl.pathname
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
              message: "",
              url: req._parsedOriginalUrl.pathname              
            })                    
        }
      }
     })}
    )
}

function show(req, res) {
  // console.log("SHOW URL", req._parsedOriginalUrl)
  renderDashboard(req, res, "");
  }         
      
function newDateEvent(req, res) {
  res.render('dashboard/new', {
    user: req.user,
    date: req.query.date,
    title: 'Dashboard',
    event: "",
    message: "",
    url: req._parsedOriginalUrl.href
  })
}