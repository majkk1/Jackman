import * as ECS from '../../libs/pixi-ecs';
import { Layer } from '../constants/enums'
import { HealthbarController } from './healthbar-controller'

export class StatusbarController extends ECS.Component {
    healthbar: ECS.Container;

    onInit() {
        this.healthbar = new ECS.Container(Layer.HEALTHBAR);
        this.healthbar.addComponent(new HealthbarController());
        this.owner.addChild(this.healthbar);
    }
} 