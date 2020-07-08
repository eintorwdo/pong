class Ball{
  
  constructor(w, h){
    this.width
    this.d = 20;
    this.r = this.d/2;
    this.x = width/2;
    this.y = height/2;
    this.angle = Math.random(-Math.PI/2, Math.PI/2);
    this.maxSpeed = 9;
    this.minSpeed = 5;
    var direction = Math.floor(Math.random() * (1 - 0 +1)) + 0;
    if(direction == 0){
      direction = -1;
    }
    this.xspeed = direction * (this.minSpeed-2) * Math.cos(this.angle);
    this.yspeed = (this.minSpeed-2) * Math.sin(this.angle);
  }
  
  reset(){
    this.x = width/2;
    this.y = height/2;
    this.angle = Math.random(-Math.PI/2, Math.PI/2);
    var direction = Math.floor(Math.random() * (1 - 0 +1)) + 0;
    if(direction == 0){
      direction = -1;
    }
    this.xspeed = direction * (this.minSpeed-2) * Math.cos(this.angle);
    this.yspeed = 3 * Math.sin(this.angle);
    return [this.xspeed, this.yspeed];
  }

  freeze(spd){
    this.xspeed = 0
    this.yspeed = 0
    setTimeout(()=>{
      this.xspeed = spd[0]
      this.yspeed = spd[1]
    }, 1000)
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
      //this.xspeed *= -1;
      
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
      //this.xspeed *= -1;
      
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