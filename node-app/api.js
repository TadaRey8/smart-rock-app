const express = require('express');
const router = express.Router();

let lockState = 'locked';  // 初期状態

router.get('/lock', (req, res) => {
  res.json({ status: lockState });
});

router.post('/lock', (req, res) => {
  lockState = lockState === 'locked' ? 'unlocked' : 'locked';
  res.json({ status: lockState });
});

module.exports = router;
