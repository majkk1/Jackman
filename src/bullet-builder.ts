import * as ECS from '../libs/pixi-ecs';
import { TEXTURE_SCALE } from './constants/constants'
import { Assets, Direction, Tags } from './constants/enums'
import { BulletController } from './bullet-controller';

export class BulletBuilder {
    direction: Direction;
    owner: ECS.Container;
    scene: ECS.Scene;

    constructor(direction: Direction, owner: ECS.Container, scene: ECS.Scene) {
        this.direction = direction;
        this.owner = owner;
        this.scene = scene;
    }

    build() {
        let texture = PIXI.Texture.from(Assets.SPRITESHEET);
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(64, 0, 16, 8);

        let controller = new BulletController(this.direction);

        new ECS.Builder(this.scene)
            .anchor(0.5)
            .localPos(this.owner.x + this.owner.width / 2, this.owner.y + this.owner.height / 2)
            .withTag(Tags.BULLET)
            .asSprite(texture)
            .withParent(this.owner.scene.stage)
            .withComponent(controller)
            .scale(TEXTURE_SCALE)
            .build();
    }
}