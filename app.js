const express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var Ball = require('./Ball.js')
var Paddle = require('./Paddle.js')
global.width = 800
global.height = 600

app.use(express.static('public'))

app.get('/', function(req, res){
    res.sendFile(__dirname + `/index.html`)
})

var allClients = []
var gameRoom = new Map()

function removeSender(sock, all){
    var newArr
    if(!Array.isArray(all)){
        newArr = Object.keys(all)
    }
    else{
        newArr = all
    }
    for(i=0;i<newArr.length;i++){
        if(newArr[i]){
            newArr[i] = newArr[i].toString()
        }
        if(newArr[i] == sock){
            newArr.splice(i,1)
            continue
        }
    }
    return newArr
}

io.on('connection', (socket) => {
    allClients.push(socket)
    var roomNumber = Math.ceil(allClients.length/2)
    socket.join(`room-${roomNumber}`)
    // console.log(io.sockets.adapter.rooms['room-1'].sockets)

    if(gameRoom.has(`room-${roomNumber}`)){
        io.in(`room-${roomNumber}`).emit('tick', null)
        var room = gameRoom.get(`room-${roomNumber}`)
        room.clients.push(socket.id)
        room.rightPaddle = new Paddle(false)
        room.ball = new Ball(width, height)
        room.leftScore = 0
        room.rightScore = 0
        gameRoom.set(`room-${roomNumber}`, room)
        setTimeout(()=>{
            io.in(`room-${roomNumber}`).emit('users-ready', room.ready)
        },300)
    }
    else{
        var clients = [socket.id]
        var leftPaddle = new Paddle(true)
        var leftScore = 0
        var rightScore = 0
        var ready = [false, false]
        gameRoom.set(`room-${roomNumber}`, {clients, leftPaddle, leftScore, rightScore, ready})
        setTimeout(()=>{
            io.in(`room-${roomNumber}`).emit('users-ready', ready)
        },300) 
    }

    socket.on('username', (data) => {
        var room = gameRoom.get(`room-${roomNumber}`)
        if(!data || data == ''){
            data = 'default'
        }
        if(!room.usernames){
            room.usernames = new Array(2)
        }
        var index = room.clients.indexOf(socket.id)
        room.usernames[index] = data
        var test = [...room.usernames]
        gameRoom.set(`room-${roomNumber}`, room)
        setTimeout(function(){
            socket.emit('users', removeSender(data, test))
            io.in(`room-${roomNumber}`).emit('user', data)
        }, 250)
    })


    if(gameRoom.get(`room-${roomNumber}`).clients[0] == socket.id){
        socket.emit('side', {left: true})
    }
    else if(gameRoom.get(`room-${roomNumber}`).clients[1] == socket.id){
        socket.emit('side', {left: false})
    }

    socket.on('paddleMovement', (data) => {
        var room = gameRoom.get(`room-${roomNumber}`)
        if(room.clients[0] == socket.id){
            if(data.up){
                room.leftPaddle.update(data.up)
            }
            else if(data.down){
                room.leftPaddle.update(false, data.down)
            }
        }
        else if(room.clients[1] == socket.id){
            if(data.up){
                room.rightPaddle.update(data.up)
            }
            else if(data.down){
                room.rightPaddle.update(false, data.down)
            }
        }
        gameRoom.set(`room-${roomNumber}`, room)
    })

    socket.on('ready', () => {
        var room = gameRoom.get(`room-${roomNumber}`)
        if(!room.countdown){
            if(room.clients.length < 2){
                room.ready[0] = true
            }
            else{
                var index = room.clients.indexOf(socket.id)
                room.ready[index] = true
            }
            gameRoom.set(`room-${roomNumber}`, room)
            io.in(`room-${roomNumber}`).emit('users-ready', room.ready)

            if(gameRoom.has(`room-${roomNumber}`)){
                var areReady = room.ready.every((player) => {
                    return player
                })
                if(room.clients.length == 2 && areReady){
                    var x = 3
                    room.countdown = setInterval(() => {
                        io.in(`room-${roomNumber}`).emit('countdown', x)
                        x--
                        if(x<0){
                            clearInterval(room.countdown)
                            room.countdown = null
                            io.in(`room-${roomNumber}`).emit('gameStart')
                            room.gameInterval = setInterval(function(){
                                room.ball.hitRightPaddle(room.rightPaddle);
                                room.ball.hitLeftPaddle(room.leftPaddle);
                
                                if(room.ball.update() == -1){
                                    room.leftPaddle.reset();
                                    room.rightPaddle.reset();
                                    room.rightScore++;
                                    room.ball.reset();
                                }
                                else if(room.ball.update() == 1){
                                    room.leftScore++;
                                    room.leftPaddle.reset();
                                    room.rightPaddle.reset();
                                    room.ball.reset();
                                }
                
                                gameRoom.set(`room-${roomNumber}`, room)
                
                                io.in(`room-${roomNumber}`).emit('tick', {
                                    x: room.ball.x,
                                    y: room.ball.y,
                                    leftScore: room.leftScore,
                                    rightScore: room.rightScore,
                                    leftPaddle: room.leftPaddle,
                                    rightPaddle: room.rightPaddle
                                });

                                if(room.leftScore > 4 || room.rightScore > 4){
                                    room.ball.reset()
                                    room.leftPaddle.reset()
                                    room.rightPaddle.reset()
                                    io.in(`room-${roomNumber}`).emit('tick', {
                                        x: room.ball.x,
                                        y: room.ball.y,
                                        leftScore: room.leftScore,
                                        rightScore: room.rightScore,
                                        leftPaddle: room.leftPaddle,
                                        rightPaddle: room.rightPaddle
                                    });
                                    clearInterval(room.gameInterval)
                                    room.gameInterval = null
                                    room.countdown = null
                                    if(room.leftScore > room.rightScore){
                                        io.in(`room-${roomNumber}`).emit('gameOver', room.usernames[0])
                                    }
                                    else{
                                        io.in(`room-${roomNumber}`).emit('gameOver', room.usernames[1])
                                    }
                                    room.leftScore = 0
                                    room.rightScore = 0
                                    room.ready = [false, false]
                                    io.in(`room-${roomNumber}`).emit('users-ready', room.ready)
                                }
                            }, 15);
                        }
                    }, 1000)
                }
            }
        }
    })

    socket.on('disconnect', () => {
        var i = allClients.indexOf(socket)
        allClients.splice(i, 1)
        var room = gameRoom.get(`room-${roomNumber}`)
        var index = room.clients.indexOf(socket.id)
        if(room.usernames){
            io.in(`room-${roomNumber}`).emit('dconnected', room.usernames[i])
        }
        room.ready[index] = false
        room.clients.splice(index, 1)
        if(room.clients.length == 0){
            if(room.countdown){
                clearInterval(room.countdown)
            }
            clearInterval(room.gameInterval)
            gameRoom.delete(`room-${roomNumber}`)
        }
        else{
            if(room.countdown){
                clearInterval(room.countdown)
                io.in(`room-${roomNumber}`).emit('gameStart')
            }
            room.leftPaddle.reset()
            room.rightPaddle.reset()
            room.ball.reset()
            if(room.gameInterval){
                io.in(`room-${roomNumber}`).emit('tick', {
                    x: room.ball.x,
                    y: room.ball.y,
                    leftScore: room.leftScore,
                    rightScore: room.rightScore,
                    leftPaddle: room.leftPaddle,
                    rightPaddle: room.rightPaddle
                });
            }
            clearInterval(room.gameInterval)
            if(room.gameInterval){
                socket.to(`room-${roomNumber}`).emit('opleft')
            }
            room.gameInterval = null
            room.countdown = null
            // room.ready = [false, false]
            gameRoom.set(`room-${roomNumber}`, room)
        }
    })
})

server.listen(process.env.PORT || 3000)