module.exports = function (io) {
  // Store connected sockets with user information
  const connectedSockets = {};

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', (userId) => {
      // Associate the socket with a specific user (student or teacher)
      connectedSockets[userId] = socket;
      console.log(`User ${userId} connected`);

      // Notify the connected user that they are online
      socket.emit('online', true);

      socket.on('chat message', (data) => {
        // Broadcast the chat message to the target user (student or teacher)
        const targetSocket = connectedSockets[data.userId];
        if (targetSocket) {
          targetSocket.emit('chat message', data.message);
        }
      });

      socket.on('disconnect', () => {
        const userId = Object.keys(connectedSockets).find(
          (key) => connectedSockets[key] === socket
        );
        if (userId) {
          console.log(`User ${userId} disconnected`);
          delete connectedSockets[userId];

          // Notify the disconnected user that they are offline
          socket.emit('online', false);
        }
      });
    });
  });
};
