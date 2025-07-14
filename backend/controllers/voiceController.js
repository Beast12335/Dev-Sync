const axios = require('axios');
const FormData = require('form-data');
const VoiceNote = require('../models/VoiceNote');

exports.transcribeVoice = async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: 'audio.webm',
      contentType: 'audio/webm'
    });
    form.append('model', 'whisper-1');
    form.append('language', 'en');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders()
      }
    });

    const note = await VoiceNote.create({
      boardId: req.body.boardId,
      userId: req.user._id,
      text: response.data.text
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Transcription failed', details: err.message });
  }
};
