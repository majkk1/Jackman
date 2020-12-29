import * as ECS from '../libs/pixi-ecs';
import { CAMERA_X_BORDER, CAMERA_Y_BORDER } from './constants';

export class Camera extends ECS.Component {

    height: number;
    width: number;

    playerOldX: number;
    playerOldY: number;

    onInit() {
        this.height = this.scene.height;
        this.width = this.scene.width;
    }

    onUpdate() {
        const player = this.owner;

        // is player next to border of screen?
        let relPosX = this.owner.x + this.owner.parent.x;
        let relPosY = this.owner.y + this.owner.parent.y;

        // x-axis
        if (relPosX < CAMERA_X_BORDER && this.owner.parent.x < 0) {
            //move left
            let changeX = CAMERA_X_BORDER - relPosX;
            this.owner.parent.x += changeX;
        }
        else if (relPosX > this.width - CAMERA_X_BORDER && this.owner.parent.x > this.width - this.scene.stage.width) {
            //move right
            let changeX = this.width - CAMERA_X_BORDER - relPosX;
            this.owner.parent.x += changeX;
        }

        // y-axis
        if (relPosY < CAMERA_Y_BORDER && this.owner.parent.y < 0) {
           //move down
           let changeY = CAMERA_Y_BORDER - relPosY;
           this.owner.parent.y += changeY;
        }
        else if (relPosY > this.height - CAMERA_Y_BORDER && this.owner.parent.y > this.height - this.scene.stage.height) {
            //move up
            let changeY = this.height - CAMERA_Y_BORDER - relPosY;
            this.owner.parent.y += changeY;
        }

    }

}
