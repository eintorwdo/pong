var leftPaddle;
var rightPaddle;
var ball;

function setup() {
  createCanvas(800, 600);
  leftPaddle = new Paddle(UP_ARROW,DOWN_ARROW,true);
  rightPaddle = new Paddle(87,83,false);
  ball = new Ball();
}

function draw() {
  background(220);
  leftPaddle.update();
  rightPaddle.update();
  ball.hitRightPaddle(rightPaddle);
  ball.hitLeftPaddle(leftPaddle);
  if(ball.update() == -1){
    leftPaddle.reset();
    rightPaddle.reset();
  }
  leftPaddle.show();
  rightPaddle.show();
  ball.show();
}