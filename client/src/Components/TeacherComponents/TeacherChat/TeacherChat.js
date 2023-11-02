import React, { useState } from "react";
import Socket from "../../Socket";
import { useDispatch, useSelector } from "react-redux";
import { selectStudentUserId } from "../../../Redux/studentSlice";
import { io } from "socket.io-client";

function TeacherChat() {
  const [message, setMessage] = useState("");
  const studentUserId = useSelector(selectStudentUserId);

  const dispatch = useDispatch();
  const Socket = io("http://localhost:4000");

  const handleSendMessage = () => {
    console.log("handleSendMessage called"); 
    Socket.emit("chat message", { userId: studentUserId, message });
    setMessage("");
  };

  return (
    <div>
      {/* Display a chat input for teachers in the header */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ color: "black", border: "black", borderWidth: "2px" }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default TeacherChat;
