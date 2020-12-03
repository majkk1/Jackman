import * as ECS from '../libs/pixi-ecs';

const SCENE_WIDTH = 20;
const TEXTURE_SCALE = SCENE_WIDTH / (32 * 20);


enum Tags {
	PLAYER = 'player',
	GROUND = 'ground'
}

class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

class CollisionHandler extends ECS.Component {

	onUpdate(delta: number, absolute: number) {
		// const player = this.scene.findObjectByTag(Tags.PLAYER);
		// const grounds = this.scene.findObjectsByTag(Tags.GROUND);

		// const coliders = [...grounds];
		// const playerBox = player.getBounds();

		// for (let colider of coliders) {
		// 	const cBox = colider.getBounds();

		// 	const horizIntersection = this.horizIntersection(playerBox, cBox);
		// 	const verIntersection = this.verIntersection(playerBox, cBox);

		// 	const collides = horizIntersection >= 0 && verIntersection >= 0;

		// 	if (collides) {


		// 	}
		// }
	}

	private horizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
		return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
	}

	private verIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
		return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
	}
}

enum PlayerState {
	STAND = 'STAND',
	WALK = 'WALK',
	JUMP = 'JUMP',
}

class CollisionSide {
	collisionRight: boolean;
	collisionLeft: boolean;
	collisionBottom: boolean;
}

class PlayerController extends ECS.Component {

	readonly GRAVITY = 0.001;

	readonly EPSILON = 1e-2;

	readonly PLAYER_WALK_SPEED = 0.15;
	readonly PLAYER_JUMP_SIZE = 0.25;
	readonly JUMP_TRESHOLD = 150;

	onInit() {
		this.setspeed(new Vector2(0, 0));
		this.setJumpTime(0);
	}

	getprevPos() {
		return this.owner.getAttribute<Vector2>('prevPos');
	}
	setprevPos(prevPos: Vector2) {
		this.owner.assignAttribute('prevPos', prevPos);
	}

	getspeed() {
		return this.owner.getAttribute<Vector2>('speed');
	}
	setspeed(speed: Vector2) {
		this.owner.assignAttribute('speed', speed);
	}

	getJumpTime() {
		return this.owner.getAttribute<number>('jumpTime');
	}

	setJumpTime(jumpTime: number) {
		this.owner.assignAttribute('jumpTime', jumpTime);
	} jumpTime

	getonGround() {
		return this.owner.getAttribute<boolean>('onGround');
	}
	setonGround(flag: boolean) {
		this.owner.assignAttribute('onGround', flag);
	}

	getplayerState() {
		return this.owner.getAttribute<PlayerState>('playerState');
	}
	setplayerState(state: PlayerState) {
		this.owner.assignAttribute('playerState', state);
	}

	getsideCol() {
		return this.owner.getAttribute<boolean>('sideCol');
	}
	setsideCol(sideCol: boolean) {
		this.owner.assignAttribute('sideCol', sideCol);
	}

