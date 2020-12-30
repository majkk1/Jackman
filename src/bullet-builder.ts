import * as ECS from '../libs/pixi-ecs';
import { BulletController, Direction } from './bullet-controller';
import { Assets, Tags, TEXTURE_SCALE } from './constants'


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