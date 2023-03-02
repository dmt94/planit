const User = require('../models/user');
const DateModel = require('../models/date');
const Event = require('../models/event');
// var requirejs = require('requirejs');


module.exports = {
  index,
  show,
  new: newDateEvent
}

function index(req, res) {
  User.findOne(req.user, function(err, user) {    
    res.render('dashboard/index', {
      title: 'Dashboard',
      user: user
    })
  })
}

function show(req, res) {
  let date = req.query.date.split('-');
  let dateObj = new Date(date[0], Number(date[1]) - 1, date[2]);
  console.log("GET REQUEST FOR PREVIEW: ", req);
  User.findOne(req.user, function(err, user) {
    DateModel.findOne({date: dateObj, user: user._id}, async function(err, date) {
      if (!date) {
        res.render('dashboard/show', {
          user: req.user,
          datePicked: req.query.date,
          title: 'Dashboard',
          date: date
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
              dateObjId: dateWithEvents._id
            })                    
        }
      }
     })}
    )}         
      
function newDateEvent(req, res) {

  res.render('dashboard/new', {
    user: req.user,
    date: req.query.date,
    title: 'Dashboard',
    event: ""
    
  })
}