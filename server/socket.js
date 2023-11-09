// Server
module.exports = function (io) {
  const connectedSockets = []; // Store connected sockets with user information

  io.on("connection", (socket) => {

    socket.on("join", (userId) => {
      // Associate the socket with a specific user (student or teacher)
      connectedSockets.push({
        userId: userId,
        socketId: socket.id,
      });
      console.log(`User ${userId} connected `);

      console.log(connectedSockets, "data from the socket");
      // Notify the connected user that they are online
      socket.emit("online", true);

      // socket.on("joinRoom", (roomId) => {
        // Join the specified room (e.g., teacher-student chat session)
      //   socket.join(roomId);
      // });
    });

    socket.on("chat", (data) => {
      console.log(data, "chat reciver data");
      // Broadcast the chat message to the target user (student or teacher)
      const targetSocket = connectedSockets.find(
        (user) => user.userId === data.userId
      );
      console.log(JSON.stringify(targetSocket) + "  ts");
      if (targetSocket) {
        console.log("recvd  " + data.text);
        io.to(targetSocket.socketId).emit("receive-message", data.text);
      }
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(connectedSockets).find(
        (key) => connectedSockets[key].socket === socket
      );
      if (userId) {
        console.log(`User ${userId} disconnected`);
        delete connectedSockets[userId];

        // Notify the disconnected user that they are offline
        socket.emit("online", false);
      }
    });


  });
};
