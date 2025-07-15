import mongoose from 'mongoose';

const whiteboardSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  paths: [
    {
      path: [{ x: Number, y: Number }],
      color: String,
      width: Number,
    },
  ],
});

export default mongoose.model('Whiteboard', whiteboardSchema);
