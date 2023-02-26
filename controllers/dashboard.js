const User = require('../models/user');

module.exports = {
  index,
  show
}

function index(req, res) {
  User.findOne(req.user, function(err, user) {
    res.render('dashboard/index', {
      title: 'Dashboard',
      user: user,
    })
  })
}

function show(req, res) {
  User.findOne(req.user, function(err, user) {
    console.log("User name", user.name);
    console.log("query", req.query);
    res.render('dashboard/show', {
      date: req.query.date,
      user: user,
      title: 'Dashboard'
    })
  })
}