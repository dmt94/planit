const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');

module.exports = {
  show,
  delete: deleteAll
};

function show(req, res) {
  res.render('settings/show', {
    title: 'Settings',
    message: ""
  })
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


