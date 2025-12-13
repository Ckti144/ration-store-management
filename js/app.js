/**
 * Main Application JavaScript
 * Handles localStorage utilities and common functions
 */

// ===== LOCALSTORAGE KEYS =====
const STORAGE_KEYS = {
    FAMILIES: 'families',
    STOCK_ITEMS: 'stockItems',
    SALES: 'sales',
    TODAY_SALES_AMOUNT: 'todaySalesAmount',
    TODAY_SALES_COUNT: 'todaySalesCount'
};

// ===== DATA LOADING FUNCTIONS =====
/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed data or default value
 */
function loadData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) {
            return defaultValue;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading data for key ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 */
function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving data for key ${key}:`, error);
        alert('Error saving data. Please try again.');
    }
}

// ===== DATA MANAGEMENT FUNCTIONS =====
/**
 * Initialize localStorage with default values if needed
 */
function initializeStorage() {
    if (loadData(STORAGE_KEYS.FAMILIES) === null) {
        saveData(STORAGE_KEYS.FAMILIES, []);
    }
    if (loadData(STORAGE_KEYS.STOCK_ITEMS) === null) {
        saveData(STORAGE_KEYS.STOCK_ITEMS, []);
    }
    if (loadData(STORAGE_KEYS.SALES) === null) {
        saveData(STORAGE_KEYS.SALES, []);
    }
    if (loadData(STORAGE_KEYS.TODAY_SALES_AMOUNT) === null) {
        saveData(STORAGE_KEYS.TODAY_SALES_AMOUNT, 0);
    }
    if (loadData(STORAGE_KEYS.TODAY_SALES_COUNT) === null) {
        saveData(STORAGE_KEYS.TODAY_SALES_COUNT, 0);
    }
}

/**
 * Update today's sales statistics
 * @param {number} amount - Amount to add
 */
function updateTodaySales(amount) {
    const today = new Date().toDateString();
    const lastUpdate = loadData('lastSalesUpdate', '');
    
    // Reset if it's a new day
    if (lastUpdate !== today) {
        saveData(STORAGE_KEYS.TODAY_SALES_AMOUNT, 0);
        saveData(STORAGE_KEYS.TODAY_SALES_COUNT, 0);
        saveData('lastSalesUpdate', today);
    }
    
    const currentAmount = loadData(STORAGE_KEYS.TODAY_SALES_AMOUNT, 0);
    const currentCount = loadData(STORAGE_KEYS.TODAY_SALES_COUNT, 0);
    
    saveData(STORAGE_KEYS.TODAY_SALES_AMOUNT, currentAmount + amount);
    saveData(STORAGE_KEYS.TODAY_SALES_COUNT, currentCount + 1);
}

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
}

// ===== UTILITY FUNCTIONS =====
/**
 * Show success message
 * @param {string} message - Message to show
 */
function showSuccess(message) {
    // You can customize this to show a toast notification
    alert(message);
}

/**
 * Show error message
 * @param {string} message - Message to show
 */
function showError(message) {
    alert(message);
}

// Note: localStorage initialization removed - now using backend API
// Keep formatDate and formatCurrency functions for UI



