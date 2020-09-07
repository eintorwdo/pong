import $ from 'jquery';
const io = require('socket.io-client');
const socket = io();

let usersReady = {innerArr: []};
let usersProxy = new Proxy(usersReady, {
    set: function(target, property, value){
        if(property === 'innerArr'){
            target[property] = value;
            setUnreadyUsers(value);
            return true;
        }
    },
    get: function(target, name){
        return target[name];
    }
});

const setUnreadyUsers = (arr) => {
    $('#players-ready').remove();
    let str = '';
    arr.forEach((el, i) => {
        if(!el){
            str = str + ' player ' + (i+1) + ',';
        }
    });
    $('#lower-wrapper').append(`<p id="players-ready">${str}</p>`);
}

function selectName(){
    var name = prompt('Enter your name:');
    if(!name){
      selectName();
    }
    else{
      socket.emit('user', name);
    }
}

function appendUserName(data){
    $('#user-list').append(`<li id="${data.id}">${data.name}</li>`);
}

function autoScroll(){
    $('#chat li').last()[0].scrollIntoView();
}

socket.on('users-ready', (data) => {
    usersProxy.innerArr = data;
});

window.onload = () => {
    $(function(){
        selectName();
        setUnreadyUsers(usersProxy.innerArr);
    
        $('#ready').click(() => {
            socket.emit('ready');
            $('#ready').attr("disabled", true);
        });
    
        socket.on('countdown', (data) => {
            $('#cntdwn').remove();
            $('#canvas-wrapper').append(`<p id='cntdwn'>${data}</p>`);
        });
    
        socket.on('gameStart', () => {
            $('#cntdwn').remove();
        });
    
        socket.on('users', (data) => {
            $('#user-list').empty();
            data.forEach(user => {
                appendUserName({id: user.id, name: user.name});
            });
        });
    
        socket.on('dconnected', (data) => {
            console.log('DCON');
            $(`#${data}`).remove();
        });
    
        socket.on('tick', (data) => {
            window.gameData = data;
        });
    
        socket.on('opleft', () => {
            alert('Opponent left. YOU WIN!');
            $('#ready').attr("disabled", false);
        });
    
        socket.on('gameOver', (data) => {
            alert(`Koniec gry. Wygrywa ${data}!`);
            $('#ready').attr("disabled", false);
        });
    
        setInterval(function(){
            if(window.p.keyIsDown(window.p.UP_ARROW)){
                socket.emit('paddleMovement', {
                    direction: 'up'
                });
            }
            else if(window.p.keyIsDown(window.p.DOWN_ARROW)){
                socket.emit('paddleMovement', {
                    direction: 'down'
                });
            }
        }, 5);
    
        document.getElementById('msg-box').addEventListener('keypress', () => {
            if(event.keyCode == 13){
                if($('#msg-box').val().toString().length > 0){
                    const msg = $('#msg-box').val().toString();
                    socket.emit('msgsnd', msg);
                    $('#msg-box').val('');
                }
            }
        });
    
        socket.on('msgrcv', (data) => {
            if(Array.isArray(data)){
                for(msg of data){
                    $('#chat').append(`<li>${msg.name}: ${msg.data}</li>`);
                }
            }
            else{
                $('#chat').append(`<li>${data.name}: ${data.data}</li>`);
            }
            autoScroll();
        });
    });
}

window.onbeforeunload = () => {
    socket.disconnect();
};
