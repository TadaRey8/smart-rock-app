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

// 施錠／開錠いずれも同じtoggleロジック
async function toggleHandler(req, res) {
  try {
    // Pico側の /toggle エンドポイントを叩く
    const picoRes = await axios.get(`${PICO_URL}/toggle`);
    console.log('📡 Pico responded:', picoRes.data);

    // サーバー側の状態もトグル
    lockState = (lockState === 'locked') ? 'unlocked' : 'locked';
    res.json({ status: lockState });

  } catch (error) {
    console.error('❌ Error calling Pico:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// POST /v1/lock
router.post('/lock', toggleHandler);

// POST /v1/unlock
router.post('/unlock', toggleHandler);

module.exports = router;
