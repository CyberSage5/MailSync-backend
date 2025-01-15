// routes/whatsappRoutes.js
const express = require('express');
const { sendWhatsAppMessage } = require('../services/whatsappService');
const { verifyUser } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to send WhatsApp message
router.post('/send-message', verifyUser, async (req, res) => {
    const { phoneNumber, message } = req.body;

    try {
        const response = await sendWhatsAppMessage(phoneNumber, message);
        res.status(200).json({ success: true, message: 'Message sent successfully!', response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending message', error });
    }
});

module.exports = router;
