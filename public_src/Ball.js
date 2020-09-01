class Ball{
  constructor(){
    this.d = 20;
    this.x = window.p.width/2;
    this.y = window.p.height/2;
  }
  
  show(){
    window.p.fill(100);
    window.p.circle(this.x, this.y, this.d);
  }
}

export default Ball;