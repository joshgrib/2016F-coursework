const electron = require("electron");
const {shell} = require("electron");
let data = require("../data");

let mainWindow;

const constructorMethod = () => {
  // Module to control application life.
  const app = electron.app;

  // Module to create native browser window.
  const BrowserWindow = electron.BrowserWindow;

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1200, height: 900 })

    mainWindow.loadURL('http://localhost:3000/home');

    const Menu = electron.Menu;
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Save calendar',
                    click: () => {
                        console.log('Time to save a calendar');
                        data.saveCalToFile();
                    }
                }, {
                    type: 'separator'
                }, {
                    label: 'Load calendar',
                    click: () => {
                        console.log('Time to load a calendar');
                        //TODO
                        let file = shell.showItemInFolder("~");
                        console.log(file);
                    }
                }
            ]
        },
        {
          label: 'Modes',
          submenu: [
              {
                  label: 'Change To Tablet',
                  click: () => {
                      let win = BrowserWindow.getFocusedWindow();
                      win.setSize(800, 600);
                  }
              }, {
                    type: 'separator'
              }, {
                  label: 'Change To Desktop',
                  click: () => {
                      let win = BrowserWindow.getFocusedWindow();
                      win.setSize(1200, 900);
                  }
              }, {
                    type: 'separator'
              }, {
                  label: 'Change To Mobile Mode',
                  click: () => {
                      let win = BrowserWindow.getFocusedWindow();
                      win.setSize(500, 750);
                  }
              }
          ]
        },
        {
            label: 'Extra',
            submenu: [
                {
                    label: 'Quit',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools({mode: "undocked"});

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
};

module.exports = constructorMethod;
