'use strict';
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const WebSocket = require('ws');
const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

app.post('/login', function(req, res) {
  res.send({ result: 'OK', message: 'Session updated' });
});

app.delete('/logout', function(request, response) {
  
  console.log('Destroying session');
  request.session.destroy(function() {
    if (ws) ws.close();
    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});



server.on('upgrade', function(request, socket, head) {
    console.log('Parsing session from request...');
});

wss.on('connection', function connection (ws, request) {
  ws.on('message', function incoming (message) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
  });
  ws.on('close', function() {
    console.log('closed');
  });
});


server.listen(8080, function() {
  console.log('Listening on http://localhost:8080');
});