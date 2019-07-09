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

var allClients = [];

io.on('connection', (socket) => {
    allClients.push(socket)
    io.emit('user', socket.id)
    var clientIDs = []
    for(sock of allClients){
        clientIDs.push(sock.id)
    }
    socket.emit('users', clientIDs)
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
    })
})

setInterval(function(){

    b.hitRightPaddle(rightPaddle);
    b.hitLeftPaddle(leftPaddle);

    if(b.update() == -1){
        leftPaddle.reset();
        rightPaddle.reset();
        rightScore++;
        b.reset();
        }
        else if(b.update() == 1){
        leftScore++;
        leftPaddle.reset();
        rightPaddle.reset();
        b.reset();
        }

    io.emit('tick', {
        x: b.x,
        y: b.y,
        leftScore,
        rightScore,
        leftPaddle,
        rightPaddle
    });
}, 15);
server.listen(3000)