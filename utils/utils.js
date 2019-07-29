function score(left, room){
    if(left){
        room.leftScore++
    }
    else{
        room.rightScore++
    }
    room.leftPaddle.reset()
    room.rightPaddle.reset()
    var spd = room.ball.reset()
    room.ball.freeze(spd)
}

function removeSender(sock, all){
    // var newArr
    for(i=0;i<all.id.length;i++){
        if(all.id[i]){
            all.id[i] = all.id[i].toString()
        }
        if(all.id[i] == sock){
            all.id.splice(i,1)
            all.name.splice(i,1)
            continue
        }
    }
    return all
}

function movePaddle(room, socket, data){
    if(room.clients[0] == socket.id){
        if(data.up){
            room.leftPaddle.update(true)
        }
        else{
            room.leftPaddle.update(false)
        }
    }
    else if(room.clients[1] == socket.id){
        if(data.up){
            room.rightPaddle.update(true)
        }
        else{
            room.rightPaddle.update(false)
        }
    }
}

function isEveryPlayerReady(room){
    var ready = room.ready.every((player) => {
        return player
    })
    return ready
}

function generateTickObj(room){
    var tickObj = {
        x: room.ball.x,
        y: room.ball.y,
        leftScore: room.leftScore,
        rightScore: room.rightScore,
        leftPaddle: room.leftPaddle,
        rightPaddle: room.rightPaddle
    }
    return tickObj
}

function resetGameObjects(room){
    room.ball.reset()
    room.leftPaddle.reset()
    room.rightPaddle.reset()
}

function resetScore(room){
    room.leftScore = 0
    room.rightScore = 0
}

function isGameOver(room, pointsToWin){
    if(room.leftScore > pointsToWin-1 || room.rightScore > pointsToWin-1){
        return true
    }
    else{
        return false
    }
}

module.exports = {score, removeSender, movePaddle, isEveryPlayerReady, generateTickObj, resetGameObjects, resetScore, isGameOver}