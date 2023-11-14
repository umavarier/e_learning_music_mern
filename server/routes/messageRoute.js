const express = require('express');
const { fetchMessages, storeMessage } = require('../controllers/chatController');
const router = express.Router();


router.get('/fetchMessages/:userId', fetchMessages);
router.post('/storeMessage',storeMessage)

module.exports = router;