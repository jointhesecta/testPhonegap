/**
 * Created by JoinTheSecta on 01/05/14.
 */

var express = require('express')
    , app = express()
    , http = require('http')
    , io = require('socket.io')
    , cookie = require('cookie')
    , connect = require('connect');

app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.session({secret: 'secret', key: 'express.sid'}));
    app.use(express.static(__dirname + '/public'));
});

server = http.createServer(app);
server.listen(3000);

io = io.listen(server);

io.set('authorization', function (handshakeData, accept) {
    if (handshakeData.headers.cookie) {
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
        handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');
        if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
            return accept('Cookie is invalid.', false);
        }
    } else {
        return accept('No cookie transmitted.', false);
    }
    accept(null, true);
});

var sessionsConnections = {};
var users = {};
var id = 0;
var rooms = 0;

io.on('connection', function (socket) {
    socket.join(socket.handshake.sessionID);

    console.log("Nueva conexion: " + socket.handshake.sessionID);

    if (sessionsConnections[socket.handshake.sessionID]) {
        sessionsConnections[socket.handshake.sessionID].online = true;
        users[socket.handshake.sessionID] = {username: sessionsConnections[socket.handshake.sessionID].username, id: socket.handshake.sessionID};
        io.sockets.in(socket.handshake.sessionID).emit('welcome', {username: sessionsConnections[socket.handshake.sessionID].username, id: socket.handshake.sessionID, playing: false})
    }

    socket.on('addUser', function (username) {
        console.log("addUser username: " + username);
        sessionsConnections[socket.handshake.sessionID] = {username: username, socket: socket, online: true, id: socket.handshake.sessionID, playing: false};
        users[socket.handshake.sessionID] = {username: username, id: socket.handshake.sessionID};
        // console.log(sessionsConnections);
        // console.log(Object.keys(sessionsConnections).length);
        io.sockets.in(socket.handshake.sessionID).emit('welcome', {username: sessionsConnections[socket.handshake.sessionID].username, id: socket.handshake.sessionID});
        // io.sockets.emit('lastOnline', users[username]);
        io.sockets.emit('usersOnline', users);
    });

    socket.emit('usersOnline', users);

    socket.on('iniciarPartida', function (data) {
        var user1 = users[socket.handshake.sessionID].username;
        var user2 = users[data].username;

        if (sessionsConnections[data].playing) {
            sessionsConnections[socket.handshake.sessionID].socket.emit('userPlaying', user2);
        } else {
            rooms++;

            sessionsConnections[socket.handshake.sessionID].playing = true;
            sessionsConnections[data].playing = true;

            sessionsConnections[socket.handshake.sessionID].socket.join(rooms);
            sessionsConnections[data].socket.join(rooms);

            io.sockets.in(rooms).emit('aceptarPartida', {player1: user1, player2: user2, id: socket.handshake.sessionID});
            //io.sockets.in(socket.handshake.sessionID).emit('aceptarPartida', {player1: user1, player2: user2, id: socket.handshake.sessionID});
        }
    });

    socket.on('pasarTurno', function (data) {
        var sala =  users[socket.handshake.sessionID].room;
        socket.broadcast.to(sala).emit('recibirSincronizacion', data);
    });

    socket.on('disconnect', function () {
        if (sessionsConnections[this.handshake.sessionID]) {
            if (sessionsConnections[this.handshake.sessionID].online) {
                socket.leave(socket.room);
                io.sockets.in(socket.room).emit('playerOut');
                sessionsConnections[this.handshake.sessionID].online = false;
                delete users[sessionsConnections[this.handshake.sessionID].username];
                socket.emit('usersOnline', users);
            }
        }
    });
});