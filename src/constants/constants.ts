import { BlockType } from './enums'

export const SCENE_WIDTH = 25;
export const ASSET_RES = 32; // 32x32 px
export const TEXTURE_SCALE = 1 / ASSET_RES;
export const DELTA_MUL = 0.01;

//Decoding table for level file
export const decodeLevelChar = {
    'P': BlockType.PLAYER,
    ' ': BlockType.EMPTY,
    '.': BlockType.EMPTY,
    '#': BlockType.WALL,
    'M': BlockType.MONSTER,
    'h': BlockType.HEALTH_COIN,
    'c': BlockType.COIN,
    'f': BlockType.FLY,
    'd': BlockType.DOUBLE_JUMP,
    'g': BlockType.GUN,
    'Z': BlockType.BLUE_GATE,
    'z': BlockType.BLUE_KEY,
    'X': BlockType.GREEN_GATE,
    'x': BlockType.GREEN_KEY,
    '@': BlockType.EXIT_DOOR,
    '0': BlockType.INFO0,
    '1': BlockType.INFO1,
    '2': BlockType.INFO2,
    '3': BlockType.INFO3,
    '4': BlockType.INFO4,
    '5': BlockType.INFO5,
    '6': BlockType.INFO6,
    '7': BlockType.INFO7,
    '8': BlockType.INFO8,
    '9': BlockType.INFO9,
}

//player-state-updater.ts
export const GUN_AMMO_CAPACITY = 7;

//player-collision.ts
export const PLAYER_IMMORTALITY_TIME = 1000; //in ms

//player-controller.ts
export const GRAVITY = 0.5;
export const PLAYER_WALK_SPEED = 0.8;
export const PLAYER_JUMP_SIZE = 0.5;
export const JUMP_TRESHOLD = 3.5;
export const INIT_HEALTH = 3;

//monster-controller.ts
export const MONSTER_WALK_SPEED = 0.2;

//camera.ts
export const CAMERA_X_BORDER = 9;
export const CAMERA_Y_BORDER = 8;

// statusbar/healthbar-controller.ts
export const HEALTH_LIMIT = 10;

export const INFOBOX_TIMER = 2000;