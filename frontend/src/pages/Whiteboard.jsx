import Canvas, { clearCanvas } from "../components/Canvas";
import Toolbar from '../components/ToolBar'
import { useSocket } from "../hooks/useSocket";
import RemoteCursors from "../components/RemoteCursors";

const Whiteboard = () => {
  const boardId = "64d123456789abcdef";
  const user = { name: "Paramjeet", id: "1" };

  const { socket, isConnected } = useSocket(boardId, user);

  useEffect(() => {
    const fetchBoard = async () => {
      const res = await fetch(`http://localhost:5000/api/whiteboard/load/${boardId}`);
      const data = await res.json();
      setPaths(data.paths);
    };
    fetchBoard();
  }, []);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch("http://localhost:5000/api/whiteboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId, paths }),
      });
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [paths]);
  

  if (!isConnected) return <div className="p-6 text-lg">🔌 Connecting...</div>;

  return (
    <div className="w-screen h-screen bg-gray-50 relative">
      <Canvas socket={socket} boardId={boardId} userId={user.id} />
      <Toolbar onClear={clearCanvas} />
      <RemoteCursors/>
    </div>
  );
};

export default Whiteboard;