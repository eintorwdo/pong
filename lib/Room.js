const Ball = require('./Ball.js');
const Paddle = require('./Paddle.js');
const {LEFT, RIGHT} = require('../constants/constants.js');

class Room{
    constructor(){
        this.users = [];
        this.leftPaddle = new Paddle(LEFT);
        this.rightPaddle = new Paddle(RIGHT);
        this.ball = new Ball();
        this.leftScore = 0;
        this.rightScore = 0;
        // this.messages = [];
    }

    addUser = (id) => {
        if(id){
            const newUser = {
                id,
                name: null,
                ready: false,
                paddle: this.users.length === 0 ? this.leftPaddle : this.rightPaddle
            };
            this.users.push(newUser);
        }
    }

    setUserName = (name, id) => {
        if(name && id){
            const index = this.users.findIndex(user => user.id === id);
            const usersWithSameName = this.users.filter(user => user.name === name);
            if(index !== -1){
                if(usersWithSameName.length !== 0 && this.users[index].name !== name){
                    this.users[index].name = `${name}(1)`;
                }
                else{
                    this.users[index].name = name;
                }
            }
        }
    }

    getUsers = () => {
        return this.users;
    }

    movePaddle = (socket, direction) => {
        const index = this.users.findIndex(user => user.id === socket.id);
        if(index !== -1){
            if(direction.toLowerCase() === UP){
                this.users[index].paddle.update(UP);
            }
            else if(direction.toLowerCase() === DOWN){
                this.users[index].paddle.update(DOWN);
            }
        }
    }

    setReady = (id) => {
        const index = this.users.findIndex(user => user.id === id);
        if(index !== -1){
            this.users[index].ready = true;
        }
    }

    bothAreReady = () => {
        return this.users.length === 2 && this.users.every(u => u.ready === true);
    }

    goalScore = (side, room) => {
        if(side.toLowerCase() === LEFT){
            this.leftScore++;
        }
        else if(side.toLowerCase() === RIGHT){
            this.rightScore++;
        }
        this.leftPaddle.reset();
        this.rightPaddle.reset();
        const spd = room.ball.reset();
        this.ball.freeze(spd);
    }

    getTick = () => {
        const tick = {
            ball: this.ball,
            leftScore: this.leftScore,
            rightScore: this.rightScore,
            leftPaddle: this.leftPaddle,
            rightPaddle: this.rightPaddle
        }
        return tick;
    }

    isGameOver = (pointsToWin) => {
        if(this.leftScore === pointsToWin || this.rightScore === pointsToWin){
            this.ball.reset();
            this.leftPaddle.reset();
            this.rightPaddle.reset();
            this.rightScore = 0;
            this.leftScore = 0;
            return true;
        }
        return false;
    }

    removeUser = (id) => {
        if(this.users.length > 0){
            const index = this.users.findIndex(user => user.id === id);
            if(index !== -1){
                this.users.splice(index, 1);
            }
        }
    }

    // addMessage = (name, message) => {
    //     this.messages.push({name, message});
    // }
}

module.exports = Room;