import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { List, ListItem, ListItemText } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    width: "400px",
    height: "400px",
    margin: "20px",
    padding: "20px",
  },
  chatMessages: {
    flex: 1,
    overflowY: "auto",
  },
  chatInput: {
    display: "flex",
    alignItems: "center",
    marginTop: "20px",
  },
  chatText: {
    color: "black",
  },
}));

const TeacherChat = ({ teacherId, studentId }) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // const []
  const socket = io("http://localhost:4000");

  useEffect(() => {
    // const handleReceiveMessage = (message) => {
      // console.log("msg-recvd" + message);
    //   setMessages((prevMessages) => [...prevMessages, message]);
    // };

    socket.on("connect", () => {
      socket.emit("join", teacherId);
      console.log(teacherId + " connected ");
    });

    // socket.on("chat message", handleReceiveMessage);
    return () => {
      // socket.off("chat", handleReceiveMessage);
      socket.disconnect();
    };
  }, [teacherId]);

  useEffect(()=>{
  socket.on("receive-message", (data) => {
    console.log("r-msg")
    console.log("received msg "+data)
  })
  },[])


  
  // console.log("nm   " + newMessage);
  const handleSendMessage = () => {
    console.log("halo i am clicked");
    const data = {
      userId: studentId,
      userType: "student",
      text: newMessage,
    };
    socket.emit("chat", data);

    setMessages((prevMessages) => [
      ...prevMessages,
      { userType: "teacher", text: newMessage }, // Use "message" instead of "text"
    ]);

    setNewMessage("");
  };

  return (
    <Paper className={classes.chatContainer}>
      <div className={classes.chatMessages}>
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              style={{ color: "black" }}
            >
              <ListItemText
                primary={message.text} // Use "message" instead of "text"
                secondary={message.userType === "teacher" ? "You" : "Student"}
                className={classes.chatText}
              />
            </ListItem>
          ))}
        </List>
      </div>
      <div className={classes.chatInput}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default TeacherChat;
