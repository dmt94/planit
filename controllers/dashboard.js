const User = require('../models/user');

module.exports = {
  index,
  show,
  new: newDateEvent
}

function index(req, res) {
  console.log(req.user)
  User.findOne(req.user, function(err, user) {
    res.render('dashboard/index', {
      title: 'Dashboard',
      // user: user,
    })
  })
}

function show(req, res) {
  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);

  console.log("req.user:", req.user);

  User.findOne(req.user, function(err, user) {
    console.log("query", req.query);  
    console.log("user", user);    
    res.render('dashboard/show', {
      user: req.user,
      date: req.query.date,
      title: 'Dashboard'
    })
    
  })
}

function newDateEvent(req, res) {
  console.log(req.query.date);
  res.render('dashboard/new', {
    user: req.user,
    date: req.query.date,
    title: 'Dashboard',
  })
}