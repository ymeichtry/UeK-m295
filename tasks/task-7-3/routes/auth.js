const express = require('express');
const router = express.Router();

// Dummy credentials
const validEmail = 'desk@library.example';
const validPassword = 'm295';

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.sendStatus(401);
  }
}

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === validEmail && password === validPassword) {
    req.session.isAuthenticated = true;
    req.session.email = email;
    res.status(201).json({ email });
  } else {
    res.sendStatus(401);
  }
});

// Verify endpoint
router.get('/verify', (req, res) => {
  if (req.session.isAuthenticated) {
    res.status(200).json({ email: req.session.email });
  } else {
    res.sendStatus(401);
  }
});

// Logout endpoint
router.delete('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = { router, isAuthenticated };
