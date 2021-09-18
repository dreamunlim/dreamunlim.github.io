'use strict'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// canvas dimensions before resize
// crucial to keep to get proper player-enemy collision
// since enemy y position was automatically rescaled
// if collision was checked against canvas resized height
const canvasInitialWidth = 896;
const canvasInitialHeight = 640;

const FPS = 30;
const FRAME_TIME = 1000 / FPS;

var canvasScaler = 1;
var frameStartTime = 0;
var thisFrameTime = 0;
var prevframeStartTime = 0;
var prevFrameTime = 0;
var drawFrame = false;
var gameJson = {};

// singletons
const levelParser = new LevelParser();
const textureManager = new TextureManager();
const collisionManager = new CollisionManager();
const soundManager = new SoundManager();
const inputHandler = new InputHandler();
const gameObjectFactory = new GameObjectFactory();
const gameStateMachine = new GameStateMachine();

// event handlers
document.addEventListener("keydown", inputHandler.keyDownHandler, false);
document.addEventListener("keyup", inputHandler.keyUpHandler, false);
canvas.addEventListener("pointerdown", inputHandler.mouseDownHandler, false);
document.addEventListener("pointerdown", inputHandler.documentMouseDownHandler, false);
// document.addEventListener("pointerup", inputHandler.mouseUpHandler, false);
document.addEventListener("visibilitychange", onVisibilityChange, false);
window.addEventListener('resize', onResize, false);
window.addEventListener('storage', onStorageChange, false);
window.addEventListener('DOMContentLoaded', resizeCanvas, false);

// game object types
gameObjectFactory.registerObject("player", Player);
gameObjectFactory.registerObject("booster", Booster);
gameObjectFactory.registerObject("heart", Heart);
gameObjectFactory.registerObject("spider", Spider);
gameObjectFactory.registerObject("button", Button);
gameObjectFactory.registerObject("play-background", PlayBackground);
gameObjectFactory.registerObject("background", Background);
gameObjectFactory.registerObject("counter", Counter);
gameObjectFactory.registerObject("star", Star);
gameObjectFactory.registerObject("diamond", Diamond);

// finite state machine states
gameStateMachine.registerState(StateID.Loading, new LoadingState());
gameStateMachine.registerState(StateID.Menu, new MenuState());
gameStateMachine.registerState(StateID.Play, new PlayState());
gameStateMachine.registerState(StateID.Pause, new PauseState());
gameStateMachine.registerState(StateID.Gameover, new GameoverState());
gameStateMachine.requestStackPush(StateID.Loading);


// main loop
function loop(functionStartTime) {
  prevframeStartTime = frameStartTime;
  frameStartTime = functionStartTime; // supplied 'performance.now()'
  prevFrameTime = frameStartTime - prevframeStartTime;
  thisFrameTime = thisFrameTime + prevFrameTime; // remainder + estimated

  try {
    // update-draw at fixed timesteps
    while (thisFrameTime >= FRAME_TIME) {
      // getInput(); input events get processed by document
      gameStateMachine.updateCurrentState();

      thisFrameTime = thisFrameTime - FRAME_TIME;
      drawFrame = true;
    }
    if (drawFrame) {
      gameStateMachine.drawCurrentState();
      drawFrame = false;
    }

  } catch (error) {
    console.error(error);
  }

  requestAnimationFrame(loop);
}


// load game json file and start main loop
parseGameJson("json/initAll.json");