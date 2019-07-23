const socket = io();
new p5();
var side;

function waitForList(data){
    $('#user-list').append(`<li id="${data}">${data}</li>`);
}

$('#ready').click(() => {
    socket.emit('ready');
    $('#ready').attr("disabled", true);
})

socket.on('users-ready', (data) => {
    $('#players-ready').remove();
    var str = "";
    for(i=0;i<data.length;i++){
        if(!data[i]){
            str = str + ' player ' + (i+1) + ',';
        }
    }
    console.log(str);
    $('#lower-wrapper').append(`<p id="players-ready">${str}</p>`);
})

socket.on('countdown', (data) => {
    console.log(data);
    $('#cntdwn').remove();
    $('#canvas-wrapper').append(`<p id='cntdwn'>${data}</p>`);
})

socket.on('gameStart', () => {
    $('#cntdwn').remove();
})

socket.on('user', (data) => {
    waitForList(data);
})

socket.on('users', (data) => {
    for(user of data){
        waitForList(user);
    }
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

socket.on('opleft', () => {
    alert('Opponent left. YOU WIN!');
    $('#ready').attr("disabled", false);
})

socket.on('gameOver', (data) => {
    alert(`Koniec gry. Wygrywa ${data}!`);
    $('#ready').attr("disabled", false);
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