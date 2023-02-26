const User = require('../models/user');


module.exports = {
  index,
  show,
  new: newDateEvent
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
  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);
  
  User.findOne({
    'date.date': dateObj
  }).then(function(user) {
    if (!user) {
      console.log("query", req.query);
      
      res.render('dashboard/show', {
        date: req.query.date,
        user: req.user,
        title: 'Dashboard'
      })
    }
  })
}

function newDateEvent(req, res) {

}