const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const snapshotRoutes = require('./routes/snapshotRoutes');
const historyRoutes = require('./routes/historyRoutes');
const voiceRoutes = require('./routes/voiceRoutes');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/snapshots', snapshotRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/voice', voiceRoutes);

module.exports = app;
