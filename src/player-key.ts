import * as ECS from '../libs/pixi-ecs';
import { Attribute, Direction, Messages, GlobalAttribute, Tags } from './constants/enums'
import { Level } from './level';

export class PlayerKey extends ECS.Component {
    
    readonly color: Tags;
    keyInputCmp: ECS.KeyInputComponent;

    constructor(color: Tags){
        super();

        this.color = color;
    }

    onInit() {
        this.keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    }

    onUpdate() {
        //if shift is pushed -> TRY OPEN DOOR
        if (this.keyInputCmp.isKeyPressed(ECS.Keys.KEY_SHIFT)) {
            const direction = this.owner.getAttribute(Attribute.DIRECTION) as Direction;

            if (direction == Direction.LEFT) {
                let x = Math.floor(this.owner.x) - 1;
                let y = this.owner.y;

                this.checkForDoorTryOpen(x, Math.floor(y));
                this.checkForDoorTryOpen(x, Math.ceil(y));
            }
            else if (direction == Direction.RIGHT) {
                let x = Math.ceil(this.owner.x) + 1;
                let y = this.owner.y;

                this.checkForDoorTryOpen(x, Math.floor(y));
                this.checkForDoorTryOpen(x, Math.floor(y));
            }
        }
    }

    private checkForDoorTryOpen(x: number, y: number) {
        let map = this.scene.getGlobalAttribute<Level>(GlobalAttribute.LEVEL).map;
        let tile = map[y][x];

        if (tile !== null && tile.hasTag(Tags.GATE)) {
            if (tile.hasTag(this.color)) {
                tile.destroy();
                map[y][x] = null;
                this.sendMessage(Messages.KEY_USE,this.color);
                this.finish();
            }
        }
    }
}