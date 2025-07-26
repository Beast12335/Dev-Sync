import { useEffect, useRef } from "react";
import { useBoardStore } from "../store/boardStore";
import { useCursorStore } from "../store/cursorStore";
import { useAuthStore } from "../store/authStore";

const Canvas = ({ socket, boardId, userId }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPath = useRef([]);
  const { color, width, paths, addPath } = useBoardStore();
  const { updateCursor } = useCursorStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawPath = ({ path, color, width }) => {
      if (!ctx || !path.length) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    };

    // redraw everything on path update
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach(drawPath);

    if (socket?.current) {
      socket.current.on("drawing", ({ path, color, width }) => {
        drawPath({ path, color, width });
      });
    }

  }, [paths]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = { x: e.clientX, y: e.clientY };
    currentPath.current = [pos];
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const pos = { x: e.clientX, y: e.clientY };
    currentPath.current.push(pos);
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(currentPath.current[0].x, currentPath.current[0].y);
    currentPath.current.forEach((p) => ctx.lineTo(p.x, p.y));
    socket.current.emit('cursor-move', {
      boardId,
      user,
      cursor: {
        x: e.clientX,
        y: e.clientY,
      },
    });

    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const newPath = {
      path: currentPath.current,
      color,
      width
    };

    addPath(newPath);

    socket.current.emit("drawing", {
      boardId,
      data: newPath,
      userId
    });

    currentPath.current = [];
  };


  

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 z-10"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export const clearCanvas = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export default Canvas;
