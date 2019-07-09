const socket = io();
new p5();
var side;

function waitForList(data){
    if(window.list == true){
        for(user of data){
            $('#user-list').append(`<li id="${user}">${user}</li>`);
        }
    }
    else{
        setTimeout(waitForList(data), 25);
    }
}


socket.on('user', (data) => {
    $('#user-list').append(`<li id="${data}">${data}</li>`);
})

socket.on('users', (data) => {

    // waitForList(data);
})

socket.on('side', (data) => {
    side = data.left;
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
            left: side,
            up: true
        });
    }
    else if(keyIsDown(DOWN_ARROW)){
        socket.emit('paddleMovement', {
            left: side,
            down: true
        });
    }
}, 10)