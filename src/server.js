const WebSocket = require('ws');
const moment = require('moment');
const fs = require('fs');

const basePath = './transcriptions/'

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map()

function setupClient(ws) {

  ws.on('open', function handle() {
    console.log('open triggered');
  });

  ws.once('message', function incoming(data) {
    console.log('Setup message received: ' + data);

    let setup = JSON.parse(data);
    setup.file = basePath + setup.call_id + ".txt"

    clients.set(ws, setup)

    let buffer = "Starting transcription for callId: " + setup.call_id + '\n'

    fs.writeFile(setup.file, buffer, function (err) {
      if (err) throw console.log('error writing file: ' + err);
    });

    console.log("Registered clients: " + clients.size)

    ws.on('message', function incoming(data) {
      console.log('Message received: ' + data);
      let setup = clients.get(ws)
      let now = moment().format();

      message = {
        "ts": now,
        "self": true,
        "text": data,
        "sender": setup.name
      }
      content = JSON.stringify(message);
      ws.send(content);
      fs.appendFile(setup.file, content + '\n', function (err) {
        if (err) throw console.log('error writing file: ' + err);
      });

      message = {
        "ts": now,
        "self": false,
        "text": data,
        "sender": setup.name
      }

      content = JSON.stringify(message);

      clients.forEach((setup, client) => {
        if (client != ws) {
          console.log(content);
          client.send(content);
          fs.appendFile(setup.file, content + '\n', function (err) {
            if (err) throw console.log('error writing file: ' + err);
          });
        }
      });
    });
  });

  ws.on('close', function incoming(code, reason) {
    console.log('Close received: ' + code + '-' + reason);
    clients.forEach((setup, client) => {
      if (client == ws) {
        let buffer = "End of transcription for callId: " + setup.call_id
        fs.appendFile(setup.file, buffer + '\n', function (err) {
          if (err) throw console.log('error writing file: ' + err);
        });
        clients.delete(client);
      }
    });
    console.log("Remaining clients: " + clients.size)
  });
}

wss.on('connection', function connection(ws) {
  setupClient(ws)
});

