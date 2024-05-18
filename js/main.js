import "./eventHandlers.js";
import { resizeViewport, parseGameJson } from "./auxiliary.js";
import { gameStateMachine } from "./gameStateMachine.js";

resizeViewport();

const FPS = 60;
const FRAME_TIME = 1000 / FPS;

var frameStartTime = 0;
var thisFrameTime = 0;
var prevframeStartTime = 0;
var prevFrameTime = 0;
var drawFrame = false;
var gameJson = {};

function setGameJson(json) {
  gameJson = json;
}

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

export {
  FPS, FRAME_TIME, frameStartTime, prevframeStartTime, gameJson, setGameJson, loop
};