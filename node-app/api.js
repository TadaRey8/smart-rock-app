const express = require('express');
const axios   = require('axios');
const router = express.Router();

// 環境変数からPicoのURLを取得（docker-compose.ymlのenvironmentで設定）
const PICO_URL = process.env.PICO_URL || 'http://192.168.0.6';

// 鍵状態取得
let lockState = 'locked';  // 初期状態

router.get('/lock', (req, res) => {
  res.json({ status: lockState });
});

/**
 * POST /v1/lock
 * サーボに「lock」コマンドを送信し、状態を 'locked' に更新
 */
router.post('/lock', async (req, res) => {
  try {
    const picoRes = await axios.get(`${PICO_URL}/command?cmd=lock`);
    console.log('Pico lock response:', picoRes.data);

    lockState = 'locked';
    res.json({ status: lockState });
  } catch (error) {
    console.error('Error sending lock to Pico:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * POST /v1/unlock
 * サーボに「unlock」コマンドを送信し、状態を 'unlocked' に更新
 */
router.post('/unlock', async (req, res) => {
  try {
    const picoRes = await axios.get(`${PICO_URL}/command?cmd=unlock`);
    console.log('Pico unlock response:', picoRes.data);

    lockState = 'unlocked';
    res.json({ status: lockState });
  } catch (error) {
    console.error('Error sending unlock to Pico:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
