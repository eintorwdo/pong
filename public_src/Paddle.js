import {LEFT, RIGHT} from '../constants/constants.js';

class Paddle {
  constructor(side){
    this.width = 30;
    this.height = 120;
    this.y = window.p.height/2;
    if(side.toLowerCase() === LEFT){
      this.x = this.width;
    }
    else if(side.toLowerCase() === RIGHT){
      this.x = window.p.width - this.width;
    }
    this.hitMargin = 5;
  }
  
  show(){
    const p5Sketch = window.p;
    p5Sketch.rectMode(p5Sketch.CENTER);
    p5Sketch.fill(100);
    p5Sketch.rect(this.x, this.y, this.width, this.height);
  }
}

export default Paddle;