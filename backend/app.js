const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const whiteboardRoutes = require('./routes/whiteboardRoutes');
const cors  = require("cors")

const app = express();
require('dotenv').config();

app.use(cors({
    origin: `${process.env.FRONTEND}`, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/snapshots', snapshotRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/whiteboard', whiteboardRoutes);

module.exports = app;
