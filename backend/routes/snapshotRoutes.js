const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/rbacMiddleware');
const { saveSnapshot, getSnapshots } = require('../controllers/snapshotController');

router.post('/', protect, requireRole(['owner', 'editor']), saveSnapshot);
router.get('/:boardId', protect, requireRole(['viewer', 'editor', 'owner']), getSnapshots);


module.exports = router;
