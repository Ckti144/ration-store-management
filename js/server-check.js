/**
 * Server Connection Check
 * Checks if the backend server is running
 */

async function checkServerConnection() {
    try {
        const response = await fetch('http://localhost:3000/api/dashboard/stats');
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Check server on page load
document.addEventListener('DOMContentLoaded', async () => {
    const isServerRunning = await checkServerConnection();
    
    if (!isServerRunning) {
        // Show a prominent warning
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ef4444;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        warningDiv.innerHTML = `
            <strong>⚠️ Server Not Running!</strong><br>
            Please start the server by running: <code>npm start</code> in the project directory.<br>
            Then access the application at: <a href="http://localhost:3000/index.html" style="color: white; text-decoration: underline;">http://localhost:3000/index.html</a>
        `;
        document.body.insertBefore(warningDiv, document.body.firstChild);
    }
});

