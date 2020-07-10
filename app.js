const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Ball = require('./lib/Ball.js');
const Paddle = require('./lib/Paddle.js');
const Room = require('./lib/Room.js');
const {findRoomWithPlayer} = require('./utils/utils.js');
global.width = 800;
global.height = 600;
const {LEFT, RIGHT} = require('./constants/constants.js');

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + `/index.html`);
});

const allClients = [];
const rooms = [];

io.on('connection', (socket) => {
    allClients.push(socket);
    const roomNumber = findRoomWithPlayer(rooms);
    let room;
    let countdown;
    let game;
    if(roomNumber !== -1){
        socket.join(`room-${roomNumber}`);
        io.in(`room-${roomNumber}`).emit('tick', null);
        room = rooms[roomNumber];
        room.addUser(socket.id);
        rooms.splice(roomNumber, 1 , room);
        setTimeout(() => {
            io.in(`room-${roomNumber}`).emit('users-ready', room.users.map(u => u.ready));
        }, 300);
    }
    else{
        room = new Room();
        room.addUser(socket.id);
        rooms.push(room);
        setTimeout(()=>{
            io.in(`room-${roomNumber}`).emit('users-ready', room.users.map(u => u.ready));
        }, 300);
    }

    socket.on('user', (data) => {
        if(!data || data === ''){
            data = 'default';
        }
        room.setUserName(data, socket.id);
        setTimeout(function(){
            io.in(`room-${roomNumber}`).emit('users', room.users);
        }, 450);
    })


    socket.on('paddleMovement', (data) => {
        if(game){
            rooms[roomNumber].movePaddle(socket.id, data.direction);
        }
    });

    socket.on('ready', () => {
        if(!countdown){
            room.setReady(socket.id);
            io.in(`room-${roomNumber}`).emit('users-ready', room.users.map(u => u.ready));
            if(room.bothAreReady()){
                let x = 3;
                countdown = setInterval(() => {
                    io.in(`room-${roomNumber}`).emit('countdown', x)
                    x--;
                    if(x < 0){
                        clearInterval(countdown)
                        countdown = null;
                        io.in(`room-${roomNumber}`).emit('gameStart');
                        game = setInterval(function(){
                            room.ball.hitRightPaddle(room.rightPaddle);
                            room.ball.hitLeftPaddle(room.leftPaddle);
                            if(room.ball.update() === -1){
                                room.goalScore(LEFT);
                            }
                            else if(room.ball.update() === 1){
                                room.goalScore(RIGHT);
                            }
                            if(room.isGameOver(10)){
                                io.in(`room-${roomNumber}`).emit('tick', room.getTick(room));
                                clearInterval(game);
                                game = null;
                                countdown = null;
                                if(room.leftScore > room.rightScore){
                                    io.in(`room-${roomNumber}`).emit('gameOver', room.users[0].name);
                                }
                                else{
                                    io.in(`room-${roomNumber}`).emit('gameOver', room.users[1].name);
                                }
                                io.in(`room-${roomNumber}`).emit('users-ready', room.users.map(u => u.ready))
                            }
                            io.in(`room-${roomNumber}`).emit('tick', room.getTick());
                        }, 15);
                    }
                }, 1000);
            }
        }
    })

    socket.on('disconnect', () => {
        const removedUser = room.removeUser(socket.id);
        io.in(`room-${roomNumber}`).emit('dconnected', removedUser.id);
        if(room.users.length == 0){
            if(countdown){
                clearInterval(countdown);
            }
            if(game){
                clearInterval(game);
            }
            rooms.splice(roomNumber, 1);
            room = null;
        }
        else{
            if(countdown){
                clearInterval(countdown);
                io.in(`room-${roomNumber}`).emit('gameStart');
            }
            room.resetGame();
            if(game){
                io.in(`room-${roomNumber}`).emit('tick', room.getTick());
            }
            if(game){
                clearInterval(game);
                socket.to(`room-${roomNumber}`).emit('opleft');
            }
            game = null;
            countdown = null;
        }
    })

    socket.on('msgsnd', (data) => {
        const user = room.getUserById(socket.id);
        let name;
        if(user){
            name = user.name;
        }
        io.in(`room-${roomNumber}`).emit('msgrcv', {data, name});
    })
})

server.listen(process.env.PORT || 3000)