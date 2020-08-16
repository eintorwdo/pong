let leftPaddle;
let rightPaddle;
let ball;
let leftScore = 0;
let rightScore = 0;

function setup() {
  var cnv = createCanvas(800, 600);
  cnv.parent('canvas-wrapper');
  $('#wrapper').append('<div id="user-list-wrapper"></div>');
  $('#user-list-wrapper').append('<ul id="user-list"></ul>');
  $('#test').append('<div id="lower-wrapper"></div>')
  $('#lower-wrapper').append('<p id="ready-list">Players not ready: </p>');
  $('#button-wrp').append('<div id="chat-wrapper"></div>');
  $('#chat-wrapper').append('<ul id="chat"></ul>');
  $('#chat-wrapper').append('<input type="text" id="msg-box" placeholder="Send message...">');
  window.list = true;
  leftPaddle = new Paddle('LEFT');
  rightPaddle = new Paddle('RIGHT');
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
  
  // if(ball){
    if(window.gameData){
      textSize(32);
      textAlign(LEFT);
      text(window.gameData.leftScore.toString(), 4*leftPaddle.width, 30);
      text(window.gameData.rightScore.toString(), width - 4*rightPaddle.width, 30);
      leftPaddle.y = window.gameData.leftPaddle.y;
      rightPaddle.y = window.gameData.rightPaddle.y;
      ball.x = window.gameData.ball.x;
      ball.y = window.gameData.ball.y;
      leftScore = window.gameData.leftScore;
      rightScore = window.gameData.rightScore;
      ball.show();
      leftPaddle.show();
      rightPaddle.show();
    }
  // }
}