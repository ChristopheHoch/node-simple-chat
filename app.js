
/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    sio = require('socket.io'),
    app = express(),
    server,
    io;

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Socket.IO
 */
io = sio.listen(server);

io.sockets.on('connection', function (socket) {

    socket.on('join', function (name) {
        console.log(name + ' joined the chat');
        socket.nickname = name;
        if(name) {
            socket.broadcast.emit('announcement', name + ' joined the chat.');
        }
    });
    
    socket.on('joinRoom', function (name) {
        console.log(socket.nickname + ' joined the room ' + name);
        console.log(io.sockets.manager.rooms);
        socket.room = name;
        socket.join(name);
    });

    socket.on('text', function (msg) {
        socket.broadcast.emit('text', socket.nickname, msg);
    });
    
    socket.on('roomMessage', function (msg) {
        console.log(io.sockets.manager.rooms);
        socket.broadcast.to(socket.room).emit('roomMessage', socket.nickname, msg);
    });

    socket.on('disconnect', function () {
        if(socket.nickname) {
            socket.broadcast.emit('left', socket.nickname + ' has left the chat');
        }
    });

});