// services/whatsappService.js
const axios = require('axios');
const logger = require('../utils/logger');  // Logging utility

const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
        const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
        const headers = {
            Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
        };
        const data = {
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'text',
            text: { body: message },
        };

        const response = await axios.post(url, data, { headers });

        logger.info(`Message sent to ${phoneNumber}: ${response.data}`);
        return response.data;
    } catch (error) {
        logger.error(`Error sending WhatsApp message to ${phoneNumber}: ${error.response?.data || error.message}`);
        throw error;
    }
};

module.exports = { sendWhatsAppMessage };
