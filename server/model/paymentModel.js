const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: Number,
  paymentMethod: String,
  userId: String, 
  timestamp: { type: Date, default: Date.now }, 
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
