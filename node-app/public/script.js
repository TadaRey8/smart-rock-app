document.getElementById('lockBtn').addEventListener('click', () => {
    fetch('/api/lock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'lock' }),
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('statusMessage').innerText = data.message;
      })
      .catch(error => console.error('Error:', error));
  });
  
  document.getElementById('unlockBtn').addEventListener('click', () => {
    fetch('/api/lock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'unlock' }),
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('statusMessage').innerText = data.message;
      })
      .catch(error => console.error('Error:', error));
  });  