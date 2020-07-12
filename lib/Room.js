const Ball = require('./Ball.js');
const Paddle = require('./Paddle.js');
const {LEFT, RIGHT, UP, DOWN} = require('../constants/constants.js');

class Room{
    constructor(){
        this.users = [];
        this.leftPaddle = new Paddle(LEFT);
        this.rightPaddle = new Paddle(RIGHT);
        this.ball = new Ball();
        this.leftScore = 0;
        this.rightScore = 0;
        this.inProgress = false;
        this.gameInterval = null;
        this.countdown = null;
    }

    addUser = (id) => {
        if(id){
            const paddle = !this.leftPaddle.isTaken() ? this.leftPaddle : this.rightPaddle;
            paddle.setTaken();
            const newUser = {
                id,
                name: null,
                ready: false,
                paddle
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

    movePaddle = (id, direction) => {
        if(this.inProgress){
            const index = this.users.findIndex(user => user.id === id);
            if(index !== -1){
                if(direction.toLowerCase() === UP){
                    this.users[index].paddle.update(UP);
                }
                else if(direction.toLowerCase() === DOWN){
                    this.users[index].paddle.update(DOWN);
                }
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

    goalScore = (side) => {
        if(side.toLowerCase() === LEFT){
            this.leftScore++;
        }
        else if(side.toLowerCase() === RIGHT){
            this.rightScore++;
        }
        this.leftPaddle.reset();
        this.rightPaddle.reset();
        const spd = this.ball.reset();
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
            this.resetGame();
            const updatedUsers = this.users.map(user => {
                return{
                    id: user.id,
                    name: user.name,
                    ready: false,
                    paddle: user.paddle
                }
            });
            this.users = updatedUsers;
            this.inProgress = false;
            return true;
        }
        return false;
    }

    startGame = (gameInterval) => {
        this.inProgress = true;
        this.gameInterval = gameInterval;
    }

    stopGame = () => {
        this.resetGame();
        clearInterval(this.gameInterval);
        this.gameInterval = null;
        this.inProgress = false;
        return this.gameInterval;
    }

    setCountdown = (countdown) => {
        this.countdown = countdown;
    }

    clearCountdown = () => {
        clearInterval(this.countdown);
        this.countdown = null;
        return this.countdown;
    }

    resetGame = () => {
        this.ball.reset();
        this.leftPaddle.reset();
        this.rightPaddle.reset();
        this.rightScore = 0;
        this.leftScore = 0;
    }

    getGame = () => {
        return this.gameInterval;
    }

    getCountdown = () => {
        return this.countdown;
    }

    removeUser = (id) => {
        if(this.users.length > 0){
            const index = this.users.findIndex(user => user.id === id);
            if(index !== -1){
                this.users[index].paddle.setNotTaken();
                const user = this.users[index];
                this.users.splice(index, 1);
                return user;
            }
        }
    }

    getUserById = (id) => {
        return this.users.filter(user => user.id === id);
    }
}

module.exports = Room;