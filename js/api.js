/**
 * API Client JavaScript
 * Handles all API calls to the backend server
 */

const API_BASE_URL = 'http://localhost:3000/api';

// ===== UTILITY FUNCTIONS =====
async function apiCall(endpoint, options = {}) {
    try {
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };
        
        // Build request options
        const requestOptions = {
            method: options.method || 'GET',
            headers: { ...defaultHeaders, ...(options.headers || {}) }
        };
        
        // Only add body for POST, PUT, PATCH requests
        if (options.body && ['POST', 'PUT', 'PATCH'].includes(requestOptions.method)) {
            requestOptions.body = options.body;
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

        if (!response.ok) {
            let errorMessage = 'API request failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        // Handle empty responses
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error('API Error:', error);
        
        // Provide more helpful error messages
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Cannot connect to server. Please make sure the server is running on http://localhost:3000');
        }
        
        throw error;
    }
}

// ===== FAMILIES API =====
const familiesAPI = {
    getAll: () => apiCall('/families'),
    getById: (id) => apiCall(`/families/${id}`),
    getByFamilyId: (familyId) => apiCall(`/families/by-family-id/${familyId}`),
    create: (data) => apiCall('/families', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiCall(`/families/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`/families/${id}`, {
        method: 'DELETE'
    })
};

// ===== STOCK API =====
const stockAPI = {
    getAll: () => apiCall('/stock'),
    getById: (id) => apiCall(`/stock/${id}`),
    create: (data) => apiCall('/stock', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiCall(`/stock/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiCall(`/stock/${id}`, {
        method: 'DELETE'
    })
};

// ===== SALES API =====
const salesAPI = {
    getAll: () => apiCall('/sales'),
    getToday: () => apiCall('/sales/today'),
    create: (data) => apiCall('/sales', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

// ===== DASHBOARD API =====
const dashboardAPI = {
    getStats: () => apiCall('/dashboard/stats')
};

