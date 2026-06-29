const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT Secret - In production, this should be in environment variables
const JWT_SECRET = 'dental-clinic-secret-key-change-in-production';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, '../public/icon.png')
  });

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools(); // Open dev tools in development
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Initialize database
  db.initializeDatabase();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers - Will be expanded in future sessions
// For now, just a test handler
ipcMain.handle('ping', async () => {
  return 'pong';
});

// Database operations handlers
ipcMain.handle('db:query', async (event, { sql, params }) => {
  try {
    const stmt = db.getDatabase().prepare(sql);
    const result = params ? stmt.all(...params) : stmt.all();
    return { success: true, data: result };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:run', async (event, { sql, params }) => {
  try {
    const stmt = db.getDatabase().prepare(sql);
    const result = params ? stmt.run(...params) : stmt.run();
    return { success: true, data: result };
  } catch (error) {
    console.error('Database run error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:get', async (event, { sql, params }) => {
  try {
    const stmt = db.getDatabase().prepare(sql);
    const result = params ? stmt.get(...params) : stmt.get();
    return { success: true, data: result };
  } catch (error) {
    console.error('Database get error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================
// Authentication Handlers
// ============================================

// Login handler
ipcMain.handle('auth:login', async (event, { username, password }) => {
  try {
    console.log(`Login attempt for username: ${username}`);
    
    // Get user from database
    const user = db.getDatabase()
      .prepare('SELECT * FROM users WHERE username = ? AND is_active = 1')
      .get(username);
    
    if (!user) {
      console.log('User not found or inactive');
      return { success: false, error: 'Invalid username or password' };
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log('Password does not match');
      return { success: false, error: 'Invalid username or password' };
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token valid for 24 hours
    );
    
    // Return user data (without password) and token
    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
    
    console.log(`Login successful for user: ${username}`);
    
    return {
      success: true,
      data: {
        token,
        user: userData,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
});

// Verify token handler
ipcMain.handle('auth:verify-token', async (event, { token }) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    console.error('Token verification error:', error);
    return { success: false, error: 'Invalid or expired token' };
  }
});

