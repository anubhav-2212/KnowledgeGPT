import { Server } from 'socket.io';

// Simple in-memory storage for message history (last 50 messages)
const messageHistory = [];
const MAX_HISTORY = 50;

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // For development, allow any origin. In production, restrict this.
      methods: ['GET', 'POST']
    }
  });

  let activeUsersCount = 0;

  io.on('connection', (socket) => {
    activeUsersCount++;
    console.log(`User connected: ${socket.id}. Active users: ${activeUsersCount}`);

    // 1. Send current connection count to all clients
    io.emit('users:count', activeUsersCount);

    // 2. Send existing chat history to the newly connected user
    socket.emit('chat:history', messageHistory);

    // 3. Listen for incoming chat messages
    socket.on('chat:message', (data) => {
      // Structure the message with a server-side timestamp and unique ID
      const message = {
        id: `${socket.id}-${Date.now()}`,
        sender: data.sender || 'Anonymous',
        text: data.text || '',
        timestamp: new Date().toISOString(),
        socketId: socket.id
      };

      // Store in history
      messageHistory.push(message);
      if (messageHistory.length > MAX_HISTORY) {
        messageHistory.shift();
      }

      // Broadcast the message to all connected clients
      io.emit('chat:message', message);
    });

    // 4. Handle client disconnection
    socket.on('disconnect', () => {
      activeUsersCount = Math.max(0, activeUsersCount - 1);
      console.log(`User disconnected: ${socket.id}. Active users: ${activeUsersCount}`);
      io.emit('users:count', activeUsersCount);
    });
  });

  return io;
}
