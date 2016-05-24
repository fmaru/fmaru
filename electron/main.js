const api = require('../server/api');
const electron = require('electron');

const {app} = electron;
const {BrowserWindow} = electron;

let win;

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL('http://localhost:' + api.get('port') + '/index.html');
  win.on('closed', () => {
    console.log("closed");
    win = null;
  });
}

app.on('ready', function(){
  api.listen(api.get('port'), function() {
    console.log('Node api is running on port', api.get('port'));
    createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin'){
    app.quit();
  }

});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }

});
