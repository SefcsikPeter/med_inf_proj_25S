const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

let backendProcess;

async function waitForBackend(url, retries = 200, interval = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(url);
      console.log('Backend is ready!');
      return;
    } catch (err) {
      console.log(`Waiting for backend... (${i + 1}/${retries})`);
      await new Promise(res => setTimeout(res, interval));
    }
  }
  throw new Error('Backend did not start in time.');
}

async function createWindow() {
  const isDev = !app.isPackaged;
  const basePath = isDev ? __dirname : process.resourcesPath;

  const pythonExe = path.join(basePath, 'portable_python', 'python.exe');
  const backendScript = path.join(basePath, 'backend', 'main.py');

  backendProcess = spawn(pythonExe, [backendScript], {
    cwd: path.join(basePath, 'backend'),
    windowsHide: true
  });

  backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));
  backendProcess.on('close', (code) => console.log(`Backend exited with code ${code}`));

  try {
    await waitForBackend('http://127.0.0.1:8000');
  } catch (err) {
    console.error(err.message);
    app.quit();
    return;
  }

  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.loadFile(path.join(basePath, 'dist/infection-visualizer/browser/index.html'));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
