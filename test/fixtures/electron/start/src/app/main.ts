import { app, BrowserWindow } from 'electron';

let window: BrowserWindow | null = null;

function createWindow(): void {
  if (window) return;

  window = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: app.getAppPath() + '/preload.js',
    },
    backgroundColor: '#ffffff',
  });

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools({
      mode: 'bottom',
    });
  }

  window.on('closed', function () {
    window = null;
  });

  window.loadFile('index.html');
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  if (!window) {
    createWindow();
  }
});
