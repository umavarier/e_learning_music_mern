import React, { useEffect } from "react";
import io from "socket.io-client"; // Import socket.io-client

const Socket = () => { // Rename the component to 'Socket' with an uppercase letter
  useEffect(() => {
    // Create a Socket.io connection to your server
    const socket = io("http://localhost:4000"); // Replace with your server URL

    // Emit an event to the server
    socket.emit("chat message", "Hello, Server!");

    // Listen for events from the server
    socket.on("chat message", (message) => {
      console.log("Received from the server:", message);
    });

    // Clean up the socket connection when your component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Your component content */}
    </div>
  );
};

export default Socket; // Export the 'Socket' component
