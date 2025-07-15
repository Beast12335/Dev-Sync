import { useCursorStore } from '../store/cursorStore';

const RemoteCursors = () => {
  const { remoteCursors } = useCursorStore();

  return (
    <>
      {Object.entries(remoteCursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute z-50 pointer-events-none"
          style={{
            top: cursor.y + 5,
            left: cursor.x + 5,
            position: 'absolute',
          }}
        >
          <div className="text-xs bg-black text-white px-2 py-0.5 rounded shadow">
            {cursor.name}
          </div>
          <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
        </div>
      ))}
    </>
  );
};

export default RemoteCursors;
