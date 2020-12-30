import * as ECS from '../libs/pixi-ecs';
import { CAMERA_X_BORDER, CAMERA_Y_BORDER } from './constants';

export class Camera extends ECS.Component {

    screenHeight: number;
    screenWidth: number;

    onInit() {
        this.screenHeight = this.scene.height;
        this.screenWidth = this.scene.width;
    }

    onUpdate() {
        const player = this.owner;
        const map = this.owner.parent;

        // is player next to the border of screen?
        let relPosX = player.x + map.x;
        let relPosY = player.y + map.y;

        // x-axis
        if (relPosX < CAMERA_X_BORDER && map.x < 0) {
            //move left
            let changeX = CAMERA_X_BORDER - relPosX;
            map.x += changeX;
        }
        else if (relPosX + player.width > this.screenWidth - CAMERA_X_BORDER && map.x > this.screenWidth - this.scene.stage.width) {
            //move right
            let changeX = this.screenWidth - CAMERA_X_BORDER - relPosX - player.width;
            map.x += changeX;
        }

        // y-axis
        if (relPosY < CAMERA_Y_BORDER && map.y < 0) {
           //move down
           let changeY = CAMERA_Y_BORDER - relPosY;
           map.y += changeY;
        }
        else if (relPosY + player.width > this.screenHeight - CAMERA_Y_BORDER && map.y > this.screenHeight - this.scene.stage.height) {
            //move up
            let changeY = this.screenHeight - CAMERA_Y_BORDER - relPosY - player.width;
            map.y += changeY;
        }

    }

}
