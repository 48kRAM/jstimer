'use strict';

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;


function openApp() {
    win = new BrowserWindow( {
        width: 900,
        height: 800,
        icon: path.join(__dirname, 'images/icon.png')
    });
    win.loadFile('index.html');

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', openApp);

app.on('window-all-closed', () => {
    app.quit();
});
