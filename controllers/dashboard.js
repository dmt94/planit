const User = require('../models/user');

module.exports = {
  index,
}

function index(req, res) {
  User.find(req.user, function(err, user) {
    console.log(user[0]);
    res.render('dashboard/index', {
      title: 'Dashboard',
      user: user[0]
    })
  })
}