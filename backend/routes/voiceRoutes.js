const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { transcribeVoice } = require('../controllers/voiceController');
const multer = require('multer');
const upload = multer();

router.post('/transcribe', protect, upload.single('audio'), transcribeVoice);

module.exports = router;
