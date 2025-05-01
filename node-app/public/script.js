document.getElementById('lockBtn').addEventListener('click', () => {
  fetch('/api/lock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(r => r.json())
    .then(data => {
      document.getElementById('statusMessage').innerText = data.status;
    });
});

document.getElementById('unlockBtn').addEventListener('click', () => {
    fetch('/api/unlock', {    // ← ここを/api/unlock に変更！
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(r => r.json())
    .then(data => {
      document.getElementById('statusMessage').innerText = data.status;
    });
});
