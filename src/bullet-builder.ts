import * as ECS from '../libs/pixi-ecs';
import { TEXTURE_SCALE } from './constants/constants'
import { Assets, Direction, Tags } from './constants/enums'
import { BulletController } from './bullet-controller';

export class BulletBuilder {
    direction: Direction;
    player: ECS.Container;
    scene: ECS.Scene;

    constructor(direction: Direction, player: ECS.Container, scene: ECS.Scene) {
        this.direction = direction;
        this.player = player;
        this.scene = scene;
    }

    build() {
        let texture = PIXI.Texture.from(Assets.SPRITESHEET);
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(64, 0, 16, 8);

        let controller = new BulletController(this.direction);

        new ECS.Builder(this.scene)
            .anchor(0.5)
            .localPos(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2)
            .withTag(Tags.BULLET)
            .asSprite(texture)
            .withParent(<ECS.Container>this.player.parent)
            .withComponent(controller)
            .scale(TEXTURE_SCALE)
            .build();
    }
}