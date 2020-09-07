import Paddle from './Paddle.js';
import Ball from './Ball.js';
import p5 from 'p5';
import $ from 'jquery';
import {WIDTH, HEIGHT, LEFT, RIGHT} from '../constants/constants.js';
require('./connection.js');

const containerElement = document.getElementById('canvas-wrapper');

const sketch = (p) => {
  window.p = p;
  let leftPaddle;
  let rightPaddle;
  let ball;
  let leftScore = 0;
  let rightScore = 0;
  
  p.setup = function(){
    p.createCanvas(WIDTH, HEIGHT);
    $('#wrapper').append('<div id="user-list-wrapper"></div>');
    $('#user-list-wrapper').append('<ul id="user-list"></ul>');
    $('#test').append('<div id="lower-wrapper"></div>')
    $('#lower-wrapper').append('<p id="ready-list">Players not ready: </p>');
    $('#button-wrp').append('<div id="chat-wrapper"></div>');
    $('#chat-wrapper').append('<ul id="chat"></ul>');
    $('#chat-wrapper').append('<input type="text" id="msg-box" placeholder="Send message...">');
    window.list = true;
    leftPaddle = new Paddle(LEFT);
    rightPaddle = new Paddle(RIGHT);
    ball = new Ball();
  };
  
  p.draw = function(){
  p.background(220);
    
    p.stroke(100);
    for(let i=0;i<15;i++){
      if(i%2 == 0){
        p.line(p.width/2, i*p.height/15, p.width/2, (i+1)*p.height/15);
      }
    }
    
    if(window.gameData){
      let gameData = window.gameData;
      p.textSize(32);
      p.textAlign(p.LEFT);
      p.text(gameData.leftScore.toString(), 4*leftPaddle.width, 30);
      p.text(gameData.rightScore.toString(), p.width - 4*rightPaddle.width, 30);
      leftPaddle.y = gameData.leftPaddle.y;
      rightPaddle.y = gameData.rightPaddle.y;
      ball.x = gameData.ball.x;
      ball.y = gameData.ball.y;
      leftScore = gameData.leftScore;
      rightScore = gameData.rightScore;
      ball.show();
      leftPaddle.show();
      rightPaddle.show();
    }
  };
}

new p5(sketch, containerElement);