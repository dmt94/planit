const User = require('../models/user');

module.exports = {
  create
  // show,
  // new: newDateEvent
}

function create(req, res) {
  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);
  console.log("query", req.query);
  console.log(dateObj);
  console.log(req.body);

  
}