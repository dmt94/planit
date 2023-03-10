const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');
const askGPT = require('./askgpt');
const currentDate = require('./currentDate');

module.exports = {
  index,
  show,
  showAI,
  new: newDateEvent,
  indexAI,
  newDateEventAI
}
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
  let response = await askGPT.askGPT(req);
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
            priority: 'HIGH'
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
  let response = await askGPT.askGPT(req);
  renderDashboard(req, res, response.data.choices[0].text);
}

async function show(req, res) {
  renderDashboard(req, res, "");
  }

function renderNewDateEvent(req, res, msg) {
  res.render('dashboard/new', {
    user: req.user,
    date: req.query.date,
    title: 'Dashboard',
    event: "",
    message: msg,
    url: req._parsedOriginalUrl.href,
    currentDate: currentDate.currentDate
  })
}
      
function newDateEvent(req, res) {
  renderNewDateEvent(req, res, "");
}

async function newDateEventAI(req, res) {
  let response = await askGPT.askGPT(req);
  renderNewDateEvent(req, res, response.data.choices[0].text);
}