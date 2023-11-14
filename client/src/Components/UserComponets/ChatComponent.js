import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Card, CardContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "../../utils/axios";

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: "16px",
  },
});

const ChatComponent = ({
  userId,
  userType,
  recipientId,
  recipientType,
  fetchMessages,
  onSendMessage,
  senderName,
}) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0); // Added state for unread messages
  const classes = useStyles();

  console.log("cht  " + senderName);
  const fetchMessagesFromServer = async () => {
    try {
      const response = await axios.get(`/messages/fetchMessages/${userId}`);
      const filteredMessages = response.data.filter(
        (msg) =>
          (msg.senderId === userId && msg.recipientId === recipientId) ||
          (msg.senderId === recipientId && msg.recipientId === userId)
      );
      setMessages(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:4000");

    newSocket.emit("join", userId);

    newSocket.on("receiveMessage", (data) => {
      if (data.senderId === recipientId || data.senderId === userId) {
        setMessages((prevMessages) => [...prevMessages, data]);

        if (data.senderId !== recipientId) {
          setUnreadMessages((prevCount) => prevCount + 1);
        }
      }
    });

    setSocket(newSocket);

    if (fetchMessagesFromServer) {
      fetchMessagesFromServer();
    }

    return () => {
      newSocket.disconnect();
    };
  }, [userId, recipientId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage();
      setNewMessage("");
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") {
      return;
    }

    // Emit a message event based on user type
    const messageEvent =
      userType === "user"
        ? "userToUserMessage"
        : userType === "teacher"
        ? "teacherToUserMessage"
        : "";
    if (socket && messageEvent) {
      try {
        // console.log("store??"+userId)
        // console.log("store1??"+recipientId)
        // console.log("store2??"+newMessage)

        axios.post("/messages/storeMessage", {
          senderId: userId,
          recipientId,
          message: newMessage,
        });
      } catch (error) {
        console.error("Error storing message:", error);
      }

      socket.emit(messageEvent, {
        senderId: userId,
        recipientId: recipientId,
        message: newMessage,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: userId, senderName, message: newMessage },
      ]);
      setNewMessage("");

      // Call the onSendMessage callback
      if (onSendMessage) {
        onSendMessage(newMessage);
      }
    }
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chat with {recipientId}
        </Typography>
        <div
          style={{ height: 200, overflowY: "scroll", border: "1px solid #ccc" }}
        >
          {/* Display messages here */}
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.senderId === userId ? "left" : "right",
                margin: "5px",
              }}
            >
              {msg.senderId === userId ? "You" : senderName}: {msg.message}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <span style={{ color: "red" }}>{unreadMessages}</span>
          <textarea
            rows="3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ width: "100%" }}
          ></textarea>
          <button onClick={handleSendMessage} style={{ marginTop: 10 }}>
            Send
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatComponent;
