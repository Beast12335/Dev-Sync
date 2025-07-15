const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { saveWhiteboard, loadWhiteboard,createBoard,getBoards,deleteBoard } = require('../controllers/whiteboardController');

const router = express.Router();

router.post('/save', protect, saveWhiteboard);
router.get('/load/:boardId', protect, loadWhiteboard);
router.post('/', protect, createBoard);
router.get('/', protect, getBoards);
router.delete('/:id', protect, deleteBoard);

module.exports = router;