const Whiteboard = require('../models/Board');
const User = require('../models/User');

exports.createBoard = async (req, res) => {
  const board = await Whiteboard.create({
    title: req.body.title,
    owner: req.user._id,
    collaborators: [{
      userId: req.user._id,
      role: 'owner',
    }],
  });
  res.status(201).json(board);
};

exports.getBoards = async (req, res) => {
  console.log("Fetching boards for user:", req.user._id);
  const boards = await Whiteboard.find({
    "collaborators.userId" : req.user._id,
  }).populate('owner', 'name email');
  res.json(boards);
};

exports.deleteBoard = async (req, res) => {
  const board = await Whiteboard.findById(req.params.id);
  if (!board || board.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  await board.deleteOne();
  res.status(204).json({ message: 'Board deleted successfully' });
};

exports.saveWhiteboard = async (req, res) => {
  const { boardId, paths } = req.body;
  console.log("Saving whiteboard for boardId:", boardId, "with paths:", paths);
  try {
    const existing = await Whiteboard.findOne({ _id: boardId });
    if (existing) {
      existing.paths = paths;
      await existing.save();
    } else {
      // await Whiteboard.create({ boardId, paths });
      console.log("board not found.")
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error saving board.' });
  }
};

exports.loadWhiteboard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await Whiteboard.findOne({ _id : boardId });
    res.json({ paths: board?.paths || [] });
  } catch (err) {
    res.status(500).json({ error: 'Error loading board.' });
  }
};

exports.addCollaborator = async (req, res) => {
  const { user, role, boardId } = req.body;
  console.log(req.body)
  try {
    const userRecord = await User.findOne({ email: user });
    if (!userRecord) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const board = await Whiteboard.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found.' });
    }
    if (board.collaborators.some(c => c.userId.toString() === userRecord._id.toString())) {
      return res.status(400).json({ error: 'User already a collaborator.' });
    }
    board.collaborators.push({ userId: userRecord._id, role });
    await board.save(); 
    res.json({ success: true, board });
  } catch (err) {
    res.status(500).json({ error: 'Error adding collaborator.',message: err.message });
    console.log(err.message)
  }
}
