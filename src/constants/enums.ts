export enum Assets {
    SPRITESHEET = 'spritesheet',
    LEVELS = 'levels',
    FONT = 'Early GameBoy'
}


export enum Attribute {
    DIRECTION = 'direction',
    PLAYER_STATE = "player state"
}

export enum BlockType {
    EMPTY, WALL,
    PLAYER, MONSTER,
    HEALTH_COIN, COIN, GUN,
    BLUE_GATE, GREEN_GATE, BLUE_KEY, GREEN_KEY
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
    AMMOBAR = 'Ammobar',
    KEYBAR = 'Keybar',
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
    KEY_TAKE = 'key take',
    KEY_USE = 'key use',
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
    GUN = 'gun',
    KEY = 'key',
    GATE = 'gate',
    BLUE = 'blue',
    GREEN = 'green',
}