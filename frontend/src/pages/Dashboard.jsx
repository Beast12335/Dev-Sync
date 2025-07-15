import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const fetchBoards = async () => {
    const res = await fetch('http://localhost:5000/api/whiteboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBoards(data);
  };

  const createBoard = async () => {
    const res = await fetch('http://localhost:5000/api/whiteboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    const board = await res.json();
    setBoards((prev) => [...prev, board]);
  };

  const openBoard = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <button onClick={logout} className="text-red-500 underline">Logout</button>
      </div>
      <div className="space-x-2">
        <input
          type="text"
          placeholder="New Board Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />
        <button onClick={createBoard} className="bg-green-500 text-white px-4 py-2 rounded">Create Board</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((b) => (
          <div key={b._id} className="bg-white p-4 shadow rounded-lg">
            <h2 className="font-semibold">{b.title}</h2>
            <button onClick={() => openBoard(b._id)} className="mt-2 text-blue-600 underline">Open</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
