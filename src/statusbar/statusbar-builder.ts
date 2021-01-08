import * as ECS from '../../libs/pixi-ecs';
import { Layer } from '../constants/enums'
import { StatusbarController } from './statusbar-controller'

/**
 * Helper class to build statusbar - layer with informations about game state (health, coins, ammo, items)
 */
export class StatusbarBuilder {
    build(scene: ECS.Scene) {
        let statusBar = new ECS.Builder(scene)
            .anchor(0, 0)
            .localPos(0.5, 0.5)
            .withName(Layer.STATUSBAR)
            .asContainer()
            .withParent(scene.stage)
            .withComponent(new StatusbarController())
            .build();

        statusBar.zIndex = 10; //to be on the top layer
    }
}