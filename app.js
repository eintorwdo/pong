const express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var Ball = require('./Ball.js')
var Paddle = require('./Paddle.js')
global.width = 800
global.height = 600

var b = new Ball(width, height)
var leftPaddle = new Paddle(true)
var rightPaddle = new Paddle(false)
var leftScore = 0;
var rightScore = 0;

app.use(express.static('public'))

app.get('/', function(req, res){
    res.sendFile(__dirname + `/index.html`)
})

var allClients = []
var gameRoom = new Map()

function removeSender(sock, all){
    var newArr = Object.keys(all);
    // console.log(newArr)
    for(i=0;i<newArr.length;i++){
        newArr[i] = newArr[i].toString()
        if(newArr[i] == sock.id){
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

    setTimeout(function(){
        socket.emit('users', removeSender(socket, io.sockets.adapter.rooms[`room-${roomNumber}`].sockets))
        io.in(`room-${roomNumber}`).emit('user', socket.id)
    }, 250)

    if(gameRoom.has(`room-${roomNumber}`)){
        var room = gameRoom.get(`room-${roomNumber}`)
        room.clients.push(socket.id)
        gameRoom.set(`room-${roomNumber}`, room)
        console.log(gameRoom.get(`room-${roomNumber}`).clients)
    }
    else{
        var clients = [socket.id]
        gameRoom.set(`room-${roomNumber}`, {clients})
        console.log(gameRoom.get(`room-${roomNumber}`).clients)
    }
    
    if(allClients[0] == socket){
        socket.emit('side', {left: true})
    }
    else if(allClients[1] == socket){
        socket.emit('side', {left: false})
    }

    socket.on('paddleMovement', (data) => {
        if(data.left){
            if(data.up){
                leftPaddle.update(data.up)
            }
            else if(data.down){
                leftPaddle.update(false, data.down)
            }
        }
        else{
            if(data.up){
                rightPaddle.update(data.up)
            }
            else if(data.down){
                rightPaddle.update(false, data.down)
            }
        }
    })

    socket.on('disconnect', () => {
        var i = allClients.indexOf(socket)
        allClients.splice(i, 1)
        io.emit('dconnected', socket.id)
        var room = gameRoom.get(`room-${roomNumber}`)
        var index = room.clients.indexOf(socket.id)
        room.clients.splice(index, 1)
        if(room.clients.length == 0){
            gameRoom.delete(`room-${roomNumber}`)
        }
        else{
            gameRoom.set(`room-${roomNumber}`, room)
            console.log(gameRoom.get(`room-${roomNumber}`))
        }
    })
})

// setInterval(function(){

//     b.hitRightPaddle(rightPaddle);
//     b.hitLeftPaddle(leftPaddle);

//     if(b.update() == -1){
//         leftPaddle.reset();
//         rightPaddle.reset();
//         rightScore++;
//         b.reset();
//         }
//         else if(b.update() == 1){
//         leftScore++;
//         leftPaddle.reset();
//         rightPaddle.reset();
//         b.reset();
//         }

//     io.emit('tick', {
//         x: b.x,
//         y: b.y,
//         leftScore,
//         rightScore,
//         leftPaddle,
//         rightPaddle
//     });
// }, 15);
server.listen(3000)