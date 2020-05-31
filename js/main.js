'use strict'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var width = canvas.width = 640;
var height = canvas.height = 640;

// for smartphone screen
const scale = resizeCanvas();
console.log(scale, canvas.width, canvas.height);
console.log(window.innerWidth, window.innerHeight);


const FPS = 30;
const FRAME_TIME = 1000 / FPS;

var time = 0; // loop start timestamp

// load game json file
var levelParser = new LevelParser();

// 
var textureManager = new TextureManager();
var collisionManager = new CollisionManager();
var soundManager = new SoundManager();

//
var inputHandler = new InputHandler();
document.addEventListener("keydown", inputHandler.keyDownHandler, false);
// document.addEventListener("keyup", inputHandler.keyUpHandler, false);
document.addEventListener("pointerdown", inputHandler.mouseDownHandler, false);
// document.addEventListener("pointerup", inputHandler.mouseUpHandler, false);
// window.addEventListener("orientationchange", onRotate, false);

//create game object factory and register game object types
var gameObjectFactory = new GameObjectFactory();
gameObjectFactory.registerObject("player", Player);
gameObjectFactory.registerObject("booster", Booster);
gameObjectFactory.registerObject("heart", Heart);
gameObjectFactory.registerObject("spider", Spider);
gameObjectFactory.registerObject("button", Button);
gameObjectFactory.registerObject("play-background", PlayBackground);
gameObjectFactory.registerObject("background", Background);

//create finite state machine and register states
var gameStateMachine = new GameStateMachine();
gameStateMachine.registerState(StateID.Loading, new LoadingState());
gameStateMachine.registerState(StateID.Menu, new MenuState());
gameStateMachine.registerState(StateID.Play, new PlayState());
// gameStateMachine.registerState(StateID.Pause, new PauseState());
// gameStateMachine.registerState(StateID.Gameover, new GameoverState());
gameStateMachine.requestStackPush(StateID.Loading);


// main loop  
function loop() {
  time = performance.now();

  clearCanvas();
  
  // getInput(); input events get processed by document  
  gameStateMachine.updateCurrentState();
  gameStateMachine.drawCurrentState();

  // requestAnimationFrame(loop);
}

// loop(); // start loop

setInterval(loop, FRAME_TIME);