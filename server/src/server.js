require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const addon = require('../build/Release/analyticsAddon');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'],
  pingTimeout: 20000,
  pingInterval: 25000
});

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kepler:kepler69.@cluster0.akdya80.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err.message));

app.use('/', apiRoutes);

io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  socket.on('disconnect', (reason) => console.log('Client déconnecté:', socket.id, reason));
  setInterval(() => {
    const data = [Math.random() * 1000];
    const average = addon.computeAverage(data);
    socket.emit('dataUpdate', { data, average });
  }, 5000);
});

server.listen(3000, () => console.log('Serveur sur port 3000'));