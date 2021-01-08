export enum Assets {
    SPRITESHEET = 'spritesheet',
    LEVELS = 'levels',
    LEVEL_BACKGROUND = 'level background',
    FONT = 'Early GameBoy'
}

export enum Attribute {
    DIRECTION = 'direction',
    PLAYER_STATE = "player state"
}

export enum BlockType {
    EMPTY = 'EMPTY',
    WALL = 'WALL',
    PLAYER = 'PLAYER',
    MONSTER = 'MONSTER',
    HEALTH_COIN = 'HEALTH_COIN',
    COIN = 'COIN',
    FLY = 'FLY',
    DOUBLE_JUMP = 'DOUBLE_JUMP',
    GUN = 'GUN',
    BLUE_GATE = 'BLUE_GATE',
    GREEN_GATE = 'GREEN_GATE',
    BLUE_KEY = 'BLUE_KEY',
    GREEN_KEY = 'GREEN_KEY',
    EXIT_DOOR = 'EXIT_DOOR',
    INFO = "INFO",
    INFO0 = 'INFO0',
    INFO1 = 'INFO1',
    INFO2 = 'INFO2',
    INFO3 = 'INFO3',
    INFO4 = 'INFO4',
    INFO5 = 'INFO5',
    INFO6 = 'INFO6',
    INFO7 = 'INFO7',
    INFO8 = 'INFO8',
    INFO9 = 'INFO9',
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
    ITEMBAR = 'Itembar',
    INFOBOX = "Infobox",
    LEVEL_NAME = "Level Name Layer"
}


export enum Messages {
	NEW_GAME = "New game",
	RUN_LEVEL = "Run level",
	RESTART_LEVEL = 'Restart level',
	LEVEL_DONE = 'Level done',
	GAME_RESET = "Game reset",

	HEALTH_ADD = 'Health add',
	HEALTH_REMOVE = 'Health remove',
	HEALTH_SET = 'Health set',
	COIN_ADD = 'coin add',
	COIN_SET = 'coin set',

	GUN_TAKE = 'gun take',
	AMMO_SET = 'ammo set',
	GUN_FIRE = 'gun fire',
	GUN_DROP = 'gun drop',

	PLAYER_DEAD = 'Player dead',
	KEY_TAKE = 'key take',
	KEY_USE = 'key use',

	ITEM_ADD = 'item add',

	REMOVE_INFOBOX = 'remove infobox',
	RESET_INFOBOX = "RESET_INFOBOX",
	DOUBLE_JUMP_ENABLED = "DOUBLE_JUMP_ENABLED",
	FLY_ENABLED = "FLY_ENABLED"
}

export enum PlayerMoveState {
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
    FLY = 'fly',
    DOUBLE_JUMP = 'double jump',
    FLY_ENABLED = 'fly',
    GUN = 'gun',
    KEY = 'key',
    GATE = 'gate',
    BLUE = 'blue',
    GREEN = 'green',
    EXIT_DOOR = 'exit_door',
    INFO = "info"
}