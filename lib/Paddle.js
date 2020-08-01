const {LEFT, RIGHT, UP, DOWN} = require('../constants/constants.js');

class Paddle {
  constructor(side){
    this.width = 30;
    this.y = height/2;
    this.paddleSpeed = 6;
    this.hitMargin = 10;
    this.height = 120;
    if(side.toLowerCase() === LEFT){
      this.x = this.width;
      this.face = {
        x: this.x + this.width/2,
        top: this.y + this.height/2 + this.hitMargin,
        bottom: this.y - this.height/2 - this.hitMargin
      };
    }
    else if(side.toLowerCase() === RIGHT){
      this.x = width - this.width;
      this.face = {
        x: this.x - this.width/2,
        top: this.y + this.height/2 + this.hitMargin,
        bottom: this.y - this.height/2 - this.hitMargin
      };
    }
    this.taken = false;
  }
  
  reset(){
    this.y = height/2;
  }
  
  update(direction){
    if(direction.toLowerCase() === UP){
      this.y = this.y - this.paddleSpeed;
      this.y = Math.min(Math.max(this.y, this.height/2), height - this.height/2);
    }
    else if(direction.toLowerCase() === DOWN){
      this.y = this.y + this.paddleSpeed;
      this.y = Math.min(Math.max(this.y, this.height/2), height - this.height/2);
    }
    this.face.top = this.y + this.height/2 + this.hitMargin;
    this.face.bottom = this.y - this.height/2 - this.hitMargin;
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