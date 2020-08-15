class Ball{
  constructor(){
    this.d = 20;
    this.x = width/2;
    this.y = height/2;
  }
  
  show(){
    fill(100);
    circle(this.x, this.y, this.d);
  }
}