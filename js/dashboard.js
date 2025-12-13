/**
 * Dashboard JavaScript
 * Handles dashboard statistics and table rendering
 * Updated to use backend API
 */

// ===== RENDER FUNCTIONS =====
/**
 * Render dashboard statistics cards
 */
async function renderDashboard() {
    try {
        // Get dashboard stats from API
        const stats = await dashboardAPI.getStats();
        
        // Update stat cards
        document.getElementById('totalStockItems').textContent = stats.totalStockItems || 0;
        document.getElementById('todaySalesAmount').textContent = formatCurrency(stats.todaySalesAmount || 0);
        document.getElementById('todaySalesCount').textContent = `${stats.todaySalesCount || 0} transactions`;
        document.getElementById('registeredFamilies').textContent = stats.registeredFamilies || 0;
        document.getElementById('lowStockItems').textContent = stats.lowStockItems || 0;
        
        // Render stock status table
        await renderStockStatusTable();
        
        // Render low stock alerts table
        await renderLowStockTable();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Error loading dashboard data. Make sure the server is running.');
    }
}

/**
 * Render stock status table
 */
async function renderStockStatusTable() {
    try {
        const stockItems = await stockAPI.getAll();
        const tbody = document.getElementById('stockStatusBody');
        
        if (stockItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No stock items available. Add items in Stock Analysis.</td></tr>';
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
                    <td>${item.currentStock}</td>
                    <td>${item.threshold}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading stock status:', error);
        document.getElementById('stockStatusBody').innerHTML = '<tr><td colspan="5" class="empty-state">Error loading stock data.</td></tr>';
    }
}

/**
 * Render low stock alerts table
 */
async function renderLowStockTable() {
    try {
        const stockItems = await stockAPI.getAll();
        const lowStockItems = stockItems.filter(item => {
            return parseFloat(item.currentStock) <= parseFloat(item.threshold);
        });
        const tbody = document.getElementById('lowStockBody');
        
        if (lowStockItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No low stock items. All items are well-stocked!</td></tr>';
            return;
        }
        
        tbody.innerHTML = lowStockItems.map(item => {
            return `
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.category}</td>
                    <td style="color: var(--danger); font-weight: 600;">${item.currentStock}</td>
                    <td>${item.threshold}</td>
                    <td><a href="stock.html" class="btn btn-sm btn-primary">Manage</a></td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading low stock alerts:', error);
        document.getElementById('lowStockBody').innerHTML = '<tr><td colspan="5" class="empty-state">Error loading low stock data.</td></tr>';
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
});
