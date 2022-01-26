import { canvas, canvasScaler } from "./canvas.js";

class CollisionManager {
    constructor() {

    }

    playerEnemyCollision(player, enemy) {
        var playerCircleCentreVec = player.position.add(player.collisionCircle);
        var enemyCircleCentreVec = enemy.position.add(enemy.collisionCircle);

        var distanceVec = enemyCircleCentreVec.subtract(playerCircleCentreVec);

        if ((player.collisionCircle.radius + enemy.collisionCircle.radius) > distanceVec.vecLength()) {
            return true;
        }

        return false;
    }

    mouseButtonCollision(mEvent, button) {
        var canvasPosX = (window.innerWidth - canvas.width) / 2;
        var canvasPosY = 0;

        if (mEvent.clientX - canvasPosX > button.position.x * canvasScaler &&
            mEvent.clientX - canvasPosX < (button.position.x + button.width) * canvasScaler &&
            mEvent.clientY - canvasPosY > button.position.y * canvasScaler &&
            mEvent.clientY - canvasPosY < (button.position.y + button.height) * canvasScaler) {
            return true;
        }

        return false;
    }
}

const collisionManager = new CollisionManager();

export { collisionManager };