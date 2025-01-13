const { default: makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');
const qrcode = require('qrcode'); // To generate the QR code
const path = require('path');

// Link WhatsApp Account to User's Phone Number
exports.linkWhatsApp = async (phoneNumber) => {
  try {
    // Set up the auth state for the session
    const { state, saveState } = await useMultiFileAuthState(path.join(__dirname, 'sessions', phoneNumber));

    // Create a WhatsApp socket (this will initiate the QR code scanning process)
    const sock = makeWASocket({
      auth: state,
    });

    // Generate QR code for the user to scan
    sock.ev.on('qr', (qr) => {
      qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          console.error('Error generating QR code: ', err);
          throw new Error('Failed to generate QR code');
        }
        console.log('QR Code:', url); // Here you can send the QR code URL back to the user
      });
    });

    // Listen for connection events
    sock.ev.on('open', async () => {
      console.log('WhatsApp connected');
      // Save the session data once authenticated
      await saveState();
    });

    // Handle connection errors
    sock.ev.on('close', (reason) => {
      console.log('Connection closed', reason);
    });

    // Connect to WhatsApp Web
    await sock.connect();

    return { success: true, message: 'WhatsApp authentication successful. Session saved.' };

  } catch (error) {
    console.error('Error linking WhatsApp: ', error);
    throw new Error('Failed to link WhatsApp');
  }
};

// Send WhatsApp Notification to User
exports.sendWhatsAppNotification = async (whatsappSession, phoneNumber, message) => {
  try {
    // Load the WhatsApp session data
    const { state, saveState } = await useMultiFileAuthState(path.join(__dirname, 'sessions', whatsappSession.phoneNumber));

    const sock = makeWASocket({
      auth: state,
    });

    // Connect to WhatsApp Web
    await sock.connect();

    // Send a WhatsApp message to the user
    const response = await sock.sendMessage(phoneNumber + '@s.whatsapp.net', { text: message });

    // Save the updated session data
    await saveState();

    return response;
  } catch (error) {
    console.error("Error sending WhatsApp message: ", error);
    throw new Error("Error sending WhatsApp message");
  }
};
