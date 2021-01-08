import * as ECS from '../../libs/pixi-ecs';
import { BULLET_SPEED, DELTA_MUL } from '../constants/constants';
import { Tags, GlobalAttribute, Direction } from '../constants/enums';
import { Level } from '../level';

/**
 * Bullet controller. Moves bullet left or right and checks for collision
 */
export class BulletController extends ECS.Component {

    direction: Direction;
    level: Level;

    constructor(direction: Direction) {
        super();
        this.direction = direction;
    }

    onInit() {
        this.level = this.scene.getGlobalAttribute<Level>(GlobalAttribute.LEVEL);
    }

    onUpdate(delta: number, absolute: number) {
        let deltaMul = delta * DELTA_MUL;

        this.moveBullet(deltaMul);

        this.checkCollision();
    }

    private moveBullet(delta: number) {
        if (this.direction === Direction.LEFT) {
            this.owner.x -= BULLET_SPEED * delta;
        }
        if (this.direction === Direction.RIGHT) {
            this.owner.x += BULLET_SPEED * delta;
        }
    }

    private horizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
        return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
    }

    private verIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
        return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
    }

    private checkCollision() {
        //bullet can't be out of the map
        if (this.owner.x < 0 || this.owner.x > this.level.width) {
            this.owner.destroy();
            return;
        }

        let bulletBox = this.owner.getBounds().clone();
        let ground = this.scene.findObjectsByTag(Tags.GROUND);
        let monsters = this.scene.findObjectsByTag(Tags.MONSTER);

        let objects = [...ground, ...monsters];

        for (let colider of objects) {
            const cBox = colider.getBounds(); //get cbox of possible collider

            //is there a intersection?
            let horizIntersection = this.horizIntersection(bulletBox, cBox);
            let verIntersection = this.verIntersection(bulletBox, cBox);
            let collides = (horizIntersection > 0 && verIntersection > 0);

            if (collides) {
                this.owner.destroy(); //destory bullet

                if (colider.hasTag(Tags.MONSTER)) {
                    colider.destroy(); //destroy monster
                }
                return;
            }
        }
    }
}