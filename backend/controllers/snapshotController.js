const Snapshot = require('../models/Snapshot');

exports.saveSnapshot = async (req, res) => {
  try {
    const snapshot = await Snapshot.create({
      boardId: req.body.boardId,
      userId: req.user._id,
      data: req.body.data,
    });
    res.status(201).json(snapshot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSnapshots = async (req, res) => {
  try {
    const snapshots = await Snapshot.find({ boardId: req.params.boardId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json(snapshots);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
