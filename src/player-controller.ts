import * as ECS from '../libs/pixi-ecs';    

import {Vector2, Tags, PlayerState} from './constants'

export class PlayerController extends ECS.Component {

	readonly GRAVITY = 0.05;

	readonly EPSILON = 1e-2;

	readonly PLAYER_WALK_SPEED = 0.10;
	readonly PLAYER_JUMP_SIZE = 0.20;
	readonly JUMP_TRESHOLD = 200;

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

	private solveCollision(speedX: number, speedY: number, cBox: PIXI.Rectangle) {
		let collisionSolved: boolean;

		// save previous coords
		let oldX = this.owner.position.x;
		let oldY = this.owner.position.y;

		//apply speed to player coords
		this.owner.position.x += speedX;
		this.owner.position.y += speedY;

		let playerBox = this.owner.getBounds();

		let horizIntersection = this.horizIntersection(playerBox, cBox);
		let verIntersection = this.verIntersection(playerBox, cBox);

		let collides = horizIntersection > 0 && verIntersection > 0;

		if (!collides) {
			this.owner.position.x = oldX;
			this.owner.position.y = oldY;
			collisionSolved = false;
			return collisionSolved;
		}

		if (collides) {
			if (speedY > 0) {
				this.owner.y = oldY + (speedY - verIntersection);
				speedY = 0;
				this.setonGround(true);
				console.log('Collision down, verInt: ', verIntersection);
			}

			//collision below player
			if (speedY < 0) {
				this.owner.y = oldY + (speedY + verIntersection);
				speedY = 0;
				this.setJumpTime(0);
				console.log('Collision up, verInt: ', verIntersection);
			}

			//collision right to the player
			if (speedX > 0) {
				this.owner.x = oldX + (speedX - horizIntersection);
				speedX = 0;
				console.log('Collision right, horizInt: ', horizIntersection);
			}

			//collision left to the player
			if (speedX < 0) {
				this.owner.x = oldX + (speedX + horizIntersection);
				speedX = 0;
				console.log('Collision left, horizInt: ', horizIntersection);
			}
		}

		this.owner.x = Math.round(this.owner.x * 100) / 100; //avoid float math error
		this.owner.y = Math.round(this.owner.y * 100) / 100; //avoid float math error
		collisionSolved = true;

		return collisionSolved;
	}

	applyMovement() {
		//horizontal movement
		let speed = this.getspeed();

		//if no movement
		if (speed.x == 0 && speed.y == 0) return;


		// save previous coords
		let oldX = this.owner.position.x;
		let oldY = this.owner.position.y;

		//apply speed to player coords
		this.owner.position.x += speed.x;
		this.owner.position.y += speed.y;

		//check for collision with grounds
		const grounds = this.scene.findObjectsByTag(Tags.GROUND);

		console.log('Collision func start, on ground:', this.getonGround(), ', speed: ', speed);

		let collisionOnX = false;
		let collisionOnY = false;

		let i = 0;
		// let playerBox = this.owner.getBounds(); //get player cbox

		let playerBox = this.owner.getBounds().clone();

		for (let colider of grounds) {
			const cBox = colider.getBounds(); //get ground cbox

			//is there a intersection?
			let horizIntersection = this.horizIntersection(playerBox, cBox);
			let verIntersection = this.verIntersection(playerBox, cBox);
			let collides = (horizIntersection > 0 && verIntersection > 0);

			if (collides) {
				console.log('collision #', i++);

				//return position before movement to solve collision correctly
				this.owner.position.x = oldX;
				this.owner.position.y = oldY;

				let colYres = this.solveCollision(0, speed.y, cBox);
				let colXres = this.solveCollision(speed.x, 0, cBox);



				if (!collisionOnX && colXres) collisionOnX = true;
				if (!collisionOnY && colYres) collisionOnY = true;

				oldX = this.owner.position.x;
				oldY = this.owner.position.y;


				// if (colXres && colYres) {
				// 	break;
				// }
			}
		}
		console.log('Collision func end, on ground:', this.getonGround(), ', speed: ', speed);

		if (!collisionOnX) this.owner.position.x += speed.x;
		if (!collisionOnY) this.owner.position.y += speed.y;

		// speed.x = 0;
		// speed.y = 0;

		speed.x *= 0.8;
		speed.y *= 0.8;

		if (Math.abs(speed.x) < this.EPSILON) speed.x = 0;
		if (Math.abs(speed.y) < this.EPSILON) speed.y = 0;

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
				speed.y += Math.min(this.GRAVITY * delta, this.GRAVITY);
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