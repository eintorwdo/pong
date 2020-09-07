const _ = require('lodash');
const {WIDTH: width, HEIGHT: height} = require('../constants/constants.js');

class Ball{
  constructor(){
    this.r = 10;
    this.x = width/2;
    this.y = height/2;
    this.maxSpeed = 9;
    this.minSpeed = 5;
    this.xspeed = this.minSpeed * Math.cos(this.getRandomAngle());
    this.yspeed = this.minSpeed * Math.sin(this.getRandomAngle());
  }
  
  reset(){
    this.maxSpeed = 9;
    this.minSpeed = 5;
    this.x = width/2;
    this.y = height/2;
    this.xspeed = 0;
    this.yspeed = 0;
    setTimeout(() => {
      this.xspeed = this.minSpeed * Math.cos(this.getRandomAngle());
      this.yspeed = this.minSpeed * Math.sin(this.getRandomAngle());
    }, 1500);
  }

  getRandomAngle = () => {
    let angle = Math.random() * Math.PI * 2;
    if(angle > Math.PI/3 && angle < Math.PI/2){
      angle = Math.random() * Math.PI/3;
    }
    if(angle > Math.PI*3/2 && angle < Math.PI*5/3){
      angle = Math.random() * (Math.PI*2 - Math.PI*5/3) + Math.PI*5/3;
    }
    if(angle >= Math.PI/2 && angle < Math.PI*2/3){
      angle = Math.random() * (Math.PI - Math.PI*2/3) + Math.PI*2/3;
    }
    if(angle <= Math.PI*3/2 && angle > Math.PI*4/3){
      angle = Math.random() * (Math.PI*4/3 - Math.PI) + Math.PI;
    }
    return angle;
  }
  
  update(rightPaddle, leftPaddle){
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    this.hitRightPaddle(rightPaddle);
    this.hitLeftPaddle(leftPaddle);
    if(this.x - this.r < 10){
      return -1;
    }
    else if(this.x + this.r > width - 10){
      return 1;
    }
    if(this.y - this.r <= 0 || this.y + this.r >= height){
      if(this.y - this.r < 0){
        this.y = this.r;
      }
      if(this.y + this.r > height){
        this.y = height - this.r;
      }
      this.yspeed *= -1;
    }
  }
  
  hitRightPaddle(rightPaddle){
    if(this.x >= rightPaddle.edgeX && _.inRange(this.y, rightPaddle.bottom, rightPaddle.top)){
      this.x = rightPaddle.edgeX - this.r;
      const {angle, newSpeed} = this.paddleDeflectionAngle(rightPaddle);
      this.xspeed = -newSpeed * Math.cos(angle);
      this.yspeed = -newSpeed * Math.sin(angle);
      this.increaseSpeed();
    }
  }
  
  hitLeftPaddle(leftPaddle){
    if(this.x <= leftPaddle.edgeX && _.inRange(this.y, leftPaddle.bottom, leftPaddle.top)){
      this.x = leftPaddle.edgeX + this.r;
      const {angle, newSpeed} = this.paddleDeflectionAngle(leftPaddle);
      this.xspeed = newSpeed * Math.cos(angle);
      this.yspeed = -newSpeed * Math.sin(angle);
      this.increaseSpeed();
    }
  }

  paddleDeflectionAngle = (paddle) => {
    let diff = (paddle.y - this.y)/(paddle.height/2);
    let maxAngle = 4*Math.PI/12;
    if(diff > 1){
      diff = 1;
    }
    else if(diff < -1){
      diff = -1;
    }
    let newSpeed = Math.abs(this.maxSpeed * diff);
    if(newSpeed < this.minSpeed){
      newSpeed = this.minSpeed;
    }
    return {
      angle: diff * maxAngle,
      newSpeed
    };
  }

  increaseSpeed = () => {
    this.minSpeed += 0.5;
    this.maxSpeed += 0.5;
  }
}

module.exports = Ball;