class Ball{
  constructor(){
    this.d = 20;
    this.x = window.p.width/2;
    this.y = window.p.height/2;
  }
  
  show(){
    const p5Sketch = window.p;
    p5Sketch.fill(100);
    p5Sketch.circle(this.x, this.y, this.d);
  }
}

export default Ball;