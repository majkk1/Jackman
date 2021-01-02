import * as ECS from '../libs/pixi-ecs';
import { CAMERA_X_BORDER, CAMERA_Y_BORDER } from './constants/constants';
import { Layer } from './constants/enums';

export class Camera extends ECS.Component {

    screenHeight: number;
    screenWidth: number;

    levelHeight: number;
    levelWidth: number;

    onInit() {
        this.screenHeight = this.scene.height;
        this.screenWidth = this.scene.width;

        this.levelWidth = this.scene.stage.width;
        this.levelHeight = this.scene.stage.height;
    }

    onUpdate() {
        const player = this.owner;
        const mapOffset = this.scene.stage.getChildByName(Layer.MAP_LAYER);

        // move camera with player if he is next to the border of screen
        let relPosX = player.x + mapOffset.x;
        let relPosY = player.y + mapOffset.y;

        // x-axis
        if (relPosX < CAMERA_X_BORDER) {
            //move left
            let changeX = CAMERA_X_BORDER - relPosX;
            mapOffset.x += changeX;
        }
        else if (relPosX + player.width > this.screenWidth - CAMERA_X_BORDER) {
            //move right
            let changeX = this.screenWidth - CAMERA_X_BORDER - relPosX - player.width;
            mapOffset.x += changeX;
        }

        // y-axis
        if (relPosY < CAMERA_Y_BORDER) {
            //move down
            let changeY = CAMERA_Y_BORDER - relPosY;
            mapOffset.y += changeY;
        }
        else if (relPosY + player.width > this.screenHeight - CAMERA_Y_BORDER) {
            //move up
            let changeY = this.screenHeight - CAMERA_Y_BORDER - relPosY - player.width;
            mapOffset.y += changeY;
        }

        //edge cases
        if (mapOffset.x > 0) {
            mapOffset.x = 0;
        }
        if (mapOffset.x < this.screenWidth - this.levelWidth) {
            mapOffset.x = this.screenWidth - this.levelWidth;
        }

        if (mapOffset.y > 0) {
            mapOffset.y = 0;
        }
        if (mapOffset.y < this.screenHeight - this.levelHeight) {
            mapOffset.y = this.screenHeight - this.levelHeight;
        }
    }
}