const socket = io();
new p5();
var up = UP_ARROW;
// var down = 'DOWN_ARROW';

socket.on('user', (data) => {
    $('#user-list').append(`<li id="${data}">${data}</li>`);
})

socket.on('dconnected', (data) => {
    $(`#${data}`).remove();
})

socket.on('tick', (data) => {
    window.gameData = data;
})

setInterval(function(){
    if(keyIsDown(UP_ARROW)){
        socket.emit('paddleMovement', {
            left: true,
            up: true
        });
    }
    else if(keyIsDown(DOWN_ARROW)){
        socket.emit('paddleMovement', {
            left: true,
            down: true
        });
    }
}, 10)