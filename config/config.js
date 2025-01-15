// config/config.js
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    whatsappPhoneId: process.env.WHATSAPP_PHONE_ID,
    whatsappApiToken: process.env.WHATSAPP_API_TOKEN,
};
