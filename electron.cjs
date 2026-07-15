const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Gracefully handle port in use errors if another instance or terminal is running
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port 3000 is already in use. Assuming server is already running.');
  } else {
    console.error('Uncaught Exception:', err);
  }
});

// Load configuration
let mode = 'developer'; // default fallback
const configPath = path.join(__dirname, 'dist', 'mode-config.json');
try {
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config && config.mode) {
      mode = config.mode;
    }
  }
} catch (e) {
  console.error('Failed to load mode configuration:', e);
}

// Start backend Express server
try {
  require('./dist/server.cjs');
} catch (e) {
  console.error('Failed to load Express backend server:', e);
}

function createWindow() {
  const title = mode === 'vendor' 
    ? 'LPU Smart Canteen - Operator Portal' 
    : 'LPU Smart Canteen - Developer Admin Portal';
    
  const width = mode === 'vendor' ? 1280 : 1600;
  const height = mode === 'vendor' ? 800 : 900;

  const win = new BrowserWindow({
    width,
    height,
    title,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: mode === 'vendor', // hide menu for vendor for native look
  });

  // Load the backend server address
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
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
