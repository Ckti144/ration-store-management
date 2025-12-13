/**
 * QR Code Scanning JavaScript
 * Handles ration card scanning functionality
 * Updated to use backend API
 */

let html5QrcodeScanner = null;

// ===== DOM ELEMENTS =====
const searchBtn = document.getElementById('searchFamilyBtn');
const manualFamilyIdInput = document.getElementById('manualFamilyId');
const familyDetailsCard = document.getElementById('familyDetailsCard');
const familyDetailsContent = document.getElementById('familyDetailsContent');
const scanMessage = document.getElementById('scanMessage');

// ===== EVENT LISTENERS =====
searchBtn.addEventListener('click', () => {
    const familyId = manualFamilyIdInput.value.trim();
    if (familyId) {
        searchAndDisplayFamily(familyId);
    } else {
        showScanMessage('Please enter a Family ID.', 'error');
    }
});

manualFamilyIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ===== FUNCTIONS =====
/**
 * Initialize QR code scanner
 */
function onScanSuccess(decodedText, decodedResult) {
    // Extract Family ID from scanned QR code
    // For now, we assume the QR code contains the Family ID directly
    // You can modify this based on your QR code format
    const familyId = decodedText.trim();
    
    // Stop scanning after successful scan
    if (html5QrcodeScanner) {
        html5QrcodeScanner.stop().then(() => {
            showScanMessage('Scan successful!', 'success');
            searchAndDisplayFamily(familyId);
        }).catch((err) => {
            console.error('Error stopping scanner:', err);
        });
    }
}

function onScanFailure(error) {
    // Handle scan failure (optional)
    // Most errors are handled internally by the library
}

/**
 * Search and display family details
 * @param {string} familyId - Family ID to search
 */
async function searchAndDisplayFamily(familyId) {
    try {
        const family = await familiesAPI.getByFamilyId(familyId);
        
        // Display family details
        displayFamilyDetails(family);
        showScanMessage('Family found!', 'success');
        familyDetailsCard.style.display = 'block';
    } catch (error) {
        showScanMessage('Family Not Registered', 'error');
        familyDetailsCard.style.display = 'none';
    }
}

/**
 * Display family details
 * @param {Object} family - Family object
 */
function displayFamilyDetails(family) {
    const membersHtml = family.memberList.map(member => 
        `<span class="member-tag">${member}</span>`
    ).join('');
    
    familyDetailsContent.innerHTML = `
        <div class="family-detail-item">
            <div class="family-detail-label">Family ID</div>
            <div class="family-detail-value">${family.familyId}</div>
        </div>
        <div class="family-detail-item">
            <div class="family-detail-label">Head of Family</div>
            <div class="family-detail-value">${family.headOfFamily}</div>
        </div>
        <div class="family-detail-item">
            <div class="family-detail-label">Number of Members</div>
            <div class="family-detail-value">${family.numMembers}</div>
        </div>
        <div class="family-detail-item">
            <div class="family-detail-label">Members</div>
            <div class="member-list">${membersHtml}</div>
        </div>
        <div class="family-detail-item">
            <div class="family-detail-label">Phone</div>
            <div class="family-detail-value">${family.phone}</div>
        </div>
        <div class="family-detail-item">
            <div class="family-detail-label">Address</div>
            <div class="family-detail-value">${family.address}</div>
        </div>
    `;
}

/**
 * Show scan message
 * @param {string} message - Message to show
 * @param {string} type - Message type ('success' or 'error')
 */
function showScanMessage(message, type) {
    scanMessage.textContent = message;
    scanMessage.className = `message-${type}`;
    scanMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        scanMessage.style.display = 'none';
    }, 5000);
}

/**
 * Initialize QR scanner when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize HTML5 QR Code Scanner
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };
    
    try {
        html5QrcodeScanner = new Html5Qrcode("qr-reader");
        
        html5QrcodeScanner.start(
            { facingMode: "environment" }, // Use back camera
            config,
            onScanSuccess,
            onScanFailure
        ).catch((err) => {
            console.error('Error starting QR scanner:', err);
            // If camera access fails, show manual entry option
            document.getElementById('qr-reader').innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--gray);">
                    <p>Camera access denied or not available.</p>
                    <p>Please use the manual entry option below.</p>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error initializing QR scanner:', error);
        document.getElementById('qr-reader').innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--gray);">
                <p>QR Scanner not available.</p>
                <p>Please use the manual entry option below.</p>
            </div>
        `;
    }
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.stop().catch((err) => {
            console.error('Error stopping scanner:', err);
        });
    }
});
