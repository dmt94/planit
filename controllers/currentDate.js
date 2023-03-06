const Event = require('../models/event');

const aNewEvent = new Event();
const dt = aNewEvent.date;
let currentDate = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
currentDate += `-${dt.getDate().toString().padStart(2, '0')}`;

module.exports = {
  currentDate
}