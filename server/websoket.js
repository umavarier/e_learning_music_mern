// websocket.js
const { Server } = require('socket.io');

module.exports = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });

    // Handle messages
    socket.on('chat message', (message) => {
      // Broadcast the message to all connected clients
      io.emit('chat message', message);
    });
  });
};
