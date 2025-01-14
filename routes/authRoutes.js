const express = require('express');
const router = express.Router();
const { signup, loginUser } = require('../controllers/authController'); // Import loginUser correctly

// User Signup Route
router.post('/signup', signup);

// User Login Route
router.post('/login', loginUser); // Use loginUser function

module.exports = router;
