const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.loadFile('dist/infection-visualizer/browser/index.html');
  win.webContents.openDevTools();
}

app.on('ready', createWindow);
