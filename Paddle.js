class Paddle {
  
  constructor(left){
    if(left == true){
      this.left = true
      this.x = this.width
    }
    else{
      this.left = false
      this.x = width - this.width
    }
    this.y = height/2;
    this.paddleSpeed = 20;
    this.hitMargin = 15;
    this.height = 120;
  }
  
  reset(){
    this.y = height/2;
  }
  
  update(up, down){
    if(up){
      this.y = this.y - this.paddleSpeed;
      this.y = Math.min(Math.max(parseInt(this.y), this.height/2), height - this.height/2);
    }
    else if(down){
      this.y = this.y + this.paddleSpeed;
      this.y = Math.min(Math.max(parseInt(this.y), this.height/2), height - this.height/2);
    }
  }
}

module.exports = Paddle