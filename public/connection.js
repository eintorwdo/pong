const socket = io();
new p5();

function selectName(){
    var name = prompt('Enter your name:');
    if(!name){
      selectName()
    }
    else{
      socket.emit('username', name);
    }
}

selectName()

function waitForList(data){
    $('#user-list').append(`<li id="${data.id}">${data.name}</li>`);
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
    $('#lower-wrapper').append(`<p id="players-ready">${str}</p>`);
})

socket.on('countdown', (data) => {
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
    for(i=0;i<data.id.length;i++){
        if(data.name[i] != null){
            waitForList({id: data.id[i], name: data.name[i]});
        }
    }
})

socket.on('dconnected', (data) => {
    console.log('DCON');
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
            up: true
        });
    }
    else if(keyIsDown(DOWN_ARROW)){
        socket.emit('paddleMovement', {
            up: false
        });
    }
}, 5)

var check = setInterval(() => {
    if($('#msg-box')){
        clearInterval(check);

        document.getElementById('msg-box').addEventListener('keypress', () => {
            if(event.keyCode == 13){
                if($('#msg-box').val().toString().length > 0){
                    var msg = $('#msg-box').val().toString()
                    socket.emit('msgsnd', msg);
                    $('#msg-box').val('');
                }
            }
        })
    }
}, 100)

function autoScroll(){
    $('#chat li').last()[0].scrollIntoView();
}

socket.on('msgrcv', (data) => {
    if(Array.isArray(data)){
        for(msg of data){
            console.log(msg)
            $('#chat').append(`<li>${msg.name}: ${msg.data}</li>`);
        }
    }
    else{
        $('#chat').append(`<li>${data.name}: ${data.data}</li>`);
    }
    autoScroll();
})