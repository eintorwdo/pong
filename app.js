const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Room = require('./lib/Room.js');
const {findRoomWithPlayer} = require('./utils/utils.js');

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + `/public/index.html`);
});

const rooms = [];

io.on('connection', (socket) => {
    let roomNumber = findRoomWithPlayer(rooms);
    let room;
    let countdown;
    let game;
    if(roomNumber !== -1){
        io.in(`room-${roomNumber}`).emit('tick', null);
        room = rooms[roomNumber];
        rooms.splice(roomNumber, 1 , room);
    }
    else{
        roomNumber = rooms.length;
        room = new Room(25, roomNumber, io);
        rooms.push(room);
    }
    room.addUser(socket.id);
    socket.join(`room-${roomNumber}`);
    io.in(`room-${roomNumber}`).emit('users-ready', room.users.map(u => u.ready));

    socket.on('user', (data) => {
        if(!data || data === ''){
            data = 'default';
        }
        room.setUserName(data, socket.id);
        io.in(`room-${roomNumber}`).emit('users', room.users);
    });


    socket.on('paddleMovement', (data) => {
        rooms[roomNumber].movePaddle(socket.id, data.direction);
    });

    socket.on('ready', () => {
        if(!countdown){
            room.setUserReady(socket.id);
            io.in(`room-${roomNumber}`).emit('users-ready', room.users.map(u => u.ready));
            if(room.bothAreReady()){
                room.setCountdown();
            }
        }
    });

    socket.on('disconnect', () => {
        const removedUser = room.removeUser(socket.id);
        io.in(`room-${roomNumber}`).emit('dconnected', removedUser.id);
        if(room.users.length == 0){
            rooms.splice(roomNumber, 1);
            room = null;
        }
        else{
            room.resetGame();
            io.in(`room-${roomNumber}`).emit('users-ready', room.users.map(u => u.ready));
            if(room.getCountdown()){
                countdown = room.clearCountdown();
                io.in(`room-${roomNumber}`).emit('gameStart');
            }
            if(room.getGame()){
                io.in(`room-${roomNumber}`).emit('tick', room.getTick());
                socket.to(`room-${roomNumber}`).emit('opleft');
                game = room.stopGame();
            }
        }
    });

    socket.on('msgsnd', (data) => {
        const user = room.getUserById(socket.id);
        let name;
        if(user){
            name = user.name;
        }
        io.in(`room-${roomNumber}`).emit('msgrcv', {data, name});
    });
});

server.listen(process.env.PORT || 3000);