export const SCENE_WIDTH = 20;
export const TEXTURE_SCALE = SCENE_WIDTH / (32 * 20);

export enum Assets {
    SPRITESHEET = 'spritesheet',
    LEVELS = 'levels'
}

export enum BlockType {
    EMPTY, WALL
}

export enum GlobalAttribute{
    PLATFORM_MAP= 'platformMap'
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
