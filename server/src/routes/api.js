const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const addon = require('../../build/Release/analyticsAddon');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Accès refusé' });
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); // Hachage sécurisé
    const user = new User({ email, passwordHash });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de l’inscription' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Erreur login:', err.message, err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/data', authenticate, async (req, res) => {
  try {
    const data = [100, 200, 300];
    const average = addon.computeAverage(data);
    res.json({ data, average });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;