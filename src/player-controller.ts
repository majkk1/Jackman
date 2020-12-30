import * as ECS from '../libs/pixi-ecs';
import { Vector2, Tags, GlobalAttribute } from './constants'

enum PlayerState {
	STAND = 'STAND',
	WALK = 'WALK',
	JUMP = 'JUMP',
}

export class PlayerController extends ECS.Component {

	playerState: PlayerState = PlayerState.STAND;
	isOnGround: boolean = false;
	jumpTime: number = 0;
	speed: Vector2 = new Vector2(0, 0);

	readonly DELTA_MUL = 0.01;
	readonly GRAVITY = 0.5;
	readonly PLAYER_WALK_SPEED = 0.8;
	readonly PLAYER_JUMP_SIZE = 0.4;
	readonly JUMP_TRESHOLD = 350;

	onUpdate(delta: number, absolute: number) {

		let deltaMul = delta * this.DELTA_MUL;

		// console.log('state: ', this.playerState);

		this.updatePlayerState(deltaMul, absolute); //update player state, add movement 

		//add gravity (if not on ground or not going up)
		if (!this.isOnGround && this.jumpTime == 0) {
			this.speed.y += this.GRAVITY * deltaMul;
			this.speed.y = Math.min(this.speed.y, this.GRAVITY);
		}

		//apply physics on player
		this.applyMovement(); //apply physics
	}

	updatePlayerState(delta: number, absolute: number) {
		const keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

		switch (this.playerState) {
			case PlayerState.STAND:
				//if left or right arrow but not both -> goto WALK state
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) || keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					if (!(keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT))) {
						this.playerState = PlayerState.WALK;
					}
				}
				//if space -> goto JUMP
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
					this.playerState = PlayerState.JUMP;
				}
				break;

			case PlayerState.WALK:
				//space pushed -> goto JUMP
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
					this.playerState = PlayerState.JUMP;
					// console.log('state: WALK->JUMP');
				}
				//move left
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					this.speed.x = Math.max(-this.PLAYER_WALK_SPEED * delta, -this.PLAYER_WALK_SPEED);
					this.isOnGround = false;
				}
				//move right
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT)) {
					this.speed.x = Math.min(this.PLAYER_WALK_SPEED * delta, this.PLAYER_WALK_SPEED);
					this.isOnGround = false;
				}
				//nothing happened
				else {
					this.playerState = PlayerState.STAND;
				}
				break;

			case PlayerState.JUMP:
				// console.log('state: JUMP START, onGround: ', this.isOnGround);
				//move left
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					// console.log('state: JUMP, key left');
					this.speed.x = Math.max(-this.PLAYER_WALK_SPEED * delta, -this.PLAYER_WALK_SPEED);
				}
				//move right
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT)) {
					// console.log('state: JUMP, key right');
					this.speed.x = Math.min(this.PLAYER_WALK_SPEED * delta, this.PLAYER_WALK_SPEED);
				}
				//jump
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
					// console.log('state: JUMP, key space');
					if (this.isOnGround) {
						if (this.jumpTime == 0) {
							// console.log('start jump', absolute);
							this.jumpTime = absolute;
							this.speed.y = -this.PLAYER_JUMP_SIZE;
						}
					}
					if (this.jumpTime >= 0 && absolute - this.jumpTime < this.JUMP_TRESHOLD) {
						this.isOnGround = false;
						// console.log('doin jump');
					}
					else {
						this.jumpTime = 0;
						// console.log('jmp timeout');
						keyInputCmp.handleKey(ECS.Keys.KEY_SPACE);
					}
				}
				else {
					this.jumpTime = 0;
				}
				//no jump && on the ground
				if (this.isOnGround && this.jumpTime == 0) {
					this.playerState = PlayerState.STAND;
					// console.log('jump end');
				}
				// console.log('jmp, speed y: ', this.speed.y)
				break;
		}
	}

	applyMovement() {
		let platformMap = this.scene.getGlobalAttribute(GlobalAttribute.PLATFORM_MAP);

		//if no movement
		if (this.speed.x == 0 && this.speed.y == 0) return;

		// save previous coords
		let oldX = this.owner.position.x;
		let oldY = this.owner.position.y;



		//solve horizontal collision (x-axis)
		this.owner.position.x += this.speed.x;
		let pX = this.owner.position.x;
		let pY = this.owner.position.y;
		if (this.speed.x > 0) {
			//player moving right
			if (platformMap[Math.floor(pY)][Math.floor(pX + 1)] !== null || platformMap[Math.ceil(pY)][Math.floor(pX + 1)] !== null) {
				//collision detected
				// console.log('collision right')
				this.owner.position.x = Math.floor(pX);
			}
		}
		else if (this.speed.x < 0) {
			//player moving left
			if (platformMap[Math.floor(pY)][Math.floor(pX)] !== null || platformMap[Math.ceil(pY)][Math.floor(pX)] !== null) {
				//collision detected
				// console.log('collision left')
				this.owner.position.x = Math.floor(pX) + 1;
			}
		}

		//solve verticall collision (y-axis)
		this.owner.position.y += this.speed.y;
		pX = this.owner.position.x;
		pY = this.owner.position.y;
		if (this.speed.y > 0) {
			//player moving down
			if (platformMap[Math.floor(pY + 1)][Math.floor(pX)] !== null || platformMap[Math.floor(pY + 1)][Math.ceil(pX)] !== null) {
				//collision detected
				// console.log('collision down')
				this.owner.position.y = Math.floor(pY);
				this.isOnGround = true;
				this.speed.y = 0;
			}
		}
		else if (this.speed.y < 0) {
			//player moving up
			if (platformMap[Math.floor(pY)][Math.floor(pX)] !== null || platformMap[Math.floor(pY)][Math.ceil(pX)] !== null) {
				//collision detected
				// console.log('collision up')
				this.owner.position.y = Math.floor(pY) + 1;
				this.jumpTime = 0
			}
		}

		this.speed.x *= 0.7;
		this.speed.y *= 0.9;

		if (Math.abs(this.speed.x) < 0.01) this.speed.x = 0;
		if (Math.abs(this.speed.y) < 0.01) this.speed.y = 0;

	}
}