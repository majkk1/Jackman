import * as ECS from '../../libs/pixi-ecs';
import { Layer, Messages } from '../constants/enums'
import { HealthbarController } from './healthbar-controller'
import { CoinbarController } from './coinbar-controller'
import { AmmobarController } from './ammobar-controller'
import { ItembarController } from './itembar-controller'

/**
 * This component holds information about different parts of statusbar - healthbar, coinbar etc.
 */
export class StatusbarController extends ECS.Component {
    healthbar: ECS.Container;
    coinbar: ECS.Container;
    itembar: ECS.Container;
    ammobar: ECS.Container = null;

    onInit() {
        this.healthbar = new ECS.Container(Layer.HEALTHBAR);
        this.healthbar.addComponent(new HealthbarController());
        this.owner.addChild(this.healthbar);

        this.coinbar = new ECS.Container(Layer.COINBAR);
        this.coinbar.addComponent(new CoinbarController());
        this.owner.addChild(this.coinbar);

        this.itembar = new ECS.Container(Layer.ITEMBAR);
        this.itembar.addComponent(new ItembarController());
        this.owner.addChild(this.itembar);

        this.subscribe(Messages.GUN_TAKE);
        this.subscribe(Messages.PLAYER_DEAD);
    }

    onMessage(msg: ECS.Message) {
        switch (msg.action) {
            case Messages.GUN_TAKE:
                if (this.ammobar === null) {
                    this.ammobar = new ECS.Container(Layer.AMMOBAR);
                    this.ammobar.addComponent(new AmmobarController());
                    this.owner.addChild(this.ammobar);
                }
                break;

            case Messages.PLAYER_DEAD:
                if (this.ammobar !== null) {
                    this.ammobar.destroy();
                    this.ammobar = null;
                }
                break;
        }
    }
} 