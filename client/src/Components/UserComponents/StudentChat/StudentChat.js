// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
// import { makeStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import { List, ListItem, ListItemText } from "@material-ui/core";

// const useStyles = makeStyles((theme) => ({
//   chatContainer: {
//     display: "flex",
//     flexDirection: "column",
//     width: "400px",
//     height: "400px",
//     margin: "20px",
//     padding: "20px",
//   },
//   chatMessages: {
//     flex: 1,
//     overflowY: "auto",
//   },
//   chatInput: {
//     display: "flex",
//     alignItems: "center",
//     marginTop: "20px",
//   },
//   chatText: {
//     color: "black",
//   },
// }));

// const StudentChat = ({ userId, teacherId }) => {
//   const classes = useStyles();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [receiveMessage, setReceiveMessage] = useState("");
//   const socket = io("http://localhost:4000");

//   useEffect(() => {
//     const handleReceiveMessage = (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     };

//     socket.on("connect", () => {
//       socket.emit("join", userId);
//       console.log(userId + " connected");
//     });

//     // socket.on("chat message", handleReceiveMessage);
//     // console.log("chat",handleReceiveMessage)

//     return () => {
//       socket.off("chat message", handleReceiveMessage);
//       socket.disconnect();
//     };
//   });

//   useEffect(() => {
//     socket.on("receive-message", (data) => {
      
//       setReceiveMessage(data);
//       console.log("received msg " + data);
//     });
//   }, []);
//   console.log(receiveMessage);

//   const handleSendMessage = () => {
//     socket.emit("chat", {
//       userId: teacherId,
//       userType: "teacher",
//       text: newMessage,
//     });

//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { userType: "student", text: newMessage },
//     ]);

//     setNewMessage("");
//   };

//   return (
//     <Paper className={classes.chatContainer}>
//       <div className={classes.chatMessages}>
//         <List>
//           {messages.map((message, index) => (
//             <ListItem
//               key={index}
//               alignItems="flex-start"
//               style={{ color: "black" }}
//             >
//               <ListItemText
//                 primary={message.text}
//                 secondary={message.userType === "student" ? "You" : "Teacher"}
//                 className={classes.chatText}
//               />
//             </ListItem>
//           ))}
//         </List>
//       </div>
//       <div className={classes.chatInput}>
//         <TextField
//           variant="outlined"
//           fullWidth
//           placeholder="Type your message..."
//           style={{ color: "black" }}
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <Button variant="contained" color="primary" onClick={handleSendMessage}>
//           Send
//         </Button>
//       </div>
//     </Paper>
//   );
// };

// export default StudentChat;
