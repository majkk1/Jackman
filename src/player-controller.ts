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

		//update player state, add movement 
		this.updatePlayerState(deltaMul, absolute);

		//add gravity (if not on ground or not going up)
		if ((!this.isOnGround || this.speed.x != 0) && this.jumpTime == 0) {
			this.speed.y += this.GRAVITY * deltaMul;
			this.speed.y = Math.min(this.speed.y, this.GRAVITY);
		}

		//apply physics on player
		this.applyMovement();
	}

	updatePlayerState(delta: number, absolute: number) {
		const keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

		console.log(this.playerState);

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
				}
				//only left key pushed -> move left
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					this.speed.x = Math.max(-this.PLAYER_WALK_SPEED * delta, -this.PLAYER_WALK_SPEED);
					this.isOnGround = false;
				}
				//only right key pushed -> move right
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
				//move left
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					this.speed.x = Math.max(-this.PLAYER_WALK_SPEED * delta, -this.PLAYER_WALK_SPEED);
				}
				//move right
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT)) {
					this.speed.x = Math.min(this.PLAYER_WALK_SPEED * delta, this.PLAYER_WALK_SPEED);
				}
				//space -> jump
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
					// first stage of jump - add speed, remove gravity
					if (this.isOnGround && this.jumpTime == 0) {
						this.jumpTime = absolute;
						this.speed.y = -this.PLAYER_JUMP_SIZE;
						this.isOnGround = false;

					}
					// end of jump (timeout)
					else if (this.jumpTime >= 0 && absolute - this.jumpTime > this.JUMP_TRESHOLD) {
						keyInputCmp.handleKey(ECS.Keys.KEY_SPACE);
						this.jumpTime = 0; // gravity is back
					}
				}
				// end of jump
				else {
					this.jumpTime = 0;
				}

				//no jump && on the ground 
				if (this.isOnGround && this.jumpTime == 0) {
					this.playerState = PlayerState.STAND;
				}
				break;
		}
	}

	applyMovement() {
		let platformMap = this.scene.getGlobalAttribute(GlobalAttribute.PLATFORM_MAP);

		//if no movement, return
		if (this.speed.x == 0 && this.speed.y == 0) return;

		//solve horizontal collision (x-axis)
		this.owner.position.x += this.speed.x;
		let pX = this.owner.position.x;
		let pY = this.owner.position.y;
		if (this.speed.x > 0) {
			//player moving right
			if (platformMap[Math.floor(pY)][Math.floor(pX + 1)] !== null || platformMap[Math.ceil(pY)][Math.floor(pX + 1)] !== null) {
				//collision right
				this.owner.position.x = Math.floor(pX);
				this.speed.x = 0;
			}
		}
		else if (this.speed.x < 0) {
			//player moving left
			if (platformMap[Math.floor(pY)][Math.floor(pX)] !== null || platformMap[Math.ceil(pY)][Math.floor(pX)] !== null) {
				//collision left
				this.owner.position.x = Math.floor(pX) + 1;
				this.speed.x = 0;
			}
		}

		//solve verticall collision (y-axis)
		this.owner.position.y += this.speed.y;
		pX = this.owner.position.x;
		pY = this.owner.position.y;
		if (this.speed.y > 0) {
			//player moving down
			if (platformMap[Math.floor(pY + 1)][Math.floor(pX)] !== null || platformMap[Math.floor(pY + 1)][Math.ceil(pX)] !== null) {
				//collision down
				this.owner.position.y = Math.floor(pY);
				this.isOnGround = true;
				this.speed.y = 0;
			}
		}
		else if (this.speed.y < 0) {
			//player moving up
			if (platformMap[Math.floor(pY)][Math.floor(pX)] !== null || platformMap[Math.floor(pY)][Math.ceil(pX)] !== null) {
				//collision up
				this.owner.position.y = Math.floor(pY) + 1;
				this.jumpTime = 0
			}
		}

		//reduce speed
		this.speed.x *= 0.7;
		this.speed.y *= 0.9;

		if (Math.abs(this.speed.x) < 0.01) this.speed.x = 0;
		if (Math.abs(this.speed.y) < 0.01) this.speed.y = 0;
	}
}