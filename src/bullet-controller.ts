import * as ECS from '../libs/pixi-ecs';
import { DELTA_MUL, Tags, GlobalAttribute } from './constants';
import { Level } from './level';

export enum Direction {
    LEFT = 'left',
    RIGHT = 'right'
}

export class BulletController extends ECS.Component {

    direction: Direction;
    level: Level;

    readonly BULLET_SPEED = 3;

    constructor(direction: Direction) {
        super();

        this.direction = direction;
    }

    onInit() {
        console.log('projectile fired!', this.direction);
        this.level = this.scene.getGlobalAttribute<Level>(GlobalAttribute.LEVEL);
    }

    onUpdate(delta: number, absolute: number) {
        let deltaMul = delta * DELTA_MUL;

        this.moveBullet(deltaMul);

        this.checkCollision();
    }

    private moveBullet(delta: number) {
        if (this.direction === Direction.LEFT) {
            this.owner.x -= this.BULLET_SPEED * delta;
        }
        if (this.direction === Direction.RIGHT) {
            this.owner.x += this.BULLET_SPEED * delta;
        }
    }

    private horizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
        return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
    }

    private verIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
        return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
    }

    private checkCollision() {
        if (this.owner.x < 0 || this.owner.x > this.level.width) {
            this.owner.destroy(); //how to get map size?
            return;
        }

        let bulletBox = this.owner.getBounds().clone();
        let ground = this.scene.findObjectsByTag(Tags.GROUND);
        let monsters = this.scene.findObjectsByTag(Tags.MONSTER);

        let objects = [...ground, ...monsters];

        console.log(this.scene.stage.width);

        for (let colider of objects) {
            const cBox = colider.getBounds(); //get ground cbox

            //is there a intersection?
            let horizIntersection = this.horizIntersection(bulletBox, cBox);
            let verIntersection = this.verIntersection(bulletBox, cBox);
            let collides = (horizIntersection > 0 && verIntersection > 0);

            if (collides) {
                this.owner.destroy();
                return;
            }
        }

    }
}