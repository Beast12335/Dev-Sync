import { create } from "zustand";

export const useBoardStore = create((set, get) => ({
  color: "#000000",
  width: 4,
  paths: [],
  history: [],
  redoStack: [],

  setColor: (color) => set({ color }),
  setWidth: (width) => set({ width }),
  setPaths: (newPaths) => set({ paths: newPaths, history: newPaths, redoStack: [] }),

  addPath: (path) => {
    const { paths, history } = get();
    set({
      paths: [...paths, path],
      history: [...history, path],
      redoStack: []
    });
  },

  undo: () => {
    const { paths, history, redoStack } = get();
    if (history.length === 0) return;
    const newHistory = [...history];
    const undone = newHistory.pop();
    set({
      paths: newHistory,
      history: newHistory,
      redoStack: [...redoStack, undone],
    });
  },

  redo: () => {
    const { history, redoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      history: [...history, next],
      paths: [...history, next],
      redoStack: redoStack.slice(0, -1),
    });
  },

  clear: () => {
    set({ paths: [], history: [], redoStack: [] });
  }
  
}));
