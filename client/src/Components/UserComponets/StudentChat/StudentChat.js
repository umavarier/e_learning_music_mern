import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import  Socket  from "../../Socket"; // Import the Socket.io instance with the correct name

function StudentChat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [teacherMessages, setTeacherMessages] = useState([]);
  const [newTeacherMessage, setNewTeacherMessage] = useState(false);

  const userId = useSelector((state) => state.userId); // Get student user ID
  const dispatch = useDispatch();
  const Socket = io("http://localhost:4000");

  useEffect(() => {
    // Listen for chat messages from the server
    Socket.on("chat message", (message) => { // Use 'Socket' instead of 'socket'
      setTeacherMessages([...teacherMessages, message]);
      setNewTeacherMessage(true); // Trigger a notification flag
    });

    return () => {
      Socket.off("chat message"); // Use 'Socket' instead of 'socket'
    };
  }, [teacherMessages]);

  const handleSendMessage = () => {
    // Send a chat message to the server
    Socket.emit("chat message", { userId, message }); // Use 'Socket' instead of 'socket'
    setMessage(""); // Clear the message input
  };

  return (
    <div>
      <div>
        {/* Chat messages with the teacher */}
        <ul>
          {teacherMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <div>
        {/* Chat input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {newTeacherMessage && (
        <div>
          {/* Display a notification in the student header */}
          New message from teacher!
        </div>
      )}
    </div>
  );
}

export default StudentChat;
