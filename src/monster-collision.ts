import * as ECS from '../libs/pixi-ecs';
import { Messages, Tags } from './constants/enums'

export class MonsterCollision extends ECS.Component {

    lastCollision: number = 0;

    onUpdate(delta: number, absolute: number) {

        //don't detect collision for 1 sec after last detection
        if (this.lastCollision !== 0 && absolute - this.lastCollision > 1000) {
            this.lastCollision = 0;
        }

        if (this.lastCollision == 0) {
            if (this.collideWithPlayer()) {
                this.lastCollision = absolute;
            }
        }
    }

    private collideWithPlayer(): boolean {
        let monsterBox = this.owner.getBounds();
        let player = this.scene.findObjectByTag(Tags.PLAYER);
        let playerBox = player.getBounds();

        //check for collision with player
        let horizIntersection = this.horizIntersection(monsterBox, playerBox);
        let verIntersection = this.verIntersection(monsterBox, playerBox);
        let collides = (horizIntersection > 0 && verIntersection > 0);

        if (collides) {
            this.sendMessage(Messages.HEALTH_REMOVE);
            return true;
        }
        return false;
    }

    private horizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
        return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
    }

    private verIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
        return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
    }
}
