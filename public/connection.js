const socket = io();
// var gameData;

socket.on('user', (data) => {
    $('#user-list').append(`<li id="${data}">${data}</li>`);
})

socket.on('dconnected', (data) => {
    $(`#${data}`).remove();
})

socket.on('tick', (data) => {
    window.gameData = data;
})
