// ChatWindow.js (a component for displaying the chat window)
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadMessages, sendMessage } from './messagingSlice';

const ChatWindow = ({ userId, recipientId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);

  useEffect(() => {
    // Load chat history when the component mounts
    dispatch(loadMessages(userId, recipientId));
  }, [dispatch, userId, recipientId]);

  const handleSendMessage = (messageContent) => {
    // Send a new message
    dispatch(sendMessage(userId, recipientId, messageContent));
  };

  return (
    <div>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
