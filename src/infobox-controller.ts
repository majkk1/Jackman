import * as ECS from '../libs/pixi-ecs';
import { ASSET_RES, INFOBOX_TIMER } from './constants/constants';
import { Assets, Messages } from './constants/enums'

export class InfoboxController extends ECS.Component {

    infoSprite: ECS.Sprite;
    text: ECS.BitmapText;

    startTime: number;

    constructor(infoSprite: ECS.Sprite) {
        super();

        this.infoSprite = infoSprite;
    }

    onInit() {
        this.subscribe(Messages.REMOVE_INFOBOX);
        this.subscribe(Messages.RESET_INFOBOX);

        this.text = new ECS.BitmapText('infobox bitmaptext', this.infoSprite.name, Assets.FONT, 0.5, 0xFFFFFF);
        this.text.scale.set(ASSET_RES);
        this.text.anchor = 0.5;
        this.text.zIndex = 10;
        this.text.x = this.infoSprite.x;
        this.text.y = this.infoSprite.y - ASSET_RES * this.infoSprite.height;

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