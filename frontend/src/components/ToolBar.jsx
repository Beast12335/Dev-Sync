import { useBoardStore } from "../store/boardStore";

const Toolbar = ({ onClear }) => {
    const {
        color,
        width,
        setColor,
        setWidth,
        undo,
        redo,
        clear
    } = useBoardStore();

    const handleExport = () => {
        const canvas = document.querySelector("canvas");
        const link = document.createElement("a");
        link.download = "whiteboard.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
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
        </div>
    );
};

export default Toolbar;
