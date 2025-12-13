/**
 * Sales Management JavaScript
 * Handles sales entry and reporting
 * Updated to use backend API
 */

// ===== DOM ELEMENTS =====
const saleForm = document.getElementById('saleForm');
const familyIdInput = document.getElementById('saleFamilyId');
const itemSelect = document.getElementById('saleItem');
const quantityInput = document.getElementById('saleQuantity');
const priceInput = document.getElementById('salePrice');
const totalInput = document.getElementById('saleTotal');

// ===== EVENT LISTENERS =====
saleForm.addEventListener('submit', handleSaleSubmit);

// Calculate total when quantity or price changes
quantityInput.addEventListener('input', calculateTotal);
priceInput.addEventListener('input', calculateTotal);

// Check family when family ID is entered
familyIdInput.addEventListener('input', checkFamily);

// Load items and families when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStockItems();
    loadFamilyList();
    renderSalesReport();
});

// ===== FUNCTIONS =====
/**
 * Calculate total amount
 */
function calculateTotal() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = quantity * price;
    totalInput.value = formatCurrency(total);
}

/**
 * Load stock items into select dropdown
 */
async function loadStockItems() {
    try {
        const stockItems = await stockAPI.getAll();
        itemSelect.innerHTML = '<option value="">Select Item</option>';
        
        stockItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.itemName} (Available: ${item.currentStock} ${item.category})`;
            option.dataset.stock = item.currentStock;
            itemSelect.appendChild(option);
        });
        
        // Update price when item is selected
        itemSelect.addEventListener('change', async (e) => {
            const selectedItemId = e.target.value;
            if (selectedItemId) {
                try {
                    const item = await stockAPI.getById(selectedItemId);
                    const maxQuantity = parseFloat(item.currentStock);
                    quantityInput.max = maxQuantity;
                    quantityInput.placeholder = `Max: ${maxQuantity}`;
                } catch (error) {
                    console.error('Error loading item:', error);
                }
            }
        });
    } catch (error) {
        console.error('Error loading stock items:', error);
        showError('Error loading stock items. Make sure the server is running.');
    }
}

/**
 * Load family list for datalist
 */
async function loadFamilyList() {
    try {
        const families = await familiesAPI.getAll();
        const datalist = document.getElementById('familyIdList');
        datalist.innerHTML = '';
        
        families.forEach(family => {
            const option = document.createElement('option');
            option.value = family.familyId;
            option.textContent = `${family.familyId} - ${family.headOfFamily}`;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading families:', error);
    }
}

/**
 * Check if family exists
 */
async function checkFamily() {
    const familyId = familyIdInput.value.trim();
    const familyInfo = document.getElementById('familyInfo');
    
    if (!familyId) {
        familyInfo.textContent = '';
        return;
    }
    
    try {
        const family = await familiesAPI.getByFamilyId(familyId);
        familyInfo.textContent = `Family: ${family.headOfFamily} (${family.numMembers} members)`;
        familyInfo.style.color = 'var(--success)';
    } catch (error) {
        familyInfo.textContent = 'Family not found';
        familyInfo.style.color = 'var(--danger)';
    }
}

/**
 * Handle sale form submission
 * @param {Event} e - Form submit event
 */
async function handleSaleSubmit(e) {
    e.preventDefault();
    
    const familyId = familyIdInput.value.trim();
    const itemId = itemSelect.value;
    const quantity = parseFloat(quantityInput.value);
    const price = parseFloat(priceInput.value);
    const total = quantity * price;
    
    // Validation
    if (quantity <= 0) {
        showError('Quantity must be greater than 0.');
        return;
    }
    
    if (price <= 0) {
        showError('Price must be greater than 0.');
        return;
    }
    
    try {
        // Create sale via API (API will validate family, stock, and update stock)
        const saleData = {
            familyId: familyId,
            itemId: itemId,
            quantity: quantity,
            unitPrice: price,
            totalAmount: total
        };
        
        await salesAPI.create(saleData);
        
        // Reload items and sales report
        await loadStockItems();
        await renderSalesReport();
        
        // Reset form
        saleForm.reset();
        totalInput.value = '';
        document.getElementById('familyInfo').textContent = '';
        
        showSuccess('Sale recorded successfully!');
    } catch (error) {
        showError(error.message || 'Error recording sale. Please try again.');
    }
}

/**
 * Render sales report table
 */
async function renderSalesReport() {
    try {
        const sales = await salesAPI.getAll();
        const tbody = document.getElementById('salesTableBody');
        
        if (sales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No sales recorded yet.</td></tr>';
            return;
        }
        
        // Sort by date (newest first)
        const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        tbody.innerHTML = sortedSales.map(sale => {
            return `
                <tr>
                    <td>${formatDate(sale.date)}</td>
                    <td>${sale.familyId}</td>
                    <td>${sale.itemName}</td>
                    <td>${sale.quantity}</td>
                    <td>${formatCurrency(sale.unitPrice)}</td>
                    <td><strong>${formatCurrency(sale.totalAmount)}</strong></td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading sales:', error);
        document.getElementById('salesTableBody').innerHTML = '<tr><td colspan="6" class="empty-state">Error loading sales data. Make sure the server is running.</td></tr>';
    }
}
