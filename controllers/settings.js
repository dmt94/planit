const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');
const askGPT = require('./askgpt');

module.exports = {
  show,
  delete: deleteAll,
  showAI
};

function renderSettings(req, res, title, msg, url) {
  res.render('settings/show', {
    title: title,    
    message: msg,
    url: url
  })
}

async function showAI(req, res) {
  let response = await askGPT.askGPT(req);
  renderSettings(req, res, "Settings", response.data.choices[0].text);
}

function show(req, res) {
  renderSettings(req, res, "Settings", "");
}

function deleteAll(req, res) {
  User.findOne(req.user, function(err, user) {
    user.date = [];
    user.save(function(err) {
      Event.deleteMany({user: user._id}, function(err, event) {
        DateModel.deleteMany({user: user._id}, function(err, dates) {        
          res.redirect('/settings/show');
        })
      })
    })
    })
  }


