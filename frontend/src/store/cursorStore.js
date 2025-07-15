import { create } from 'zustand';

export const useCursorStore = create((set) => ({
  remoteCursors: {},

  updateCursor: (userId, cursorData) =>
    set((state) => ({
      remoteCursors: {
        ...state.remoteCursors,
        [userId]: cursorData,
      },
    })),

  removeCursor: (userId) =>
    set((state) => {
      const updated = { ...state.remoteCursors };
      delete updated[userId];
      return { remoteCursors: updated };
    }),
}));
