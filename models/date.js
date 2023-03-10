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
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }},
  {
  timestamps: true
});

module.exports = mongoose.model('DateModel', dateSchema);