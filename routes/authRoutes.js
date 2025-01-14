const express = require('express');
const router = express.Router();
const { signup, verifyEmail, loginUser } = require('../controllers/authController');

// User Signup Route
router.post('/signup', signup);

// Email Verification Route
router.get('/verify-email/:token', verifyEmail);

// User Login Route
router.post('/login', loginUser);

module.exports = router;
