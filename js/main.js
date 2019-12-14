'use strict'

console.log("Hello, Stanislav :)");

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var width = canvas.width = 640;
var height = canvas.height = 640;

// for smartphone screen
var scale = resize();
console.log(scale, canvas.width, canvas.height);
console.log(window.innerWidth, window.innerHeight);



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

//create InputHandler object
var inputHandler = new InputHandler();
document.addEventListener("keydown", inputHandler.keyDownHandler, false);
document.addEventListener("keyup", inputHandler.keyUpHandler, false);
document.addEventListener("pointerdown", inputHandler.mouseDownHandler, false);
// document.addEventListener("pointerup", inputHandler.mouseUpHandler, false);
// window.addEventListener("orientationchange", onRotate, false);

//create game object factory and register game object types
var gameObjectFactory = new GameObjectFactory();
gameObjectFactory.registerObject("player", new Player());

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