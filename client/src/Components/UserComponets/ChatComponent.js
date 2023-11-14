import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Card, CardContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: "16px",
  },
});

const ChatComponent = ({ userId, userType, recipientId, recipientType }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const classes = useStyles();

  useEffect(() => {
    const newSocket = io("http://localhost:4000");

    console.log("Socket connected");

    newSocket.emit("join", userId);

    newSocket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

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
      socket.emit(messageEvent, {
        senderId: userId,
        recipientId: recipientId,
        message: newMessage,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: userId, message: newMessage },
      ]);
      setNewMessage("");
    }
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chat
        </Typography>
        <div
          style={{ height: 200, overflowY: "scroll", border: "1px solid #ccc" }}
        >
          {/* Display messages here */}
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender}: {msg.message}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
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
