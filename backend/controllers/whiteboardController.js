import Whiteboard from '../models/WhiteBoard.js';

export const saveWhiteboard = async (req, res) => {
  const { boardId, paths } = req.body;

  try {
    const existing = await Whiteboard.findOne({ boardId });

    if (existing) {
      existing.paths = paths;
      await existing.save();
    } else {
      await Whiteboard.create({ boardId, paths });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error saving board.' });
  }
};

export const loadWhiteboard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await Whiteboard.findOne({ boardId });
    res.json({ paths: board?.paths || [] });
  } catch (err) {
    res.status(500).json({ error: 'Error loading board.' });
  }
};
