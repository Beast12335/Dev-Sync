import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (boardId, user) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.current = io('http://localhost:5000'); // Or your backend URL

    socket.current.on('connect', () => {
      console.log('✅ Socket connected:', socket.current.id);
      socket.current.emit('join-board', { boardId, user });
      setIsConnected(true);
    });

    socket.current.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    return () => {
      socket.current.emit('leave-board', { boardId, user });
      socket.current.disconnect();
    };
  }, [boardId]);

  return { socket, isConnected };
};
