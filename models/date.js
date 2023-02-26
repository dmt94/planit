const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateSchema = new Schema({
  date: {
    type: Date
  },
  event: [
  {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }
  ]}, 
  {
  timestamps: true
});

module.exports = mongoose.model('Date', dateSchema);