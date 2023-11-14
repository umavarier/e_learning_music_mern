// conversationSchema.js

const mongoose = require('mongoose');


const conversationSchema = new mongoose.Schema({
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      userType: { type: String, enum: ['teacher', 'user'], required: true },
    },
  ],
  // You can store references to messages in a separate collection
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
