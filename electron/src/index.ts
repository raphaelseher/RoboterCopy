import { app, BrowserWindow, ipcMain } from 'electron';
import os from 'os';
import * as grpc from 'grpc';
import mdns from 'mdns';
import { protoIndex } from './proto';

import ClipboardProvider from './data/clipboardProvider';
import ClipboardListener from './common/clipboardListener';
import { bindAndStartServer } from './service/clipboardServer';
import { findIpAddresses, createServiceBroadcast } from './common/networkHelper';
import Logger, { LogLevel, ConsoleLogger } from './common/logger';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

protoIndex();

interface IState {
  hostname: string,
  ipAddresses: string[],
  port: number,
  serverIsRunning: boolean,
  connectedDevices: string[]
}

const appState: IState = {
  hostname: os.hostname(),
  ipAddresses: findIpAddresses(),
  port: 50052,
  serverIsRunning: false,
  connectedDevices: []
}

const clipboardProvider = new ClipboardProvider();
let clipboardListener: ClipboardListener | undefined = undefined;
let mainWindow: BrowserWindow;
let server: grpc.Server | undefined = undefined;
let serverAdvertisment: mdns.Advertisement = createServiceBroadcast(appState.port);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const onReadyInitializion = (): void => {
  Logger.registerLogger(LogLevel.Verbose, new ConsoleLogger());
  Logger.verbose("Did setup Logger");

  createWindow();

  clipboardListener = new ClipboardListener(clipboardProvider);
  clipboardListener.startClipboardListener();

  clipboardProvider.ipAdresses = appState.ipAddresses;
  clipboardProvider.port = appState.port;
  clipboardProvider.serverName = os.hostname();

  startServer();
  serverAdvertisment.start();

  // initial appState
  mainWindow.webContents.on('did-finish-load', () => {
    propagateAppState();
  });
}

const propagateAppState = (): void => {
  mainWindow.webContents.send('update-app-state', appState);
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const startServer = () => {
  server = bindAndStartServer(appState.port, clipboardProvider, (error) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }
    appState.serverIsRunning = true;
    propagateAppState();
  }, peersChanged);
};

const peersChanged = (peers: string[]) => {
  appState.connectedDevices = peers;
  propagateAppState();
};

/// ipc interaction
ipcMain.on('toggle-server', () => {
  if (appState.serverIsRunning) {
    server.forceShutdown();
    appState.serverIsRunning = false;
    propagateAppState();
  } else {
    startServer();
  }
});

/// AppState

app.on('ready', onReadyInitializion);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
