const {LEFT, RIGHT, UP, DOWN} = require('../constants/constants.js');

class Paddle {
  constructor(side){
    this.taken = false;
    this.width = 30;
    this.y = height/2;
    this.paddleSpeed = 5;
    this.hitMargin = 10;
    this.height = 120;
    this.top = this.y + this.height/2 + this.hitMargin;
    this.bottom = this.y - this.height/2 - this.hitMargin;
    if(side.toLowerCase() === LEFT){
      this.x = this.width;
      this.edgeX = this.x + this.width/2;
    }
    else if(side.toLowerCase() === RIGHT){
      this.x = width - this.width;
      this.edgeX = this.x - this.width/2;
    }
  }
  
  reset(){
    this.y = height/2;
    this.top = this.y + this.height/2 + this.hitMargin;
    this.bottom = this.y - this.height/2 - this.hitMargin;
  }
  
  update(direction){
    if(direction.toLowerCase() === UP){
      this.y = this.y - this.paddleSpeed;
    }
    else if(direction.toLowerCase() === DOWN){
      this.y = this.y + this.paddleSpeed;
    }
    this.y = Math.min(Math.max(this.y, this.height/2), height - this.height/2);
    this.top = this.y + this.height/2 + this.hitMargin;
    this.bottom = this.y - this.height/2 - this.hitMargin;
  }

  setTaken(){
    this.taken = true;
  }

  setNotTaken(){
    this.taken = false;
  }

  isTaken(){
    return this.taken;
  }
}

module.exports = Paddle;