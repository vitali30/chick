const app = require('./app');
const WebSocketServer = new require('ws');
const watch = require('node-watch');

const port = 5000;
app.listen(port, () => {
    console.log('We are live on ' + port);
}); 

var webSocketServer = new WebSocketServer.Server({ port: 5001 });

webSocketServer.on('connection', function(ws) {
  const clients = ws;
  watch('public', { recursive: true }, (evt, name) => clients.send(name));
})