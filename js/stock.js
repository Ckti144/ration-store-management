/**
 * Stock Management JavaScript
 * Handles stock item CRUD operations
 * Updated to use backend API
 */

let currentEditStockId = null;

// ===== DOM ELEMENTS =====
const modal = document.getElementById('stockModal');
const form = document.getElementById('stockForm');
const addBtn = document.getElementById('addStockBtn');
const closeBtn = document.getElementById('closeStockModal');
const cancelBtn = document.getElementById('cancelStockBtn');

// ===== EVENT LISTENERS =====
addBtn.addEventListener('click', () => {
    currentEditStockId = null;
    form.reset();
    document.getElementById('stockModalTitle').textContent = 'Add Stock Item';
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

form.addEventListener('submit', handleFormSubmit);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ===== FUNCTIONS =====
/**
 * Close modal
 */
function closeModal() {
    modal.style.display = 'none';
    form.reset();
    currentEditStockId = null;
}

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const itemName = document.getElementById('itemName').value.trim();
    const category = document.getElementById('category').value;
    const totalStock = parseFloat(document.getElementById('totalStock').value);
    const currentStock = parseFloat(document.getElementById('currentStock').value);
    const threshold = parseFloat(document.getElementById('threshold').value);
    
    // Validation
    if (currentStock > totalStock) {
        alert('Current stock cannot be greater than total stock.');
        return;
    }
    
    const stockData = {
        itemName: itemName,
        category: category,
        totalStock: totalStock,
        currentStock: currentStock,
        threshold: threshold
    };
    
    try {
        if (currentEditStockId) {
            // Update existing item
            await stockAPI.update(currentEditStockId, stockData);
            showSuccess('Stock item updated successfully!');
        } else {
            // Create new item
            await stockAPI.create(stockData);
            showSuccess('Stock item added successfully!');
        }
        
        renderStockTable();
        closeModal();
    } catch (error) {
        showError(error.message || 'Error saving stock item. Please try again.');
    }
}

/**
 * Edit stock item
 * @param {string} id - Stock item ID
 */
async function editStock(id) {
    try {
        const item = await stockAPI.getById(id);
        
        currentEditStockId = id;
        document.getElementById('editStockId').value = id;
        document.getElementById('itemName').value = item.itemName;
        document.getElementById('category').value = item.category;
        document.getElementById('totalStock').value = item.totalStock;
        document.getElementById('currentStock').value = item.currentStock;
        document.getElementById('threshold').value = item.threshold;
        
        document.getElementById('stockModalTitle').textContent = 'Edit Stock Item';
        modal.style.display = 'block';
    } catch (error) {
        showError(error.message || 'Error loading stock item data.');
    }
}

/**
 * Delete stock item
 * @param {string} id - Stock item ID
 */
async function deleteStock(id) {
    if (!confirm('Are you sure you want to delete this stock item? This action cannot be undone.')) {
        return;
    }
    
    try {
        await stockAPI.delete(id);
        showSuccess('Stock item deleted successfully!');
        renderStockTable();
    } catch (error) {
        showError(error.message || 'Error deleting stock item. Please try again.');
    }
}

/**
 * Render stock table
 */
async function renderStockTable() {
    try {
        const stockItems = await stockAPI.getAll();
        const tbody = document.getElementById('stockTableBody');
        
        if (stockItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No stock items available. Click "Add Stock Item" to add.</td></tr>';
            return;
        }
        
        tbody.innerHTML = stockItems.map(item => {
            const isLowStock = parseFloat(item.currentStock) <= parseFloat(item.threshold);
            const statusClass = isLowStock ? 'status-low' : 'status-ok';
            const statusText = isLowStock ? 'Low Stock' : 'In Stock';
            
            return `
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.category}</td>
                    <td>${item.totalStock}</td>
                    <td>${item.currentStock}</td>
                    <td>${item.threshold}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editStock('${item.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteStock('${item.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading stock items:', error);
        document.getElementById('stockTableBody').innerHTML = '<tr><td colspan="7" class="empty-state">Error loading stock data. Make sure the server is running.</td></tr>';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderStockTable();
});
