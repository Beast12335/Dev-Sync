import { useState } from "react";
import axios from "axios";
import { useBoardStore } from "../store/boardStore";
import { useAuthStore } from "../store/authStore";

const Toolbar = ({ onClear, boardId }) => {
    const {
        color,
        width,
        setColor,
        setWidth,
        undo,
        redo,
        clear
    } = useBoardStore();

    const { token, user, logout } = useAuthStore();

    const [collaboratorEmail, setCollaboratorEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [statusMessage, setStatusMessage] = useState("");

    const handleExport = () => {
        const canvas = document.querySelector("canvas");
        const link = document.createElement("a");
        link.download = "whiteboard.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const handleAddCollaborator = async () => {
        setStatusMessage(""); // Clear previous message
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND}/api/whiteboard/collaborators`, {
                user: collaboratorEmail,
                role,
                boardId
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setStatusMessage("✅ Collaborator added successfully!");
            setCollaboratorEmail("");
            setRole("viewer");
        } catch (err) {
            const msg =
                err.response?.data?.error || "Failed to add collaborator.";
            setStatusMessage(`❌ ${msg}`);
        }
    };

    return (
        <div className="absolute top-4 left-4 bg-white shadow-lg rounded-2xl p-4 z-50 space-y-4 w-60">
            <div>
                <label className="text-sm font-semibold">🎨 Color</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-8 rounded"
                />
            </div>

            <div>
                <label className="text-sm font-semibold">🖌️ Brush Size: {width}</label>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={undo}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                    ↩️ Undo
                </button>
                <button
                    onClick={redo}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                >
                    ↪️ Redo
                </button>
            </div>

            <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white w-full py-1 rounded-lg"
            >
                📤 Export as PNG
            </button>

            <button
                onClick={() => {
                    clear();
                    onClear();
                }}
                className="bg-red-500 hover:bg-red-600 text-white w-full py-1 rounded-lg"
            >
                🧹 Clear Canvas
            </button>

            {/* Collaborator section */}
            <div className="border-t pt-4">
                <label className="text-sm font-semibold block mb-1">👥 Add Collaborator</label>
                <input
                    type="email"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-2 py-1 border rounded mb-2"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-2 py-1 border rounded mb-2"
                >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                </select>
                <button
                    onClick={handleAddCollaborator}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full py-1 rounded-lg"
                >
                    ➕ Add Collaborator
                </button>
                {statusMessage && (
                    <p className="text-xs mt-2 text-gray-600">{statusMessage}</p>
                )}
            </div>
        </div>
    );
};

export default Toolbar;