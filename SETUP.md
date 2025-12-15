# Quick Setup Guide

## If you get "Failed to Fetch" error, follow these steps:

### Step 1: Install Dependencies (First time only)
Open terminal/command prompt in the project folder and run:
```bash
npm install
```

This will install:
- express
- sqlite3
- cors
- body-parser

### Step 2: Start the Server
Run this command:
```bash
npm start
```

You should see:
```
Connected to SQLite database.
Database tables initialized.
Server is running on http://localhost:3000
Access your application at http://localhost:3000/index.html
```

### Step 3: Access the Application
**IMPORTANT:** Don't open the HTML file directly!
Instead, open your browser and go to:
```
http://localhost:3000/index.html
```

Or just:
```
http://localhost:3000
```

## Troubleshooting

### Error: "Cannot find module 'express'"
→ Run `npm install` first

### Error: "Port 3000 already in use"
→ Another application is using port 3000. Either:
- Stop that application, OR
- Change the port in `server.js` (line 13)

### Error: "Failed to fetch"
→ Make sure:
1. Server is running (you see the "Server is running" message)
2. You're accessing via `http://localhost:3000` NOT by opening the file directly
3. No firewall is blocking port 3000

### Still having issues?
1. Check if Node.js is installed: `node --version`
2. Check if npm is installed: `npm --version`
3. Make sure you're in the project directory when running commands





