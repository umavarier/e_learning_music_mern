import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Card, CardContent, Typography, Avatar, Grid, Paper, TextareaAutosize, Button } from "@mui/material";
import Badge from "@mui/material/Badge";
import { makeStyles } from "@mui/styles";
import axios from "../../utils/axios";
import PersonIcon from "@mui/icons-material/Person"; 

const useStyles = makeStyles({
  card: {
    maxWidth: "700px",
    margin: "16px",
    height :"500px"
  },
  container: {
    padding: "24px",
  },
  listItem: {
    borderBottom: "1px solid rgba(255,255,255,.3)",
    marginBottom: "8px",
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: "16px",
  },
  defaultAvatar: {
    backgroundColor: "#9e9e9e",
  },
  messageContainer: {
    height: "300px",
    overflowY: "scroll",
    border: "1px solid #ccc",
    marginBottom: "16px",
    padding: "8px",
  },
  message: {
    marginBottom: "5px",
    padding: "5px",
    marginTop:"5px"
  },
  textarea: {
    width: "100%",
    marginTop:"8px",
    marginBottom: "8px",
    height : "30px"
  },
  sendButton: {
    marginTop: "10px",
    amrginLeft:"10px",
    justifyContent:"right",
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
  const [unreadMessages, setUnreadMessages] = useState(0);
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
    const newSocket = io("https://melodymusic.online");

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
        
        <div className={classes.messageContainer}>

          {messages.map((msg, index) => (
            <div
              key={index}
              className={classes.message}
              style={{
                textAlign: msg.senderId === userId ? "left" : "right"
              }}
            >
              {msg.senderId === userId ? "You" : senderName}: {msg.message}
            </div>
          ))}
        </div>
        <div>
          <Badge badgeContent={unreadMessages} color="error">
          {/* <Avatar
              alt={senderName}
              className={`${classes.avatar} ${classes.defaultAvatar}`}
            >
              <PersonIcon />
            </Avatar> */}
          
          <TextareaAutosize
            rows="3"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className={classes.textarea}
          />
          </Badge>
         <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            className={classes.sendButton}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatComponent;
