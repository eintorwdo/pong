class Paddle {
  
  constructor(keyUp, keyDown, left){
    this.up = keyUp;
    this.down = keyDown;
    this.width = 30;
    this.height = 120;
    this.left = left;
    this.y = height/2;
    this.paddleSpeed = 20;
    if(this.left){
      this.x = this.width;
    }
    else{
      this.x = width - this.width;
    }
    this.hitMargin = 5;
  }
  
  reset(){
    this.y = height/2;
  }
  
  update(){
    if(keyIsDown(this.up)){
      this.y = this.y - this.paddleSpeed;
      this.y = constrain(this.y, this.height/2, height - this.height/2);
    }
    else if(keyIsDown(this.down)){
      this.y = this.y + this.paddleSpeed;
      this.y = constrain(this.y, this.height/2, height - this.height/2);
    }
  }
  
  show(){
    rectMode(CENTER);
    fill(100);
    rect(this.x, this.y, this.width, this.height);
  }
}