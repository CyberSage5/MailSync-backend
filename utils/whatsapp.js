const axios = require('axios');

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
        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    }
};

module.exports = { sendWhatsAppMessage };
