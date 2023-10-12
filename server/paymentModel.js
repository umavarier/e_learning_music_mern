const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: Number,
  paymentMethod: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Payment', paymentSchema);