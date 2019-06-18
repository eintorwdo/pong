var leftPaddle;
var rightPaddle;
var ball;
var leftScore = 0;
var rightScore = 0;


function setup() {
  createCanvas(800, 600);
  leftPaddle = new Paddle(UP_ARROW,DOWN_ARROW,true);
  rightPaddle = new Paddle(87,83,false);
  ball = new Ball();
}

function draw() {
  background(220);
  
  stroke(100);
  for(i=0;i<15;i++){
    if(i%2 == 0){
      line(width/2, i*height/15, width/2, (i+1)*height/15);
    }
  }
  
  textSize(32);
  textAlign(LEFT);
  text(leftScore.toString(), 4*leftPaddle.width, 30);
  text(rightScore.toString(), width - 4*rightPaddle.width, 30);
  
  leftPaddle.update();
  rightPaddle.update();
  ball.hitRightPaddle(rightPaddle);
  ball.hitLeftPaddle(leftPaddle);
  
  if(ball.update() == -1){
    rightScore++;
    leftPaddle.reset();
    rightPaddle.reset();
  }
  if(ball.update() == 1){
    leftScore++;
    leftPaddle.reset();
    rightPaddle.reset();
  }
  
  leftPaddle.show();
  rightPaddle.show();
  ball.show();
}