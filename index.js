'use strict';

const APIAI_TOKEN = "2a947fe21f504606a816e36ce26344f0";
const APIAI_SESSION_ID = "3914643a-b28b-4bf0-a22d-05ea8306dca4";

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


var server = https.createServer(options, app).listen(8002);
console.log('Express server listening on port %d in %s mode', app.settings.env);
// const server = app.listen(process.env.PORT || 5000, () => {
//   console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
// });

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});
