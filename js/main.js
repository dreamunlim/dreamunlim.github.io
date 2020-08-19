'use strict'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// canvas dimensions before resize
// crucial to keep to get proper player-enemy collision
// since enemy y position was automatically rescaled
// if collision was checked against canvas resized height
const width = 640;
const height = 640;

var scale = resizeCanvas();

const FPS = 30;
const FRAME_TIME = 1000 / FPS;

var time = 0; // loop start timestamp

//
var levelParser = new LevelParser();
var textureManager = new TextureManager();
var collisionManager = new CollisionManager();
var soundManager = new SoundManager();

//
var inputHandler = new InputHandler();
document.addEventListener("keydown", inputHandler.keyDownHandler, false);
document.addEventListener("keyup", inputHandler.keyUpHandler, false);
canvas.addEventListener("pointerdown", inputHandler.mouseDownHandler, false);
document.addEventListener("pointerdown", inputHandler.documentMouseDownHandler, false);
// document.addEventListener("pointerup", inputHandler.mouseUpHandler, false);
document.addEventListener("visibilitychange", onVisibilityChange, false);
window.addEventListener('resize', onResize, false);
window.addEventListener('storage', onStorageChange, false);

//create game object factory and register game object types
var gameObjectFactory = new GameObjectFactory();
gameObjectFactory.registerObject("player", Player);
gameObjectFactory.registerObject("booster", Booster);
gameObjectFactory.registerObject("heart", Heart);
gameObjectFactory.registerObject("spider", Spider);
gameObjectFactory.registerObject("button", Button);
gameObjectFactory.registerObject("play-background", PlayBackground);
gameObjectFactory.registerObject("background", Background);
gameObjectFactory.registerObject("counter", Counter);
gameObjectFactory.registerObject("star", Star);

//create finite state machine and register states
var gameStateMachine = new GameStateMachine();
gameStateMachine.registerState(StateID.Loading, new LoadingState());
gameStateMachine.registerState(StateID.Menu, new MenuState());
gameStateMachine.registerState(StateID.Play, new PlayState());
gameStateMachine.registerState(StateID.Pause, new PauseState());
gameStateMachine.registerState(StateID.Gameover, new GameoverState());
gameStateMachine.requestStackPush(StateID.Loading);


// main loop  
function loop() {
  time = performance.now();

  try {
    // getInput(); input events get processed by document  
    gameStateMachine.updateCurrentState();
    gameStateMachine.drawCurrentState();
  } catch (error) {
    console.error(error);
  }

  // requestAnimationFrame(loop);
}

// loop(); // start loop

// load game json file and start main loop
var gameJson = {};
parseJson("json/initAll.json");