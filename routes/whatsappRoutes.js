const express = require('express');
const router = express.Router();
const { linkWhatsApp, sendWhatsAppNotification } = require('../controllers/whatsappController');
const { authMiddleware } = require('../middlewares/authMiddleware');


// Route to authenticate and link WhatsApp account
router.post('/link', authMiddleware, linkWhatsApp);

//router.post('/send-message', sendWhatsAppMessage); // This should match the function in the controller


// Route to send WhatsApp notification
router.post('/send-notification', authMiddleware, sendWhatsAppNotification);

module.exports = router;
