const WebSocket = require('ws');
const moment = require('moment');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map()

function setupClient(ws) {

  ws.on('open', function handle() {
    console.log('open triggered');
  });

  ws.once('message', function incoming(data) {
    console.log('Setup message received: ' + data);

    clients.set(ws, data)
    console.log("Registered clients: " + clients.size)

    ws.on('message', function incoming(data) {
      console.log('Message received: ' + data);
      let sender = clients.get(ws)
      let now = moment().format();

      message = {
        "ts" : now,
        "self": true,
        "text": data,
        "sender": sender
      }
      ws.send(JSON.stringify(message));

      message = {
        "ts" : now,
        "self": false,
        "text": data,
        "sender": sender
      }
      clients.forEach((name, client) => {
        if (client != ws) {
          console.log(JSON.stringify(message));
          client.send(JSON.stringify(message));
        }
      });
    });
  });

  ws.on('close', function incoming(code, reason) {
    console.log('Close received: ' + code + '-' + reason);
    clients.forEach((name, client) => {
      if (client == ws) {
        clients.delete(client);
      }
    });
    console.log("Remaining clients: " + clients.size)
  });
}

wss.on('connection', function connection(ws) {
  setupClient(ws)
});

