import * as ECS from '../libs/pixi-ecs';

import { SCENE_WIDTH, Assets } from './constants'
import { Factory } from './factory'
import { LevelParser } from './level-parser'


// TODO rename your game
class MyGame {
	engine: ECS.Engine;

	constructor() {
		this.engine = new ECS.Engine();
		let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

		// init the game loop
		this.engine.init(canvas, {
			width: canvas.width,
			height: canvas.height,
			resolution: canvas.width / SCENE_WIDTH,
			resizeToScreen: true
		});

		this.engine.app.loader
			.reset()
			.add(Assets.SPRITESHEET, './assets/spritesheet.png')
			.add(Assets.LEVELS, './assets/levels.txt')
			.load(() => this.loadGame());
	}

	loadGame() {
		const levelData = this.engine.app.loader.resources[Assets.LEVELS].data;

		//parse level data
		const parser = new LevelParser();
		const levels = parser.parse(levelData);

		const factory = new Factory();
		factory.loadLevel(levels[0], this.engine.scene);
	}

}


// this will create a new instance as soon as this file is loaded
export default new MyGame();