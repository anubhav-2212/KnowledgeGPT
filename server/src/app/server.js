import http from 'http';
import app from '../app.js';
import initSocket from './socket.js';

const PORT = process.env.PORT || 5000;

// Wrap express app in http server to bind Socket.io
const server = http.createServer(app);

// Initialize Socket.io on the HTTP server
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
