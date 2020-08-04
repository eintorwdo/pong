const _ = require('lodash');

class Ball{
  constructor(){
    this.r = 10;
    this.x = width/2;
    this.y = height/2;
    this.angle = this.getRandomAngle();
    this.maxSpeed = 9;
    this.minSpeed = 5;
    this.xspeed = this.minSpeed * Math.cos(this.angle);
    this.yspeed = this.minSpeed * Math.sin(this.angle);
  }
  
  reset(){
    this.x = width/2;
    this.y = height/2;
    this.angle = this.getRandomAngle();
    this.xspeed = 0;
    this.yspeed = 0;
    setTimeout(() => {
      this.xspeed = this.minSpeed * Math.cos(this.angle);
      this.yspeed = this.minSpeed * Math.sin(this.angle);
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
    if(this.x - this.r < 10){
      return -1;
    }
    else if(this.x + this.r > width - 10){
      return 1;
    }
    if(this.y - this.r <= 0 || this.y + this.r >= height){
      this.yspeed *= -1;
    }
    this.hitRightPaddle(rightPaddle);
    this.hitLeftPaddle(leftPaddle);
  }
  
  hitRightPaddle(rightPaddle){
    if(this.x > rightPaddle.face.x && _.inRange(this.y, rightPaddle.face.bottom, rightPaddle.face.top)){
      this.x = rightPaddle.x - rightPaddle.width/2 - this.r;
      const {angle, newSpeed} = this.paddleDeflectionAngle(rightPaddle);
      this.angle = angle;
      this.xspeed = -newSpeed * Math.cos(this.angle);
      this.yspeed = -newSpeed * Math.sin(this.angle);
    }
  }
  
  hitLeftPaddle(leftPaddle){
    if(this.x < leftPaddle.face.x && _.inRange(this.y, leftPaddle.face.bottom, leftPaddle.face.top)){
      this.x = leftPaddle.x + leftPaddle.width/2 + this.r;
      const {angle, newSpeed} = this.paddleDeflectionAngle(leftPaddle);
      this.angle = angle;
      this.xspeed = newSpeed * Math.cos(this.angle);
      this.yspeed = -newSpeed * Math.sin(this.angle);
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
}

module.exports = Ball;