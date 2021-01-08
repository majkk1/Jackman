import * as ECS from '../../libs/pixi-ecs';
import { ASSET_RES, INFOBOX_TIMER } from '../constants/constants';
import { Assets, Messages } from '../constants/enums'

/**
 * This class should be assigned to Infobox sprite, when player is in collision with infobox.
 * It prints the text of the infobox.
 */
export class InfoboxController extends ECS.Component {

    text: ECS.BitmapText;
    startTime: number;

    onInit() {
        this.subscribe(Messages.REMOVE_INFOBOX);
        this.subscribe(Messages.RESET_INFOBOX);

        //print infobox text
        this.text = new ECS.BitmapText('infobox bitmaptext', this.owner.asSprite().name, Assets.FONT, 0.5, 0xFFFFFF);
        this.text.scale.set(ASSET_RES);
        this.text.x = this.owner.x;
        this.text.y = this.owner.y - ASSET_RES;
        this.text.anchor = 0.5;
        this.text.zIndex = 20;

        this.owner.addChild(this.text);
    }

    onMessage(msg: ECS.Message) {
        if (msg.data === this.id) {
            if (msg.action == Messages.REMOVE_INFOBOX) {
                this.startTime = Date.now();
            }
            else if (msg.action == Messages.RESET_INFOBOX) {
                this.startTime = undefined;
            }
        }
    }

    onUpdate() {
        if (this.startTime !== undefined) {
            const time = Date.now();
            if (time - this.startTime > INFOBOX_TIMER) {
                this.text.destroy();
                this.finish();
            }
        }
    }
}