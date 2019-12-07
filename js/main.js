'use strict'

console.log("Hello, Stanislav :)");

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = 720;
const height = canvas.height = window.innerHeight;

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// var player = new Image();
// player.src = 'img/player.png';
// player.onload = function() {
//ctx.drawImage(player, 200, 200, 80, 45);}


// function draw() {
//     ctx.beginPath(); // draw a shape on the paper
//     ctx.fillStyle = this.color; // what color we want the shape to be 
//     ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // draw contour arc
//     ctx.fill(); // finish drawing the path we started with beginPath(), and fill the area it takes up with the color we specified earlier in fillStyle
// }

// create game objects
// var gameJson = parseJson("json/initAll.json");
// console.log(gameJson); // undefined.. 
// parseObjects(gameJson);
parseJson("json/initAll.json");


var player;


const FPS = 10;
const FRAME_TIME = 1000 / FPS;

//create TextureManager object
var textureManager = new TextureManager();
// textureManager.storeTexture("img/player.png", "player");

//create InputHandler object
var inputHandler = new InputHandler();
document.addEventListener("keydown", inputHandler.keyDownHandler, false);
document.addEventListener("keyup", inputHandler.keyUpHandler, false);


//create game object factory and register game object types
// GameObjectFactory::getpGameObjectFactory();

//create finite state machine
// pGameStateMachine = new GameStateMachine();


// main loop  
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // 0.5 to create trail effect
  ctx.fillRect(0, 0, width, height);
  // ctx.clearRect(0, 0, width, height);
  
  // Object.getPrototypeOf(x);
  // console.log(new Foo() instanceof Foo); // false


  // getInput(); input events get processed by document  
  // update();
  // render();
  player.updateObject();
  player.drawObject();
  

  // requestAnimationFrame(loop);
}

// loop(); // start loop

setInterval(loop, FRAME_TIME);

console.log("MAIN.JS_BOTTOM");