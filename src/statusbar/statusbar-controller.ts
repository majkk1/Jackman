import * as ECS from '../../libs/pixi-ecs';
import { Layer } from '../constants/enums'
import { HealthbarController } from './healthbar-controller'
import { CoinbarController } from './coinbar-controller'

export class StatusbarController extends ECS.Component {
    healthbar: ECS.Container;
    coinbar: ECS.Container;

    onInit() {
        this.healthbar = new ECS.Container(Layer.HEALTHBAR);
        this.healthbar.addComponent(new HealthbarController());
        this.owner.addChild(this.healthbar);


        this.coinbar = new ECS.Container(Layer.COINBAR);
        this.coinbar.addComponent(new CoinbarController());
        this.owner.addChild(this.coinbar);
    }
} 