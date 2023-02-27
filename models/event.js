const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const tagSchema = new Schema({
//   name: {
//     type: String
//   },
//   backgroundColor: {
//     type: String
//   },
//   textColor: {
//     type: String
//   }
// }, {
//   timestamps: true
// });

// const taskSchema = new Schema({
//   name: {
//     type: String,
//   },
//   description: {
//     type: String,
//   },
//   time: {
//     type: String,
//     default: function() {
//       let presentDay = new Date();
//       return presentDay.getHours() + ":" + today.getMinutes();
//     }
//   },
//   date: {
//     type: Date
//   },
//   progress: {
//     type: String,
//     enum: [
//       'In Progress',
//       'Completed',
//       'Incomplete'
//     ]
//   },
//   tag: [tagSchema]
// })

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
     'TOP 3',
     'HIGH',
     'MEDIUM',
     'LOW'
   ]
  },
  // tag: [tagSchema],
  // date: {
  //  type: Date
  // },
  specialEvent: {
     type: Boolean,
     default: false
   },
//  task: [taskSchema],
  time: {
    type: String,
    default: function() {
      let presentDay = new Date();
      return presentDay.getHours() + ":" + today.getMinutes();
    }
  }
 }, {
   timestamps: true
 });
 
 module.exports = mongoose.model('Event', eventSchema);