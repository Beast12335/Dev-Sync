import express from 'express';
import { saveWhiteboard, loadWhiteboard } from '../controllers/whiteboardController.js';

const router = express.Router();

router.post('/save', saveWhiteboard);
router.get('/load/:boardId', loadWhiteboard);

export default router;
