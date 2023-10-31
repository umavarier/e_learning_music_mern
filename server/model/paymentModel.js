const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
  amount: Number,
  paymentMethod: String,
  userId: String, 
  purchasedCourse: String,
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher' 
  },
  timestamp: { type: Date, default: Date.now }, 
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
