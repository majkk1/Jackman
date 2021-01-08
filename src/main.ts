import * as ECS from '../libs/pixi-ecs';
import { SCENE_WIDTH } from './constants/constants'
import { Assets } from './constants/enums'
import { StageManager } from './stage-manager'

class Jackman {
	engine: ECS.Engine;

	constructor() {
		this.engine = new ECS.Engine();
		let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

		// init the game loop
		this.engine.init(canvas, {
			width: canvas.width,
			height: canvas.height,
			resolution: canvas.width / SCENE_WIDTH,
			resizeToScreen: true,
			backgroundColor: 0x0a0a0a,
			antialias: false,
		});

		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

		this.engine.app.loader
			.reset()
			.add(Assets.SPRITESHEET, './assets/spritesheet.png')
			.add(Assets.LEVELS, './assets/levels.txt')
			.add(Assets.LEVEL_BACKGROUND, './assets/level_background.png')
			.add(Assets.FONT, './assets/font/font.fnt')
			.load(() => this.loadGame());
	}

	loadGame() {
		//add and run main component
		this.engine.scene.stage.addComponentAndRun(new StageManager());
	}

}

// start game
export default new Jackman();