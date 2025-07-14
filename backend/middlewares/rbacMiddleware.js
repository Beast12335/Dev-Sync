const Board = require('../models/Board');

exports.requireRole = (roles = []) => {
  return async (req, res, next) => {
    const board = await Board.findById(req.body.boardId || req.params.boardId);
    if (!board) return res.status(404).json({ error: 'Board not found' });

    const entry = board.collaborators.find(c =>
      c.userId.toString() === req.user._id.toString()
    );

    if (!entry || (Array.isArray(roles) && !roles.includes(entry.role))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};
