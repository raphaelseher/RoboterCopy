import { app, BrowserWindow, ipcMain } from 'electron';
import os from 'os';
import * as grpc from 'grpc';
import mdns from 'mdns';
import { protoIndex } from './proto';

import { ClipboardProvider, IClient, ServerDataHandler } from './data/serverDataHandler';
import ClipboardListener from './common/clipboardListener';
import ClipboardServer from './service/clipboardServer';
import { findIpAddresses, createServiceBroadcast } from './common/networkHelper';
import Logger, { LogLevel, ConsoleLogger, ObservableLogger } from './common/logger';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

protoIndex();

export interface IState {
    hostname: string,
        ipAddresses: string[],
        port: number,
        serverIsRunning: boolean,
        connectedDevices: IClient[]
}

const appState: IState = {
  hostname: os.hostname(),
  ipAddresses: findIpAddresses(),
  port: 50052,
  serverIsRunning: false,
  connectedDevices: [],
};

const serverDataHandler = new ServerDataHandler();

let clipboardListener: ClipboardListener | undefined;
let mainWindow: BrowserWindow;
let server: ClipboardServer | undefined;
const serverAdvertisment: mdns.Advertisement = createServiceBroadcast(appState.port);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const propagateAppState = (): void => {
  mainWindow.webContents.send('update-app-state', appState);
};

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const peersChanged = (peers: string[]) => {
  appState.connectedDevices = peers;
  propagateAppState();
};

const peersAdded = (id: string, name: string) => {
  Logger.verbose('${name} connected. ({id})');
};

const startServer = () => {
  server = new ClipboardServer(appState.port, serverDataHandler, (error) => {
    if (error) {
      console.log('Error: ', error);
      return;
    }
    appState.serverIsRunning = true;
    propagateAppState();
  }, peersChanged);
};

const onReadyInitializion = (): void => {
  createWindow();

  Logger.registerLogger(LogLevel.Verbose, new ConsoleLogger());
  const observerableLoggerCallback = (level: string, message: string) => {
    mainWindow.webContents.send('new-log', `[${level}] ${message}`);
  };
  Logger.registerLogger(LogLevel.Verbose, new ObservableLogger(observerableLoggerCallback));
  Logger.verbose('Did setup Logger');

  clipboardListener = new ClipboardListener(serverDataHandler);
  clipboardListener.startClipboardListener();

  serverDataHandler.ipAdresses = appState.ipAddresses;
  serverDataHandler.port = appState.port;
  serverDataHandler.serverName = os.hostname();
  serverDataHandler.clientsListener = (clients: IClient[]) => {
    appState.connectedDevices = clients;
    propagateAppState();
  };
  startServer();
  serverAdvertisment.start();

  // initial appState
  mainWindow.webContents.on('did-finish-load', () => {
    propagateAppState();
  });
};

/// ipc interaction
ipcMain.on('toggle-server', () => {
  if (appState.serverIsRunning) {
    // server?.forceShutdown();
    appState.serverIsRunning = false;
    propagateAppState();
    Logger.verbose('Server stopped');
  } else {
    startServer();
    Logger.verbose('Server started');
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
