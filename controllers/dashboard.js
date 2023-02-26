const User = require('../models/user');

module.exports = {
  index,
  view
}

function index(req, res) {
  User.findOne(req.user, function(err, user) {
    res.render('dashboard/index', {
      title: 'Dashboard',
      user: user
    })
  })
}

function view(req, res) {
  User.findOne(req.user, function(err, user) {
    
    console.log("User name", user.name);
    console.log("query", req.query);
    
    
  })
}