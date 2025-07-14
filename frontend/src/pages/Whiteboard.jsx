import Canvas, { clearCanvas } from "../components/Canvas";
import Toolbar from '../components/ToolBar'
import { useSocket } from "../hooks/useSocket";

const Whiteboard = () => {
  const boardId = "64d123456789abcdef";
  const user = { name: "Paramjeet", id: "1" };

  const { socket, isConnected } = useSocket(boardId, user);

  if (!isConnected) return <div className="p-6 text-lg">🔌 Connecting...</div>;

  return (
    <div className="w-screen h-screen bg-gray-50 relative">
      <Canvas socket={socket} boardId={boardId} userId={user.id} />
      <Toolbar onClear={clearCanvas} />
    </div>
  );
};

export default Whiteboard;