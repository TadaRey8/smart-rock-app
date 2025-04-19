const express = require('express');
const { sendUnlockSignal } = require('./pico-connector');

const router = express.Router();

router.post('/unlock', async (req, res) => {
    try {
        await sendUnlockSignal();
        res.status(200).send({ message: 'Unlock signal sent to Raspberry Pi Pico W' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to send unlock signal' });
    }
});

module.exports = router;