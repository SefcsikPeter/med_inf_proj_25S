const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

let backendProcess;
let backendReady = false;
let showedError = false;

function showErrorAndQuit(message, detail) {
  if (showedError) return;
  showedError = true;
  try {
    dialog.showMessageBoxSync({
      type: 'error',
      title: 'Infection Visualizer – Error',
      message,
      detail,
    });
  } catch {
  } finally {
    if (backendProcess) {
      try { backendProcess.kill(); } catch {}
    }
    app.quit();
  }
}

async function waitForBackend(url, retries = 200, interval = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(url, { timeout: 1000 });
      console.log('Backend is ready!');
      backendReady = true;
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

  dialog.showMessageBox({
    type: 'info',
    title: 'Infection Visualizer',
    message: 'Starting application… please wait a moment.',
  });

  const pythonExe = path.join(basePath, 'portable_python', 'python.exe');
  const backendScript = path.join(basePath, 'backend', 'main.py');

  try {
    backendProcess = spawn(pythonExe, [backendScript], {
      cwd: path.join(basePath, 'backend'),
      windowsHide: true
    });
  } catch (err) {
    console.error('Failed to spawn backend:', err);
    showErrorAndQuit('Failed to start backend process.', String(err?.message || err));
    return;
  }

  backendProcess.on('error', (err) => {
    console.error('Backend spawn error:', err);
    if (!backendReady) {
      showErrorAndQuit('Failed to start backend process.', String(err?.message || err));
    }
  });

  backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));
  backendProcess.on('close', (code, signal) => {
    console.log(`Backend exited with code ${code} ${signal ? `(signal ${signal})` : ''}`);
    if (!backendReady) {
      showErrorAndQuit(
        'Backend exited before it became ready.',
        `Exit code: ${code ?? 'unknown'}${signal ? `, signal: ${signal}` : ''}`
      );
    }
  });

  try {
    await waitForBackend('http://127.0.0.1:8000');
  } catch (err) {
    console.error(err.message);
    showErrorAndQuit('Backend did not start in time.', err.message);
    return;
  }

  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  try {
    await win.loadFile('dist/infection-visualizer/browser/index.html');
  } catch (err) {
    console.error('Failed to load UI:', err);
    showErrorAndQuit('Failed to load the user interface.', String(err?.message || err));
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (backendProcess) {
    try { backendProcess.kill(); } catch {}
  }
  if (process.platform !== 'darwin') app.quit();
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  showErrorAndQuit('An unexpected error occurred.', String(err?.stack || err));
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  showErrorAndQuit('An unexpected error occurred.', String(reason));
});
