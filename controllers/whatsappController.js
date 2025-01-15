const User = require('../models/User');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

exports.verifyWhatsAppNumber = async (req, res) => {
    const { userId, whatsappNumber } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Send verification message
        const message = 'Welcome to MailSync! Your WhatsApp number has been verified.';
        await sendWhatsAppMessage(whatsappNumber, message);

        // Update user
        user.whatsappNumber = whatsappNumber;
        user.whatsappVerified = true;
        await user.save();

        res.status(200).json({ message: 'WhatsApp number verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying WhatsApp number', error });
    }
};
