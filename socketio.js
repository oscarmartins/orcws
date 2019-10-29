const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var users = [];
app.set('io', io);
app.use(express.static("socketio"));

app.get('/', function(req, res){
  /*res.send('<h1>Hello world</h1>');*/
  res.sendFile(__dirname + '/index.html');
});
/**
Broadcasting
The next goal is for us to emit the event from the server to the rest of the users.
In order to send an event to everyone, Socket.IO gives us the io.emit:
 */
io.emit('some event', { for: 'everyone' });
const oscarChatUsers = {};
const myroom = io.of('/oscarChat');
myroom.on('connection', function (socket) {
    socket.on('disconnect', function () {

    });
    socket.on('signin', function (nickname) {
        myroom.emit('onsignin', nickname);
    });
    socket.on('message', function (message) {
        myroom.emit('response-message', message);
    });
});




io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', socket.nickname + ' write: ' + msg);
    });
    socket.on('chat nickname', function(nickname, id){
        console.log('nickname: ' + nickname);
        var response = nickname + ' entrou no chat';
        if (users.includes(nickname.trim())) {
            response = 'reload';
            io.to(socket.id).emit('chat nickname', response);
        } else {
            socket.nickname = nickname.trim();
            users.push(socket.nickname);
            /*io.emit('chat nickname', response);*/
            io.emit('chat message', response);
        }
    });
    socket.on('disconnect', function(){
        /*let index = users.indexOf(socket.nickname), msg;
        users.splice(index, index);*/
        var msg, nickname = socket.nickname;
        if (nickname) {
            while (users.includes(nickname)){
                let index = users.indexOf(nickname);
                users.splice(index, index+1);
            }
            msg = 'user '+ nickname +' disconnected!'
            console.log(msg);
            io.emit('chat message', msg);
        } else {
            console.log(nickname);
        } 
    });
    socket.on('fetchOnlineUsers', function(){
        io.emit('fetchOnlineUsers', JSON.stringify(users));
        socket.on('hola', function (we) {
            console.log('fethOnlineUsers > hola ' + we);
        });
        
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});