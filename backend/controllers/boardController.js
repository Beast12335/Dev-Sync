const Board = require('../models/Board');

exports.createBoard = async (req, res) => {
  const board = await Board.create({
    title: req.body.title,
    owner: req.user._id,
    collaborators: [req.user._id],
  });
  res.status(201).json(board);
};

exports.getBoards = async (req, res) => {
  const boards = await Board.find({
    collaborators: req.user._id,
  }).populate('owner', 'name email');
  res.json(boards);
};

exports.deleteBoard = async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board || board.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  await board.deleteOne();
  res.status(204).json({ message: 'Board deleted successfully' });
};
