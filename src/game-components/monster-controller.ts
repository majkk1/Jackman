import * as ECS from '../../libs/pixi-ecs';
import { DELTA_MUL } from '../constants/constants'
import { Direction, Attribute, GlobalAttribute } from '../constants/enums'
import { Level } from '../level';
import { MONSTER_WALK_SPEED } from '../constants/constants'

/**
 * This component controlls movement of monster object.
 */
export class MonsterController extends ECS.Component {

    direction: Direction;

    onInit() {
        //set random direction
        let randomNumber = Math.floor(Math.random() * 2);

        if (randomNumber === 1) {
            this.direction = Direction.LEFT;
        }
        else {
            this.direction = Direction.RIGHT;
        }

        this.owner.assignAttribute(Attribute.DIRECTION, this.direction);
    }

    onUpdate(delta: number, absolute: number) {
        let deltaMul = delta * DELTA_MUL;

        //get direction of Monster
        this.direction = this.owner.getAttribute(Attribute.DIRECTION);

        //move monster
        this.moveMonster(deltaMul);

        //save direction of Monster
        this.owner.assignAttribute(Attribute.DIRECTION, this.direction);
    }

    private moveMonster(delta: number) {
        let x = this.owner.x;
        let y = this.owner.y;
        let map = (<Level>this.scene.getGlobalAttribute(GlobalAttribute.LEVEL)).map;

        if (this.direction == Direction.LEFT) {
            if (map[y][Math.floor(x)] == null && map[y + 1][Math.floor(x)] != null) {
                this.owner.x -= delta * MONSTER_WALK_SPEED;
            }
            else {
                this.direction = Direction.RIGHT;
            }
        }

        else if (this.direction == Direction.RIGHT) {
            if (map[y][Math.ceil(x)] == null && map[y + 1][Math.ceil(x)] != null) {
                this.owner.x += delta * MONSTER_WALK_SPEED;
            }
            else {
                this.direction = Direction.LEFT;
            }
        }
    }
}