	private horizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
		return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
	}

	private verIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
		return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
	}

	applyMovement() {
		//horizontal movement
		let speed = this.getspeed();

		//if no movement
		if (speed.x == 0 && speed.y == 0) return;


		// save previous coords
		let oldX = this.owner.position.x;
		let oldY = this.owner.position.y;


		this.owner.position.x += speed.x;
		this.owner.position.y += speed.y;


		//check for collision with grounds
		const grounds = this.scene.findObjectsByTag(Tags.GROUND);

		// console.log('Col func start, on ground:', this.getonGround(), ', speed: ', speed);

		for (let colider of grounds) {
			let playerBox = this.owner.getBounds();
			const cBox = colider.getBounds();

			//solve vertical collision
			let horizIntersection = this.horizIntersection(playerBox, cBox);
			let verIntersection = this.verIntersection(playerBox, cBox);

			let collides = (horizIntersection > 0 && verIntersection > 0);


			let isHorizontalCol = verIntersection < horizIntersection;

			// if (this.getsideCol() && horizIntersection == 0) {
			// 	this.setsideCol(false);
			// 	console.log("sideCol = false");
			// }

			if (collides) {

				// if (!isHorizontalCol == !this.getsideCol()) {
				// 	this.setsideCol(true);
				// 	console.log("sideCol = true");
				// }

				// if (this.getsideCol()) {
				// 	isHorizontalCol = false;
				// }

				console.log('col podlaha/strop? ', isHorizontalCol, ', hxv: ', verIntersection, ' < ', horizIntersection);
				
				if (isHorizontalCol) {
					// console.log('playerCbox: ', playerBox, ' cbox: ', cBox);
					//collision under player
					if (speed.y > 0 && !this.getonGround()) {
						this.owner.y = oldY + (speed.y - verIntersection);
						speed.y = 0;
						this.setonGround(true);
						console.log('Collision down, verInt: ', verIntersection);
					}

					//collision below player
					if (speed.y < 0) {
						this.owner.y = oldY + (speed.y + verIntersection);
						speed.y = 0;
						this.setJumpTime(0);
						console.log('Collision up, verInt: ', verIntersection);
					}
				}
				else {
					collides = (horizIntersection > 0 && verIntersection > 0.8);
					if (collides) {
						//collision right to the player
						if (speed.x > 0) {
							this.owner.x = oldX + (speed.x - horizIntersection);
							speed.x = 0;
							console.log('Collision right, horizInt: ', horizIntersection);
						}

						//collision left to the player
						if (speed.x < 0) {
							this.owner.x = oldX + (speed.x + horizIntersection);
							speed.x = 0;
							console.log('Collision left, horizInt: ', horizIntersection);
						}
					}
				}
			}
			// speed.y *= 0.8;
			// if (Math.abs(speed.y) < this.EPSILON) speed.y = 0;

			// horizIntersection = this.horizIntersection(playerBox, cBox);
			// verIntersection = this.verIntersection(playerBox, cBox);

			// //solve horizontal collision
			// collides = (horizIntersection > 0 && verIntersection > 0.8);
			// if (collides) {
			// 	//collision right to the player
			// 	if (speed.x > 0) {
			// 		this.owner.x = oldX + (speed.x - horizIntersection);
			// 		speed.x = 0;
			// 		console.log('Collision right, horizInt: ', horizIntersection);
			// 	}

			// 	//collision left to the player
			// 	if (speed.x < 0) {
			// 		this.owner.x = oldX + (speed.x + horizIntersection);
			// 		speed.x = 0;
			// 		console.log('Collision left, horizInt: ', horizIntersection);
			// 	}
			// }
		}
		speed.x = 0;


		// speed.x *= 0.8;
		// if (Math.abs(speed.x) < this.EPSILON) speed.x = 0;

		//save changes
		this.setspeed(speed);
	}

	onUpdate(delta: number, absolute: number) {
		const keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

		let speed = this.getspeed();
		let wasMoved = false

		let playerState = this.getplayerState();

		console.log('state: ', playerState);

		switch (playerState) {
			case PlayerState.STAND:
				//if left or right arrow but not both -> goto WALK state
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) || keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					if (!(keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT))) {
						playerState = PlayerState.WALK;
					}
				}
				//if space -> goto JUMP
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
					playerState = PlayerState.JUMP;
				}
				break;

			case PlayerState.WALK:
				//space pushed -> goto JUMP
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
					playerState = PlayerState.JUMP;
					console.log('state: WALK->JUMP');
				}
				//move left
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					speed.x = Math.max(-this.PLAYER_WALK_SPEED * delta, -this.PLAYER_WALK_SPEED);
					this.setonGround(false);
				}
				//move right
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT)) {
					speed.x = Math.min(this.PLAYER_WALK_SPEED * delta, this.PLAYER_WALK_SPEED);
					this.setonGround(false);
				}
				//nothing happened
				else {
					playerState = PlayerState.STAND;
				}
				break;

			case PlayerState.JUMP:
				console.log('state: JUMP START, onGround: ', this.getonGround());
				//move left
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					console.log('state: JUMP, key left');
					speed.x = Math.max(-this.PLAYER_WALK_SPEED * delta, -this.PLAYER_WALK_SPEED);
				}
				//move right
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT)) {
					console.log('state: JUMP, key right');
					speed.x = Math.min(this.PLAYER_WALK_SPEED * delta, this.PLAYER_WALK_SPEED);
				}
				//jump
				let jumpTime = this.getJumpTime();
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
					console.log('state: JUMP, key space');
					if (this.getonGround()) {
						if (jumpTime == 0) {
							console.log('start jump', absolute);
							jumpTime = absolute;
						}
					}
					if (jumpTime >= 0 && absolute - jumpTime < this.JUMP_TRESHOLD) {
						this.setonGround(false);
						console.log('doin jump');
						speed.y = Math.max(-this.PLAYER_JUMP_SIZE * delta, -this.PLAYER_JUMP_SIZE);
					}
					else {
						jumpTime = 0;
						console.log('jmp timeout');
						keyInputCmp.handleKey(ECS.Keys.KEY_SPACE);
					}
					this.setJumpTime(jumpTime);
				}
				else {
					this.setJumpTime(0);
				}
				//no jump if on the ground
				if (this.getonGround() && this.getJumpTime() == 0) {
					playerState = PlayerState.STAND;
					console.log('jump end');
				}
				console.log('jmp, speed y: ', speed.y)
				break;
		}

		// this.applyMovement(); //apply physics

		if (!this.getonGround()) {
			//add gravity
			if (!this.getonGround()) {
				speed.y += Math.max(this.GRAVITY * delta, this.GRAVITY);
			}
		}

		// console.log('speed after gravity, speed y: ', speed.y)


		//save changes
		this.setplayerState(playerState);
		this.setspeed(speed);

		//apply physics on player
		this.applyMovement(); //apply physics
	}
}

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
			.add('spritesheet', './assets/spritesheet.png')
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		// init the scene and run your game
		const scene = this.engine.scene;
		const sceneHeight = SCENE_WIDTH / (this.engine.app.view.width / this.engine.app.view.height)
		scene.assignGlobalAttribute('SCENE_HEIGHT', sceneHeight);
		scene.addGlobalComponent(new ECS.KeyInputComponent());
		scene.addGlobalComponent(new CollisionHandler());
		//add map
		let ground = new ECS.Container('groundLayer');
		scene.stage.addChild(ground);

		for (let i = 0; i < SCENE_WIDTH; i++) {
			let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
			sprite.scale.set(TEXTURE_SCALE);
			sprite.position.x = i;
			sprite.position.y = sceneHeight - 1;
			sprite.addTag(Tags.GROUND);
			ground.addChild(sprite);
		}

		for (let i = 0; i < Math.floor(2 * SCENE_WIDTH / 3); i++) {
			let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
			sprite.scale.set(TEXTURE_SCALE);
			sprite.position.x = i;
			sprite.position.y = sceneHeight - 5;
			sprite.addTag(Tags.GROUND);
			ground.addChild(sprite);
		}

		for (let i = Math.ceil(3 * SCENE_WIDTH / 4); i < SCENE_WIDTH; i++) {
			let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
			sprite.scale.set(TEXTURE_SCALE);
			sprite.position.x = i;
			sprite.position.y = sceneHeight - 8;
			sprite.addTag(Tags.GROUND);
			ground.addChild(sprite);
		}

		for (let i = Math.ceil(SCENE_WIDTH / 4); i < Math.ceil(3 * SCENE_WIDTH / 4); i++) {
			let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
			sprite.scale.set(TEXTURE_SCALE);
			sprite.position.x = i;
			sprite.position.y = sceneHeight - 11;
			sprite.addTag(Tags.GROUND);
			ground.addChild(sprite);
		}

		let sprite2 = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
		sprite2.scale.set(TEXTURE_SCALE);
		sprite2.position.x = 2;
		sprite2.position.y = sceneHeight - 2;
		sprite2.addTag(Tags.GROUND);
		ground.addChild(sprite2);

		let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
		sprite.scale.set(TEXTURE_SCALE);
		sprite.position.x = 14;
		sprite.position.y = sceneHeight - 2;
		sprite.addTag(Tags.GROUND);
		ground.addChild(sprite);

		//add player
		new ECS.Builder(this.engine.scene)
			.anchor(0, 0)
			.localPos(7, sceneHeight - 2)
			.withTag(Tags.PLAYER)
			.asSprite(this.createTexture(32, 0, 32, 32))
			.withParent(scene.stage)
			.withComponent(new PlayerController())
			.withAttribute('speed', Vector2)
			.withAttribute('onGround', true)
			.withAttribute('sideCol', false)
			.withAttribute('jumpTime', 0)
			.withAttribute('playerState', PlayerState.STAND)
			.scale(TEXTURE_SCALE)
			.build();

	}

	private createTexture(offsetX: number, offsetY: number, width: number, height: number) {
		let texture = PIXI.Texture.from('spritesheet');
		texture = texture.clone();
		texture.frame = new PIXI.Rectangle(offsetX, offsetY, width, height);

		return texture;
	}
}


// this will create a new instance as soon as this file is loaded
export default new MyGame();