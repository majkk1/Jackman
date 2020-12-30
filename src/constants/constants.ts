import {BlockType} from './enums'

export const SCENE_WIDTH = 25;
export const ASSET_RES = 32; // 32x32 px
export const TEXTURE_SCALE = 1 / ASSET_RES;
export const DELTA_MUL = 0.01;

//Decoding table for level file
export const decodeLevelChar = {
    'P': BlockType.PLAYER,
    '.': BlockType.EMPTY,
    '#': BlockType.WALL,
    'M': BlockType.MONSTER,
}

//player-controller.ts
export const GRAVITY = 0.5;
export const PLAYER_WALK_SPEED = 0.8;
export const PLAYER_JUMP_SIZE = 0.4;
export const JUMP_TRESHOLD = 350;

//monster-controller.ts
export const MONSTER_WALK_SPEED = 0.2;

//camera.ts
export const CAMERA_X_BORDER = 9;
export const CAMERA_Y_BORDER = 8;


export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
