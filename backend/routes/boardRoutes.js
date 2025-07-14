const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createBoard, getBoards, deleteBoard } = require('../controllers/boardController');

router.post('/', protect, createBoard);
router.get('/', protect, getBoards);
router.delete('/:id', protect, deleteBoard);

module.exports = router;
