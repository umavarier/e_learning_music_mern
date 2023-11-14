// socket.js
module.exports = function (io) {
  const connectedSockets = []; 

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      const existingSocket = connectedSockets.find(
        (user) => user.userId === userId
      );

      if (existingSocket) {
        existingSocket.socketId = socket.id;
      } else {
        // User is not already connected, add to the list
        connectedSockets.push({
          userId: userId,
          socketId: socket.id,
        });
        console.log(`User ${userId} connected `);

        // Notify the connected user that they are online
        socket.emit("online", true);
      }

      // You can emit additional events or perform other actions as needed

      // ...
    });

    socket.on("userToUserMessage", (data) => {
      // Broadcast the chat message to the target user (student or teacher)
      const targetSocket = connectedSockets.find(
        (user) => user.userId === data.recipientId
      );

      if (targetSocket) {
        io.to(targetSocket.socketId).emit("receiveMessage", {
          senderId: data.senderId,
          message: data.message,
        });
      }
    });

    socket.on("teacherToUserMessage", (data) => {
      // Broadcast the chat message to the target user (student or teacher)
      const targetSocket = connectedSockets.find(
        (user) => user.userId === data.recipientId
      );

      if (targetSocket) {
        io.to(targetSocket.socketId).emit("receiveMessage", {
          senderId: data.senderId,
          message: data.message,
        });
      }
    });

    socket.on("disconnect", () => {
      const disconnectedSocketIndex = connectedSockets.findIndex(
        (user) => user.socketId === socket.id
      );

      if (disconnectedSocketIndex !== -1) {
        const disconnectedUser = connectedSockets[disconnectedSocketIndex];
        console.log(`User ${disconnectedUser.userId} disconnected`);
        connectedSockets.splice(disconnectedSocketIndex, 1);

        // Notify the disconnected user that they are offline
        io.to(socket.id).emit("online", false);
      }
    });
  });
};
