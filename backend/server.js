const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const mongoose = require('mongoose');
const socketHandler = require('./sockets');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

mongoose.connect(process.env.MONGO).then(() => {
  server.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
});

io.on('connection', (socket) => {
  console.log(`New socket connected: ${socket.id}`);
  socketHandler(socket, io);
});
