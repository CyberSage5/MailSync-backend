const { linkWhatsApp, sendWhatsAppNotification } = require('../services/whatsappService');
const User = require('../models/User');

// Link WhatsApp Account to User
exports.linkWhatsApp = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Ensure the user is authenticated
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Link the WhatsApp account (this will trigger QR code scanning)
    const result = await linkWhatsApp(phoneNumber);

    // Store the phone number in the user model (not yet authenticated, just storing the phone number)
    user.whatsappSession = { phoneNumber };
    await user.save();

    res.status(200).json({
      message: result.message,
      qrCodeUrl: result.qrCodeUrl,  // Send QR code URL for the user to scan
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while linking WhatsApp" });
  }
};

// Send WhatsApp Notification to User
exports.sendWhatsAppNotification = async (req, res) => {
  const { message, phoneNumber } = req.body;

  try {
    // Ensure the user is authenticated
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user has a WhatsApp session linked
    if (!user.whatsappSession) {
      return res.status(400).json({ message: "WhatsApp account not linked" });
    }

    // Send the WhatsApp message using the user's linked account
    const response = await sendWhatsAppNotification(user.whatsappSession, phoneNumber, message);

    res.status(200).json({ message: "Notification sent successfully", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while sending WhatsApp notification" });
  }
};
