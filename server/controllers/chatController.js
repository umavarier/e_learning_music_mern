const { json } = require("express");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const Teacher = require("../model/teacherModel");
const Conversation = require("../model/conversationModel"); // Import the Conversation model
const mongoose = require('mongoose');
const Message = require('../model/messageModel')

const fetchMessages = async (req, res) => {
    try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Internal Server Error');
  }
};


const storeMessage = async (req, res) => {
    console.log("store??");
    try {
        const { senderId, recipientId, message } = req.body;
    
        const newMessage = new Message({
          senderId,
          recipientId,
          message,
        });
    
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
      } catch (error) {
        console.error('Error storing message:', error);
        res.status(500).send('Internal Server Error');
      }
  };
  


module.exports = {
  fetchMessages,
  storeMessage,
};
