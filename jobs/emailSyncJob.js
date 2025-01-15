const cron = require('node-cron');
const { syncEmails } = require('../controllers/emailController');
const { sendWhatsAppMessage } = require('../utils/whatsapp');
const User = require('../models/User');

cron.schedule('0 */5 * * *', async () => {
    console.log('Running scheduled email sync...');

    // Sync emails
    const emailResults = await syncEmails(); // Sync logic goes here

    // Notify users
    for (const user of emailResults) {
        const { whatsappNumber, importantSources, newEmails } = user;

        // Filter emails based on user-defined important sources
        const relevantEmails = newEmails.filter(email =>
            importantSources.includes(email.source)
        );

        if (relevantEmails.length > 0) {
            const message = `You have ${relevantEmails.length} new emails from your important sources: ${relevantEmails.map(e => e.source).join(', ')}. Check your inbox for details!`;

            // Send WhatsApp notification
            await sendWhatsAppMessage(whatsappNumber, message);
        }
    }
});
