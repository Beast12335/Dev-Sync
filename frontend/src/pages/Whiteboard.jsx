import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Canvas, { clearCanvas } from "../components/Canvas";
import Toolbar from "../components/ToolBar";
import RemoteCursors from "../components/RemoteCursors";
import VoiceRecorder from "../components/VoiceRecorder";
import { useSocket } from "../hooks/useSocket";
import { useAuthStore } from "../store/authStore";
import { useBoardStore } from "../store/boardStore";
import { useCursorStore } from "../store/cursorStore";

const Whiteboard = () => {
  const { id: boardId } = useParams();
  const { user, token } = useAuthStore();

  const { socket, isConnected } = useSocket(boardId, user);

  const paths = useBoardStore((state) => state.paths);
  const setPaths = useBoardStore((state) => state.setPaths);

  // Load whiteboard data from backend on mount
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}/api/whiteboard/load/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data)
        if (data.paths) {
          setPaths(data.paths);
        }
      } catch (err) {
        console.error("Error loading whiteboard:", err);
      }
    };

    fetchBoard();
  }, [boardId, token, setPaths]);

  // Debounced save to backend when paths change
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!paths || paths.length === 0) return;

      fetch(`${import.meta.env.VITE_BACKEND}/api/whiteboard/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ boardId, paths }),
      }).catch((err) => {
        console.error("Error saving whiteboard:", err);
      });
    }, 1000); // 1-second debounce

    return () => clearTimeout(timeout);
  }, [paths, boardId, token]);

  const updateCursor = useCursorStore((state) => state.updateCursor);

  useEffect(() => {
    if (!socket || !user) return;

    const handleCursorMove = ({ user: remoteUser, cursor }) => {
      if (remoteUser.id !== user.id) {
        updateCursor(remoteUser.id, {
          ...cursor,
          name: remoteUser.name,
        });
      }
    };

    socket.current.on("cursor-move", handleCursorMove);

    return () => {
      socket.current.off("cursor-move", handleCursorMove);
    };
  }, [socket, user, updateCursor]);


  if (!isConnected) return <div className="p-6 text-lg">🔌 Connecting...</div>;

  return (
    <div className="w-screen h-screen bg-gray-50 relative">
      <Canvas socket={socket} boardId={boardId} userId={user.id} />
      <Toolbar onClear={clearCanvas} boardId={boardId}/>
      <RemoteCursors />
      <VoiceRecorder boardId={boardId} />
    </div>
  );
};

export default Whiteboard;
