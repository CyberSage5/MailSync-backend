const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
);

// Initialize Gmail client
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Fetch email history
exports.getNewEmails = async (user) => {
    oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken,
    });

    const response = await gmail.users.history.list({
        userId: 'me',
        startHistoryId: user.lastHistoryId,
    });

    return response.data.history || [];
};

// Get message details
exports.getMessageDetails = async (messageId) => {
    const response = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'metadata',
    });

    const headers = response.data.payload.headers;
    return {
        from: headers.find(h => h.name === 'From')?.value,
        subject: headers.find(h => h.name === 'Subject')?.value,
    };
};
