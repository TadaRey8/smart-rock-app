import React from 'react';

function App() {
    const handleUnlock = async () => {
        try {
            const response = await fetch('/api/unlock', { method: 'POST' });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('Failed to unlock the door');
        }
    };

    return (
        <div>
            <h1>Smart Rock</h1>
            <button onClick={handleUnlock}>Unlock Door</button>
        </div>
    );
}

export default App;