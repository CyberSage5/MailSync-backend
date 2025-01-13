const { sendWhatsAppMessage } = require('./whatsappServices');

async function sendEmailNotification(userId, message) {
  try {
    // Fetch user's session and send the notification
    const user = await User.findById(userId);
    await sendWhatsAppMessage(user.whatsappSession, message);
  } catch (error) {
    console.error('Error in sending email notification:', error);
  }
}

module.exports = { sendEmailNotification };
