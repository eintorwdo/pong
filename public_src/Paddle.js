class Paddle {
  constructor(side){
    this.width = 30;
    this.height = 120;
    this.y = window.p.height/2;
    if(side === 'LEFT'){
      this.x = this.width;
    }
    else if(side === 'RIGHT'){
      this.x = window.p.width - this.width;
    }
    this.hitMargin = 5;
  }
  
  show(){
    window.p.rectMode(window.p.CENTER);
    window.p.fill(100);
    window.p.rect(this.x, this.y, this.width, this.height);
  }
}

export default Paddle;