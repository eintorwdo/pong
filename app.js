const express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'))

app.get('/', function(req, res){
    res.sendFile(__dirname + `/index.html`)
})

var allClients = [];

io.on('connection', (socket) => {
    allClients.push(socket)
    io.emit('user', 'testusername')

    socket.on('disconnect', () => {
        var i = allClients.indexOf(socket)
        allClients.splice(i, 1)
    })
})

server.listen(3000)