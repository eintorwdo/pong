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
    this.xspeed = this.minSpeed * Math.cos(this.angle);
    this.yspeed = this.minSpeed * Math.sin(this.angle);
    return [this.xspeed, this.yspeed];
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

  freeze(spd){
    this.xspeed = 0
    this.yspeed = 0
    setTimeout(()=>{
      this.xspeed = spd[0]
      this.yspeed = spd[1]
    }, 1500)
  }
  
  update(){
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
  }
  
  hitRightPaddle(rightPaddle){
    if(this.x + this.r > rightPaddle.x - rightPaddle.width/2 && this.y > rightPaddle.y - rightPaddle.height/2 - rightPaddle.hitMargin && this.y < rightPaddle.y + rightPaddle.height/2 + rightPaddle.hitMargin){
      this.x = rightPaddle.x - rightPaddle.width/2 - this.r;
      
      var diff = (rightPaddle.y - this.y)/(rightPaddle.height/2);
      var maxAngle = 4*Math.PI/12;
      
      if(diff > 1){
        diff = 1;
      }
      else if(diff < -1){
        diff = -1;
      }
      
      this.angle = diff * maxAngle;
      var newSpeed = Math.abs(this.maxSpeed * diff);
      if(newSpeed < this.minSpeed){
        newSpeed = this.minSpeed;
      }
      this.xspeed = -newSpeed * Math.cos(this.angle);
      this.yspeed = -newSpeed * Math.sin(this.angle);
    }
  }
  
  hitLeftPaddle(leftPaddle){
    if(this.x - this.r < leftPaddle.x + leftPaddle.width/2 && this.y > leftPaddle.y - leftPaddle.height/2 - leftPaddle.hitMargin && this.y < leftPaddle.y + leftPaddle.height/2 + leftPaddle.hitMargin){
      this.x = leftPaddle.x + leftPaddle.width/2 + this.r;
      
      var diff = (leftPaddle.y - this.y)/(leftPaddle.height/2);
      var maxAngle = 4*Math.PI/12;
      
      if(diff > 1){
        diff = 1;
      }
      else if(diff < -1){
        diff = -1;
      }
      
      this.angle = diff * maxAngle;
      var newSpeed = Math.abs(this.maxSpeed * diff);
      if(newSpeed < this.minSpeed){
        newSpeed = this.minSpeed;
      }
      this.xspeed = newSpeed * Math.cos(this.angle);
      this.yspeed = -newSpeed * Math.sin(this.angle);
    }
  }
}

module.exports = Ball