const History = require('../models/History');

exports.saveOperation = async (req, res) => {
  try {
    const history = await History.create({
      boardId: req.body.boardId,
      userId: req.user._id,
      operation: req.body.operation,
    });
    res.status(201).json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ boardId: req.params.boardId })
      .sort({ createdAt: 1 }); // oldest first
    res.status(200).json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
