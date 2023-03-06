const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
   type: String,
   required: true
  }, 
  description: {
   type: String
  },
  priority: {
   type: String,
   enum: [
     'HIGH',
     'MEDIUM',
     'LOW'
   ]
  },
  date: {
   type: Date,
   default: function() {
    let presentDate = new Date();
    return presentDate;
   }
  },
  specialEvent: {
     type: Boolean,
     default: false
   },
  time: {
    type: String
  }
 }, {
   timestamps: true
 });
 
 module.exports = mongoose.model('Event', eventSchema);