const socket = io();

socket.on('user', (data) => {
    $('#user-list').append(`<li id="user">${data}</li>`);
})