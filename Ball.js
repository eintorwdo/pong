class Ball{
  
  constructor(rightPaddle, leftPaddle){
    this.d = 20;
    this.r = this.d/2;
    this.x = width/2;
    this.y = height/2;
    this.angle = random(-PI/4, PI/4);
    this.xspeed = 5 * cos(this.angle);
    this.yspeed = 5 * sin(this.angle);
  }
  
  reset(){
    this.x = width/2;
    this.y = height/2;
    this.angle = random(-2*PI, 2*PI);
    this.xspeed = 5 * cos(this.angle);
    this.yspeed = 5 * sin(this.angle);
  }
  
  update(){
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    
    if(this.x - this.r < 40 || this.x + this.r > width - 40){
      this.reset();
      return -1;
    }
    
    if(this.y - this.r < 0 || this.y + this.r > height){
      this.yspeed *= -1;
    }
  }
  
  hitRightPaddle(rightPaddle){
    if(this.x + this.r >= rightPaddle.x - rightPaddle.width/2 && this.y > rightPaddle.y - rightPaddle.height/2 - rightPaddle.hitMargin && this.y < rightPaddle.y + rightPaddle.height/2 + rightPaddle.hitMargin){
      this.xspeed *= -1;
      console.log(diff);
    }
  }
  
  hitLeftPaddle(leftPaddle){
    if(this.x - this.r <= leftPaddle.x + leftPaddle.width/2 && this.y > leftPaddle.y - leftPaddle.height/2 - leftPaddle.hitMargin && this.y < leftPaddle.y + leftPaddle.height/2 + leftPaddle.hitMargin){
      this.xspeed *= -1;
      console.log('left');
    }
  }
  
  show(){
    fill(100);
    circle(this.x, this.y, this.d);
  }
}