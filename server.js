/**
 * Ration Store Management System - Backend Server
 * Node.js + Express + SQLite
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serve static files

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// ===== DATABASE INITIALIZATION =====
function initializeDatabase() {
    // Create Families table
    db.run(`CREATE TABLE IF NOT EXISTS families (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        family_id TEXT UNIQUE NOT NULL,
        head_of_family TEXT NOT NULL,
        num_members INTEGER NOT NULL,
        member_list TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        aadhaar TEXT,
        card_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Stock Items table
    db.run(`CREATE TABLE IF NOT EXISTS stock_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        category TEXT NOT NULL,
        total_stock REAL NOT NULL,
        current_stock REAL NOT NULL,
        threshold REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Sales table
    db.run(`CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        family_id TEXT NOT NULL,
        item_id INTEGER NOT NULL,
        item_name TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit_price REAL NOT NULL,
        total_amount REAL NOT NULL,
        sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES stock_items(id)
    )`);

    console.log('Database tables initialized.');
}

// ===== API ROUTES =====

// ===== FAMILIES ROUTES =====
// Get all families
app.get('/api/families', (req, res) => {
    db.all('SELECT * FROM families ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const families = rows.map(row => ({
            id: row.id.toString(),
            familyId: row.family_id,
            headOfFamily: row.head_of_family,
            numMembers: row.num_members,
            memberList: JSON.parse(row.member_list),
            address: row.address,
            phone: row.phone,
            aadhaar: row.aadhaar,
            cardType: row.card_type,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        res.json(families);
    });
});

// Get family by ID
app.get('/api/families/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM families WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Family not found' });
            return;
        }
        res.json({
            id: row.id.toString(),
            familyId: row.family_id,
            headOfFamily: row.head_of_family,
            numMembers: row.num_members,
            memberList: JSON.parse(row.member_list),
            address: row.address,
            phone: row.phone,
            aadhaar: row.aadhaar,
            cardType: row.card_type,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    });
});

// Get family by Family ID
app.get('/api/families/by-family-id/:familyId', (req, res) => {
    const familyId = req.params.familyId;
    db.get('SELECT * FROM families WHERE family_id = ?', [familyId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Family not found' });
            return;
        }
        res.json({
            id: row.id.toString(),
            familyId: row.family_id,
            headOfFamily: row.head_of_family,
            numMembers: row.num_members,
            memberList: JSON.parse(row.member_list),
            address: row.address,
            phone: row.phone,
            aadhaar: row.aadhaar,
            cardType: row.card_type,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    });
});

// Create family
app.post('/api/families', (req, res) => {
    const { familyId, headOfFamily, numMembers, memberList, address, phone, aadhaar, cardType } = req.body;

    if (!familyId || !headOfFamily || !numMembers || !memberList || !address || !phone) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run(
        'INSERT INTO families (family_id, head_of_family, num_members, member_list, address, phone, aadhaar, card_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [familyId, headOfFamily, numMembers, JSON.stringify(memberList), address, phone, aadhaar, cardType],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    res.status(400).json({ error: 'Family ID already exists' });
                } else {
                    res.status(500).json({ error: err.message });
                }
                return;
            }
            res.status(201).json({
                id: this.lastID.toString(),
                familyId,
                headOfFamily,
                numMembers,
                memberList,
                address,
                phone,
                aadhaar,
                cardType
            });
        }
    );
});

// Update family
app.put('/api/families/:id', (req, res) => {
    const id = req.params.id;
    const { familyId, headOfFamily, numMembers, memberList, address, phone, aadhaar, cardType } = req.body;

    if (!familyId || !headOfFamily || !numMembers || !memberList || !address || !phone) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run(
        'UPDATE families SET family_id = ?, head_of_family = ?, num_members = ?, member_list = ?, address = ?, phone = ?, aadhaar = ?, card_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [familyId, headOfFamily, numMembers, JSON.stringify(memberList), address, phone, aadhaar, cardType, id],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    res.status(400).json({ error: 'Family ID already exists' });
                } else {
                    res.status(500).json({ error: err.message });
                }
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Family not found' });
                return;
            }
            res.json({ message: 'Family updated successfully', id: id });
        }
    );
});

// Delete family
app.delete('/api/families/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM families WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Family not found' });
            return;
        }
        res.json({ message: 'Family deleted successfully' });
    });
});

// ===== STOCK ITEMS ROUTES =====
// Get all stock items
app.get('/api/stock', (req, res) => {
    db.all('SELECT * FROM stock_items ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const items = rows.map(row => ({
            id: row.id.toString(),
            itemName: row.item_name,
            category: row.category,
            totalStock: row.total_stock,
            currentStock: row.current_stock,
            threshold: row.threshold,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        res.json(items);
    });
});

// Get stock item by ID
app.get('/api/stock/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM stock_items WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Stock item not found' });
            return;
        }
        res.json({
            id: row.id.toString(),
            itemName: row.item_name,
            category: row.category,
            totalStock: row.total_stock,
            currentStock: row.current_stock,
            threshold: row.threshold,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    });
});

// Create stock item
app.post('/api/stock', (req, res) => {
    const { itemName, category, totalStock, currentStock, threshold } = req.body;

    if (!itemName || !category || totalStock === undefined || currentStock === undefined || threshold === undefined) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    if (currentStock > totalStock) {
        res.status(400).json({ error: 'Current stock cannot be greater than total stock' });
        return;
    }

    db.run(
        'INSERT INTO stock_items (item_name, category, total_stock, current_stock, threshold) VALUES (?, ?, ?, ?, ?)',
        [itemName, category, totalStock, currentStock, threshold],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({
                id: this.lastID.toString(),
                itemName,
                category,
                totalStock,
                currentStock,
                threshold
            });
        }
    );
});

// Update stock item
app.put('/api/stock/:id', (req, res) => {
    const id = req.params.id;
    const { itemName, category, totalStock, currentStock, threshold } = req.body;

    if (!itemName || !category || totalStock === undefined || currentStock === undefined || threshold === undefined) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    if (currentStock > totalStock) {
        res.status(400).json({ error: 'Current stock cannot be greater than total stock' });
        return;
    }

    db.run(
        'UPDATE stock_items SET item_name = ?, category = ?, total_stock = ?, current_stock = ?, threshold = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [itemName, category, totalStock, currentStock, threshold, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Stock item not found' });
                return;
            }
            res.json({ message: 'Stock item updated successfully', id: id });
        }
    );
});

// Delete stock item
app.delete('/api/stock/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM stock_items WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Stock item not found' });
            return;
        }
        res.json({ message: 'Stock item deleted successfully' });
    });
});

// ===== SALES ROUTES =====
// Get all sales
app.get('/api/sales', (req, res) => {
    db.all('SELECT * FROM sales ORDER BY sale_date DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const sales = rows.map(row => ({
            id: row.id.toString(),
            date: row.sale_date,
            familyId: row.family_id,
            itemId: row.item_id.toString(),
            itemName: row.item_name,
            quantity: row.quantity,
            unitPrice: row.unit_price,
            totalAmount: row.total_amount
        }));
        res.json(sales);
    });
});

// Get today's sales statistics
app.get('/api/sales/today', (req, res) => {
    db.all(
        `SELECT 
            COALESCE(SUM(total_amount), 0) as total_amount,
            COUNT(*) as count
        FROM sales 
        WHERE DATE(sale_date) = DATE('now')`,
        [],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                todaySalesAmount: row[0].total_amount || 0,
                todaySalesCount: row[0].count || 0
            });
        }
    );
});

// Create sale
app.post('/api/sales', (req, res) => {
    const { familyId, itemId, quantity, unitPrice, totalAmount } = req.body;

    if (!familyId || !itemId || !quantity || !unitPrice || !totalAmount) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    // Get stock item to check availability and get item name
    db.get('SELECT * FROM stock_items WHERE id = ?', [itemId], (err, item) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!item) {
            res.status(404).json({ error: 'Stock item not found' });
            return;
        }

        if (quantity > item.current_stock) {
            res.status(400).json({ error: `Insufficient stock. Available: ${item.current_stock}` });
            return;
        }

        // Check if family exists
        db.get('SELECT * FROM families WHERE family_id = ?', [familyId], (err, family) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!family) {
                res.status(404).json({ error: 'Family not found' });
                return;
            }

            // Create sale
            db.run(
                'INSERT INTO sales (family_id, item_id, item_name, quantity, unit_price, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
                [familyId, itemId, item.item_name, quantity, unitPrice, totalAmount],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }

                    // Update stock
                    const newStock = item.current_stock - quantity;
                    db.run(
                        'UPDATE stock_items SET current_stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                        [newStock, itemId],
                        (err) => {
                            if (err) {
                                res.status(500).json({ error: 'Error updating stock' });
                                return;
                            }

                            res.status(201).json({
                                id: this.lastID.toString(),
                                familyId,
                                itemId,
                                itemName: item.item_name,
                                quantity,
                                unitPrice,
                                totalAmount
                            });
                        }
                    );
                }
            );
        });
    });
});

// ===== DASHBOARD STATISTICS =====
app.get('/api/dashboard/stats', (req, res) => {
    const stats = {};

    // Get total stock items
    db.get('SELECT COUNT(*) as count FROM stock_items', [], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        stats.totalStockItems = row.count;

        // Get registered families
        db.get('SELECT COUNT(*) as count FROM families', [], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            stats.registeredFamilies = row.count;

            // Get low stock items
            db.get('SELECT COUNT(*) as count FROM stock_items WHERE current_stock <= threshold', [], (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                stats.lowStockItems = row.count;

                // Get today's sales
                db.get(
                    `SELECT 
                        COALESCE(SUM(total_amount), 0) as total_amount,
                        COUNT(*) as count
                    FROM sales 
                    WHERE DATE(sale_date) = DATE('now')`,
                    [],
                    (err, row) => {
                        if (err) {
                            res.status(500).json({ error: err.message });
                            return;
                        }
                        stats.todaySalesAmount = row.total_amount || 0;
                        stats.todaySalesCount = row.count || 0;

                        res.json(stats);
                    }
                );
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Access your application at http://localhost:${PORT}/index.html`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});


