const express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var Ball = require('./Ball.js')
var Paddle = require('./Paddle.js')
const utils = require('./utils/utils.js')
global.width = 800
global.height = 600

app.use(express.static('public'))

app.get('/', function(req, res){
    res.sendFile(__dirname + `/index.html`)
})

var allClients = []
var gameRoom = new Map()


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
        utils.resetScore(room)
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
        if(room.usernames.includes(data)){
            data = `${data}(1)`
        }
        var index = room.clients.indexOf(socket.id)
        room.usernames[index] = data
        // var test = [...room.usernames]
        var test = {
            id: [...room.clients],
            name: [...room.usernames]
        }
        var usr = {
            id: room.clients[index],
            name: data
        }
        gameRoom.set(`room-${roomNumber}`, room)
        setTimeout(function(){
            socket.emit('users', utils.removeSender(socket.id, test))
            io.in(`room-${roomNumber}`).emit('user', usr)
            if(room.messages){
                var msgs = [...room.messages]
                socket.emit('msgrcv', msgs)
            }
        }, 450)
    })


    socket.on('paddleMovement', (data) => {
        var room = gameRoom.get(`room-${roomNumber}`)
        if(room.gameInterval){
            utils.movePaddle(room, socket, data)
            gameRoom.set(`room-${roomNumber}`, room)
        }
    })

    socket.on('ready', () => {
        var room = gameRoom.get(`room-${roomNumber}`)
        if(!room.countdown){
            var index = room.clients.indexOf(socket.id)
            room.ready[index] = true

            gameRoom.set(`room-${roomNumber}`, room)
            io.in(`room-${roomNumber}`).emit('users-ready', room.ready)

            var bothAreReady = utils.isEveryPlayerReady(room)

            if(room.clients.length == 2 && bothAreReady){
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
                                utils.score(false, room)
                            }
                            else if(room.ball.update() == 1){
                                utils.score(true, room)
                            }
            
                            gameRoom.set(`room-${roomNumber}`, room)
            
                            io.in(`room-${roomNumber}`).emit('tick', utils.generateTickObj(room))

                            if(utils.isGameOver(room, 10)){
                                utils.resetGameObjects(room)
                                io.in(`room-${roomNumber}`).emit('tick', utils.generateTickObj(room))
                                clearInterval(room.gameInterval)
                                room.gameInterval = null
                                room.countdown = null
                                if(room.leftScore > room.rightScore){
                                    io.in(`room-${roomNumber}`).emit('gameOver', room.usernames[0])
                                }
                                else{
                                    io.in(`room-${roomNumber}`).emit('gameOver', room.usernames[1])
                                }
                                utils.resetScore(room)
                                room.ready = [false, false]
                                io.in(`room-${roomNumber}`).emit('users-ready', room.ready)
                            }
                        }, 15);
                    }
                }, 1000)
            }
        }
    })

    socket.on('disconnect', () => {
        var i = allClients.indexOf(socket)
        allClients.splice(i, 1)
        var room = gameRoom.get(`room-${roomNumber}`)
        var index = room.clients.indexOf(socket.id)
        if(room.usernames){
            io.in(`room-${roomNumber}`).emit('dconnected', room.clients[i])
            room.usernames.splice(index, 1)
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
            utils.resetGameObjects(room)
            if(room.gameInterval){
                io.in(`room-${roomNumber}`).emit('tick', utils.generateTickObj(room))
            }
            clearInterval(room.gameInterval)
            if(room.gameInterval){
                socket.to(`room-${roomNumber}`).emit('opleft')
            }
            room.gameInterval = null
            room.countdown = null
            gameRoom.set(`room-${roomNumber}`, room)
        }
    })

    socket.on('msgsnd', (data) => {
        var room = gameRoom.get(`room-${roomNumber}`)
        var index = room.clients.indexOf(socket.id)
        var name = room.usernames[index]
        if(!room.messages){
            room.messages = []
        }
        room.messages.push({data, name})
        io.in(`room-${roomNumber}`).emit('msgrcv', {data, name})
    })
})

server.listen(process.env.PORT || 3000)