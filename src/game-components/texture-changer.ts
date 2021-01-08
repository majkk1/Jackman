import * as ECS from '../../libs/pixi-ecs';
import { Attribute, Direction } from '../constants/enums';

/**
 * This component is assigned to the player and monsters. It changes (flips) their textures when they change direction.
 */
export class TextureChanger extends ECS.Component {

    direction: Direction;
    leftTexture: PIXI.Texture;
    rightTexture: PIXI.Texture;

    onInit() {
        this.direction = this.owner.getAttribute(Attribute.DIRECTION);

        this.leftTexture = this.owner.asSprite().texture;
        this.rightTexture = new PIXI.Texture(this.leftTexture.baseTexture, this.leftTexture.frame, null, null, 12);

        if (this.direction == Direction.RIGHT) {
            this.owner.asSprite().texture = this.rightTexture;
        }
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
            this.owner.asSprite().texture = this.leftTexture;
        }
        else if (this.direction === Direction.RIGHT) {
            this.owner.asSprite().texture = this.rightTexture;
        }

        //flip also child objects (e.g. gun)
        for (let child of this.owner.children) {
            child.scale.x *= -1;
        }
    }
}