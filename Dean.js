const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', qr => {
    console.log('Escaneia esse QR Code aí 👇');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Dean conectado 😎🔥');
});

client.on('message', message => {
    if (message.body.toLowerCase() === 'oi') {
        message.reply('Fala comigo, gatinha 😏🔥');
    }
});

client.initialize();
