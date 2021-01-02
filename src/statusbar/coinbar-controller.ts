import * as ECS from '../../libs/pixi-ecs';
import { Assets, Messages } from '../constants/enums'
import { ASSET_RES, HEALTH_LIMIT, TEXTURE_SCALE } from '../constants/constants'

export class CoinbarController extends ECS.Component {

    coins: number = 0;
    text: ECS.BitmapText = null;

    onInit() {
        this.subscribe(Messages.COIN_ADD);
        this.subscribe(Messages.COIN_SET);
    }

    onMessage(msg: ECS.Message) {
        switch (msg.action) {
            case Messages.COIN_ADD:
                this.coins++;
                break;

            case Messages.COIN_SET:
                this.coins = msg.data;
                break;
        }
        this.updateBar();
    }

    private updateBar() {
        if (this.text !== null) this.text.destroy();
        this.text = new ECS.BitmapText('coinbar', '(' + this.coins, Assets.FONT, 1, 0xFFFF00);
        this.text.position.set(0.25, 0);
        this.owner.addChild(this.text);
    }
}