'use strict'

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
        if (mEvent.offsetX/scale > button.position.x &&
            mEvent.offsetX/scale < button.position.x + button.width &&
            mEvent.offsetY/scale > button.position.y &&
            mEvent.offsetY/scale < button.position.y + button.height) {
            return true;
        }

        return false;
    }
}
