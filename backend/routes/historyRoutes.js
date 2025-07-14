const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { saveOperation, getHistory } = require('../controllers/historyController');

router.post('/', protect, saveOperation);
router.get('/:boardId', protect, getHistory);

module.exports = router;
