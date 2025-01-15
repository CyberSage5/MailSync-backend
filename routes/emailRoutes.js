const express = require('express');
const { syncEmails } = require('../controllers/emailController');

const router = express.Router();

// Route to trigger email sync
router.post('/sync-emails', syncEmails);

module.exports = router;
