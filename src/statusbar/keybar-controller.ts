import * as ECS from '../../libs/pixi-ecs';
import { ASSET_RES, TEXTURE_SCALE } from '../constants/constants';
import { Assets, Messages, Tags } from '../constants/enums'

export class KeybarController extends ECS.Component {

    keys: Map<Tags, ECS.Sprite>;
    firstColor: Tags;

    constructor(color: Tags) {
        super();
        this.keys = new Map();
        this.firstColor = color;
    }

    onInit() {
        this.subscribe(Messages.KEY_TAKE);
        this.subscribe(Messages.KEY_USE);

        //add first key
        this.addKey(this.firstColor);
    }

    onMessage(msg: ECS.Message) {
        switch (msg.action) {
            case Messages.KEY_TAKE:
                this.addKey(msg.data);
                break;

            case Messages.KEY_USE:
                this.removeKey(msg.data);
                break;
         }
    }

    private addKey(color: Tags) {
        let texture = PIXI.Texture.from(Assets.SPRITESHEET);
        texture = texture.clone();

        if (color === Tags.BLUE) {
            texture.frame = new PIXI.Rectangle(96, 64, ASSET_RES, ASSET_RES);
        }
        else if (color === Tags.GREEN) {
            texture.frame = new PIXI.Rectangle(128, 64, ASSET_RES, ASSET_RES);
        }
        else {
            throw Error(`Invalid color of key: ${color}`);
        }

        let keyCard = new ECS.Sprite('keyCard ' + color, texture);
        keyCard.scale.set(TEXTURE_SCALE * 1.25);
        keyCard.anchor.set(1, 1);
        keyCard.x = this.scene.width - this.keys.size - 1;
        keyCard.y = this.scene.height - 1;

        this.owner.addChild(keyCard);
        this.keys.set(color, keyCard);
    }

    private removeKey(color: Tags) {
        let sprite = this.keys.get(color);

        if (sprite !== null) {
            this.keys.delete(color);
            sprite.destroy();
            this.redrawKeys();
        }
    }

    private redrawKeys() {
        let i = 0;
        for (let [tag, sprite] of this.keys) {
            sprite.x = this.scene.width - i - 1;
            sprite.y = this.scene.height - 1;
            i++;
        }
    }
}