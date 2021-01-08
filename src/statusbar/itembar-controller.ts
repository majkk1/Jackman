import * as ECS from '../../libs/pixi-ecs';
import { TEXTURE_SCALE } from '../constants/constants';
import { Assets, Messages, Tags } from '../constants/enums'
import { SpritesheetInfo } from '../constants/spritesheet';

/**
 * This component shows information about taken items in right bottom corner
 */
export class ItembarController extends ECS.Component {

    items: Map<string, ECS.Sprite> = new Map();

    onInit() {
        this.subscribe(Messages.RUN_LEVEL);
        this.subscribe(Messages.FLY_ENABLED);
        this.subscribe(Messages.DOUBLE_JUMP_ENABLED);
        this.subscribe(Messages.KEY_TAKE);
        this.subscribe(Messages.KEY_USE)
    }

    onMessage(msg: ECS.Message) {
        switch (msg.action) {
            case Messages.DOUBLE_JUMP_ENABLED:
                this.addItem(Tags.DOUBLE_JUMP);
                break;

            case Messages.FLY_ENABLED:
                this.addItem(Tags.FLY);
                break;

            case Messages.KEY_TAKE:
                this.addItem(msg.data);
                break;

            case Messages.KEY_USE:
                //TODO
                this.removeItem(msg.data);
                break;

            case Messages.RUN_LEVEL:
                this.resetItems();
                break;
        }
    }

    private addItem(name: string) {
        let texture = PIXI.Texture.from(Assets.SPRITESHEET);
        texture = texture.clone();

        let icon;
        if (name === Tags.BLUE) {
            icon = SpritesheetInfo.BLUE_KEY_ICON;
        }
        else if (name === Tags.GREEN) {
            icon = SpritesheetInfo.GREEN_KEY_ICON;
        }
        else if (name === Tags.FLY) {
            icon = SpritesheetInfo.FLY;
        }
        else if (name === Tags.DOUBLE_JUMP) {
            icon = SpritesheetInfo.DOUBLE_JUMP;
        }
        else {
            throw Error(`Invalid name of item: ${name}`);
        }

        //create correct sprite
        texture.frame = new PIXI.Rectangle(icon.x, icon.y, icon.width, icon.height);
        let keyCard = new ECS.Sprite('item ' + name, texture);
        keyCard.scale.set(TEXTURE_SCALE * 1.25);
        keyCard.anchor.set(1, 1);
        keyCard.x = this.scene.width - this.items.size - 1;
        keyCard.y = this.scene.height - 1;

        this.owner.addChild(keyCard);
        this.items.set(name, keyCard);
    }

    private removeItem(name: string) {
        let sprite = this.items.get(name);

        if (sprite !== null) {
            this.items.delete(name);
            sprite.destroy();
            this.redrawItems();
        }
    }

    private redrawItems() {
        //after removed item, redraw items
        let i = 0;
        for (let [tag, sprite] of this.items) {
            sprite.x = this.scene.width - i - 1;
            sprite.y = this.scene.height - 1;
            i++;
        }
    }

    private resetItems() {
        this.items.forEach(key => {
            key.destroy();
        });

        this.items = new Map();
    }
}