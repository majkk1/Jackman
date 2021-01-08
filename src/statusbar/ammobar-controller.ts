import * as ECS from '../../libs/pixi-ecs';
import { Assets, Messages } from '../constants/enums'

/**
 * This component shows information about ammo in left bottom corner
 */
export class AmmobarController extends ECS.Component {

    ammo: number = 0;
    text: ECS.BitmapText = null;

    onInit() {
        this.subscribe(Messages.AMMO_SET);
    }

    onMessage(msg: ECS.Message) {
        switch (msg.action) {
            case Messages.AMMO_SET:
                this.ammo = msg.data;
                break;
        }
        this.updateBar();
    }

    private updateBar() {
        if (this.text !== null) {
            this.text.destroy();
        }
        this.text = new ECS.BitmapText('ammobar', 'ammo:' + this.ammo, Assets.FONT, 1, 0xFFFF00);
        this.text.position.set(0.25, this.scene.height - 2);
        this.owner.addChild(this.text);
    }
}