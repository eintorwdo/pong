class Paddle {
  
  constructor(left){
    this.width = 30;
    this.height = 120;
    this.left = left;
    this.y = height/2;
    if(this.left){
      this.x = this.width;
    }
    else{
      this.x = width - this.width;
    }
    this.hitMargin = 5;
  }
  
  show(){
    rectMode(CENTER);
    fill(100);
    rect(this.x, this.y, this.width, this.height);
  }
}