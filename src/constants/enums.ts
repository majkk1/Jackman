export enum Assets {
    SPRITESHEET = 'spritesheet',
    LEVELS = 'levels',
    FONT = 'Early GameBoy'
}

export enum Attribute {
    DIRECTION = 'direction',
    HEALTH = 'health',
    COINS = 'coins',
    AMMO = 'ammo'
}

export enum BlockType {
    PLAYER, EMPTY, WALL, MONSTER, HEALTH_COIN, COIN, GUN
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
    HEALTHBAR = 'Healthbar',
    COINBAR = 'Coinbar',
    AMMOBAR = 'Ammobar'
}

export enum Messages {
    RESTART_LEVEL = 'Restart level',

    HEALTH_INIT = 'Health init',
    HEALTH_ADD = 'Health add',
    HEALTH_REMOVE = 'Health remove',
    COIN_ADD = 'coin add',
    COIN_SET = 'coin set',

    GUN_TAKE = 'gun take',
    AMMO_SET = 'ammo set',
    GUN_FIRE = 'gun fire',
    GUN_DROP = 'gun drop',

    PLAYER_DEAD = 'Player dead',
}

export enum PlayerState {
    STAND = 'STAND',
    WALK = 'WALK',
    JUMP = 'JUMP',
}

export enum Tags {
    GROUND = 'ground',
    MONSTER = 'monster',
    PLAYER = 'player',
    BULLET = 'bullet',
    POWERUP = 'powerup',
    HEALTH_COIN = 'health coin',
    COIN = 'coin',
    GUN = 'gun'
}