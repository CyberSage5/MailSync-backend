const User = require('../models/User');
const { getNewEmails, getMessageDetails } = require('../services/gmailService');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

// Sync emails and notify via WhatsApp
exports.syncEmails = async (req, res, next) => {
    try {
        const users = await User.find({ isGmailLinked: true });

        for (const user of users) {
            const history = await getNewEmails(user);

            for (const event of history) {
                if (event.messagesAdded) {
                    for (const message of event.messagesAdded) {
                        const details = await getMessageDetails(message.message.id);

                        if (user.importantSources.includes(details.from)) {
                            const notification = `You have a new email from ${details.from}: "${details.subject}". Check it here: https://mail.google.com/mail/u/0/#inbox`;
                            await sendWhatsAppMessage(user.whatsappNumber, notification);
                        }
                    }
                }
            }
        }

        res.status(200).json({ message: 'Email sync completed successfully.' });
    } catch (error) {
        next(error);
    }
};
