class Paddle {
  constructor(side){
    this.width = 30;
    this.height = 120;
    this.y = height/2;
    if(side === 'LEFT'){
      this.x = this.width;
    }
    else if(side === 'RIGHT'){
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