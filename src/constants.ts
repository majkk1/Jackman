export const SCENE_WIDTH = 25;
export const ASSET_RES = 32; // 32x32 px
export const TEXTURE_SCALE = 1 / ASSET_RES;

//camera.ts
export const CAMERA_X_BORDER = 8;
export const CAMERA_Y_BORDER = 5;


export enum Assets {
    SPRITESHEET = 'spritesheet',
    LEVELS = 'levels'
}

export enum BlockType {
    EMPTY, WALL
}

export enum GlobalAttribute {
    PLATFORM_MAP = 'platformMap'
}

export enum Tags {
    PLAYER = 'player',
    GROUND = 'ground'
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
