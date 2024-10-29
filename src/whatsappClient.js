const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth() // Keeps session active between restarts
});

let userSession = {}; // Store temporary session data for each user

// Generate and display the QR code for WhatsApp authentication
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("QR code generated, waiting for scan...");
});

// Log when the client is ready
client.on('ready', () => {
    console.log('Client is ready!');
});

// Log client authentication status
client.on('authenticated', () => {
    console.log('WhatsApp client authenticated');
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client disconnected:', reason);
    console.log('Restarting client...');
    client.initialize(); // Re-initialize client if disconnected
});

module.exports = { client, userSession };
