import * as ECS from '../libs/pixi-ecs';
import { ASSET_RES } from './constants/constants';
import { Assets, Attribute, Direction } from './constants/enums';

export class TextureChanger extends ECS.Component {

    readonly offsetX: number;
    readonly offsetY: number;

    direction: Direction;

    constructor(offsetX: number, offsetY: number) {
        super();

        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    onInit() {
        this.direction = this.owner.getAttribute(Attribute.DIRECTION);
    }

    onUpdate() {
        let lastDirection = this.direction;
        this.direction = this.owner.getAttribute(Attribute.DIRECTION);

        if (lastDirection !== this.direction) {
            this.updateGraphics();
        }

    }

    private updateGraphics() {
        if (this.direction === Direction.LEFT) {
            this.owner.asSprite().texture = this.createTexture(this.offsetX, this.offsetY);
        }
        else if (this.direction === Direction.RIGHT) {
            this.owner.asSprite().texture = this.createTexture(this.offsetX + ASSET_RES, this.offsetY);
        }
    }

    private createTexture(offsetX: number, offsetY: number) {
        let texture = PIXI.Texture.from(Assets.SPRITESHEET);
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(offsetX, offsetY, ASSET_RES, ASSET_RES);

        return texture;
    }
}