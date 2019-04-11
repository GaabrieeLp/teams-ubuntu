'use strict';
process.env.ELECTRON_HIDE_INTERNAL_MODULES = 'true';

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;

let mainWindow = null;
let appIcon = null;

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

var iconpath = __dirname + '/favicon-256x256.png';

var startupOpts = {
    useContentSize: true,
    width: 800,
    height: 620,
    center: true,
    resizable: true,
    alwaysOnTop: false,
    fullscreen: false,
    skipTaskbar: false,
    kiosk: false,
    title: 'Microsoft Teams',
    icon: iconpath,
    show: true,
    frame: true,
    disableAutoHideCursor: false,
    autoHideMenuBar: false,
    titleBarStyle: 'default',
    webPreferences: {
        webSecurity: false,
        nodeIntegration: false,
        allowDisplayingInsecureContent: true,
        allowRunningInsecureContent: true,
        plugins: true,
        preload: __dirname + '/inject/preload.js'
    }
};

app.on('ready', function() {

    Menu.setApplicationMenu(Menu.buildFromTemplate(require('./src/menus')));

    mainWindow = new BrowserWindow(startupOpts);
    appIcon = new Tray(iconpath)
    
    mainWindow.loadURL('https://teams.microsoft.com', {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
    });
    
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    mainWindow.on('close', function (event) {
        if(!app.isQuiting){
            event.preventDefault();
            mainWindow.hide();
        }

        return false;
    });

    appIcon.setContextMenu(Menu.buildFromTemplate([
        { 
            label: 'Open Teams', 
            click:  function(){
                mainWindow.show();
            } 
        },
        { 
            label: 'Quit', 
            click:  function(){
                app.isQuiting = true;
                app.quit();
            } 
        }
    ]));

    mainWindow.show();
});