const express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Ball = require('./Ball.js')
global.width = 800
global.height = 600

var b = new Ball(width, height)
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

    socket.on('disconnect', () => {
        var i = allClients.indexOf(socket)
        allClients.splice(i, 1)
        io.emit('dconneted', socket.id)
    })
})

// while(leftScore <= 10 || rightScore <=10){
    
    setInterval(function(){
        if(b.update() == -1){
            //leftPaddle.reset();
             //rightPaddle.reset();
              rightScore++;
             b.reset();
         }
         else if(b.update() == 1){
             leftScore++;
             //leftPaddle.reset();
             //rightPaddle.reset();
             b.reset();
         }

        io.emit('tick', {
            x: b.x,
            y: b.y,
            leftScore,
            rightScore
        });
    }, 15);
// }

server.listen(3000)