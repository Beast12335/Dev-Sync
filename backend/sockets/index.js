module.exports = (socket, io) => {
    // Join room
    socket.on('join-board', ({ boardId, user }) => {
        socket.join(boardId);
        socket.data.user = user; // Store user info in socket data
        socket.to(boardId).emit('user-joined', { user, socketId: socket.id });
    });

    // Leave room
    socket.on('leave-board', ({ boardId, user }) => {
        socket.leave(boardId);
        socket.to(boardId).emit('user-left', { user, socketId: socket.id });
    });

    // Disconnect
    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
        rooms.forEach((room) => {
            socket.to(room).emit('user-left', { socketId: socket.id });
        });
    });

    // Receive and broadcast drawing data
    socket.on('drawing', ({ boardId, data }) => {
        socket.to(boardId).emit('drawing', data);
    });

    socket.on('cursor-move', ({ boardId, user,cursor }) => {
        socket.to(boardId).emit('cursor-move', { user,cursor });
    });
};

