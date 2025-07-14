const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  operation: { type: Object, required: true }, // stroke/erase/undo
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('History', historySchema);
