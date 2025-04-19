const axios = require('axios');

const PICO_IP = process.env.PICO_IP || '192.168.1.100';

async function sendUnlockSignal() {
    try {
        const response = await axios.get(`http://${PICO_IP}:8080`, {
            params: { command: 'UNLOCK' },
        });
        console.log('Response from Pico:', response.data);
    } catch (error) {
        console.error('Error communicating with Pico:', error.message);
        throw error;
    }
}

module.exports = { sendUnlockSignal };