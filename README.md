# Ration Store Management System

A complete full-stack ration store management system with frontend and backend.

## Features

- 📊 **Dashboard** - Real-time statistics and stock alerts
- 👨‍👩‍👧‍👦 **Family Management** - Register and manage families
- 📦 **Stock Management** - Track inventory with low stock alerts
- 💰 **Sales Management** - Record sales and automatically update stock
- 📱 **QR Code Scanning** - Scan ration cards (with manual entry fallback)

## Technology Stack

### Frontend
- HTML5
- CSS3 (Modern blue gradient theme)
- Vanilla JavaScript (ES6+)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Database (file-based, no separate server needed)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser and navigate to: `http://localhost:3000`
   - Or directly: `http://localhost:3000/index.html`

## Project Structure

```
ProjectRationSivagANESH/
├── index.html          # Dashboard page
├── family.html         # Family management page
├── stock.html          # Stock analysis page
├── sales.html          # Sales report page
├── scan.html           # QR code scanning page
├── server.js           # Backend server (Express + SQLite)
├── package.json        # Node.js dependencies
├── database.db         # SQLite database (created automatically)
├── css/
│   └── style.css       # Stylesheets
└── js/
    ├── api.js          # API client functions
    ├── app.js          # Common utilities
    ├── dashboard.js    # Dashboard logic
    ├── family.js       # Family management logic
    ├── stock.js        # Stock management logic
    ├── sales.js        # Sales management logic
    └── scan.js         # QR scanning logic
```

## API Endpoints

### Families
- `GET /api/families` - Get all families
- `GET /api/families/:id` - Get family by ID
- `GET /api/families/by-family-id/:familyId` - Get family by Family ID
- `POST /api/families` - Create new family
- `PUT /api/families/:id` - Update family
- `DELETE /api/families/:id` - Delete family

### Stock Items
- `GET /api/stock` - Get all stock items
- `GET /api/stock/:id` - Get stock item by ID
- `POST /api/stock` - Create new stock item
- `PUT /api/stock/:id` - Update stock item
- `DELETE /api/stock/:id` - Delete stock item

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/today` - Get today's sales statistics
- `POST /api/sales` - Create new sale (automatically updates stock)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

### Families Table
- id (INTEGER PRIMARY KEY)
- family_id (TEXT UNIQUE)
- head_of_family (TEXT)
- num_members (INTEGER)
- member_list (TEXT JSON)
- address (TEXT)
- phone (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

### Stock Items Table
- id (INTEGER PRIMARY KEY)
- item_name (TEXT)
- category (TEXT)
- total_stock (REAL)
- current_stock (REAL)
- threshold (REAL)
- created_at (DATETIME)
- updated_at (DATETIME)

### Sales Table
- id (INTEGER PRIMARY KEY)
- family_id (TEXT)
- item_id (INTEGER)
- item_name (TEXT)
- quantity (REAL)
- unit_price (REAL)
- total_amount (REAL)
- sale_date (DATETIME)

## Usage

1. **Start with Stock Items**: Add ration items in the Stock Analysis page
2. **Register Families**: Add family details in the Family Details page
3. **Record Sales**: Enter sales in the Sales Report page (stock auto-updates)
4. **Monitor Dashboard**: Check statistics and low stock alerts
5. **Scan Cards**: Use QR scanner or manual entry to find families

## Development

### Changing API Base URL

Edit `js/api.js` and update the `API_BASE_URL` constant if your server runs on a different port or host.

### Database

The SQLite database (`database.db`) is created automatically on first run. To reset:
1. Stop the server
2. Delete `database.db`
3. Restart the server (tables will be recreated)

## Notes

- The database file (`database.db`) will be created in the project root
- QR code scanning requires camera permissions
- All data is stored in SQLite database (persistent storage)
- The server must be running for the frontend to work

## License

ISC





