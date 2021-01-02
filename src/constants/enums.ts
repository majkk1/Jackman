export enum Assets {
    SPRITESHEET = 'spritesheet',
    LEVELS = 'levels'
}

export enum Attribute {
    DIRECTION = 'direction'
}

export enum BlockType {
    PLAYER, EMPTY, WALL, MONSTER
}

export enum Direction {
    LEFT = 'left',
    RIGHT = 'right'
}

export enum GlobalAttribute {
    LEVEL = 'level'
}

export enum Layer {
    MAP_LAYER = 'MapLayer',
    STATUSBAR = 'Statusbar',
    HEALTHBAR = 'Healthbar'
}

export enum Messages {
    RESTART_LEVEL = 'Restart level',

    HEALTH_INIT = 'Health init',
    HEALTH_ADD = 'Health add',
    HEALTH_REMOVE = 'Health remove',

    PLAYER_DEAD = 'Player dead',
}

export enum PlayerState {
    STAND = 'STAND',
    WALK = 'WALK',
    JUMP = 'JUMP',
}

export enum Tags {
    PLAYER = 'player',
    MONSTER = 'monster',
    GROUND = 'ground',
    BULLET = 'bullet'
}