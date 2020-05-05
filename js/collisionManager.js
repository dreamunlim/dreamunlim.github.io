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

    mouseUIButtonCollision(mEvent, button) {
        if (inputHandler.mouseLeftPressed) {
            if (mEvent.clientX > button.position.x &&
                mEvent.clientX < button.position.x + button.sWidth &&
                mEvent.clientY > button.position.y &&
                mEvent.clientY < button.position.y + button.dHeight) {
                    return true;
            }
        }

        return false;
    }
}
