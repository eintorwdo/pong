var leftPaddle;
var rightPaddle;
var ball;
var leftScore = 0;
var rightScore = 0;



function setup() {
  createCanvas(800, 600);
  $('body').append('<ul id="user-list"></ul>');
  window.list = true;
  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
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
  
  if(ball){
    // textSize(32);
    // textAlign(LEFT);
    // text(leftScore.toString(), 4*leftPaddle.width, 30);
    // text(rightScore.toString(), width - 4*rightPaddle.width, 30);
    
    // ball.hitRightPaddle(rightPaddle);
    // ball.hitLeftPaddle(leftPaddle);
    
    // if(ball.update() == -1){
      // rightScore++;
      // leftPaddle.reset();
      // rightPaddle.reset();
      // ball.reset();
    // }
    // if(ball.update() == 1){
      // leftScore++;
      // leftPaddle.reset();
      // rightPaddle.reset();
      // ball.reset();
    // }
    
    // leftPaddle.show();
    // rightPaddle.show();

    if(window.gameData){
      textSize(32);
      textAlign(LEFT);
      text(window.gameData.leftScore.toString(), 4*leftPaddle.width, 30);
      text(window.gameData.rightScore.toString(), width - 4*rightPaddle.width, 30);
      leftPaddle.y = window.gameData.leftPaddle.y;
      rightPaddle.y = window.gameData.rightPaddle.y;
      ball.x = window.gameData.x;
      ball.y = window.gameData.y;
      leftScore = window.gameData.leftScore;
      rightScore = window.gameData.rightScore;
      ball.show();
      leftPaddle.show();
      rightPaddle.show();
    }
  }
}