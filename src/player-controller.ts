import * as ECS from '../libs/pixi-ecs';
import { DELTA_MUL, GRAVITY, JUMP_TRESHOLD, PLAYER_JUMP_SIZE, PLAYER_WALK_SPEED } from './constants/constants'
import { Attribute, Direction, GlobalAttribute, PlayerState } from './constants/enums'
import { Vector2 } from './utils/vector2';
import { Level } from './level';
import { BulletBuilder } from './bullet-builder';

export class PlayerController extends ECS.Component {

	playerState: PlayerState = PlayerState.STAND;
	isOnGround: boolean = false;
	oldY: number;
	jumpLen: number = 0;
	inJump: boolean = false;
	speed: Vector2 = new Vector2(0, 0);
	direction: Direction;

	hasGun: boolean = true; //TODO


	onUpdate(delta: number, absolute: number) {
		this.direction = this.owner.getAttribute(Attribute.DIRECTION)
		let deltaMul = delta * DELTA_MUL;

		//update player state, add movement 
		this.updatePlayerState(deltaMul, absolute);

		//add gravity (if not on ground or not going up)
		if ((!this.isOnGround || this.speed.x != 0) && !this.inJump) {
			this.isOnGround = false;
			this.speed.y += GRAVITY * deltaMul;
			this.speed.y = Math.min(this.speed.y, GRAVITY);
		}

		//apply physics on player
		this.applyMovement();
		this.owner.assignAttribute(Attribute.DIRECTION, this.direction)
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
				}
				//only left key pushed -> move left
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT)) {
					this.direction = Direction.LEFT;
					this.speed.x = Math.max(-PLAYER_WALK_SPEED * delta, -PLAYER_WALK_SPEED);
					this.isOnGround = false;
				}
				//only right key pushed -> move right
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT)) {
					this.direction = Direction.RIGHT;
					this.speed.x = Math.min(PLAYER_WALK_SPEED * delta, PLAYER_WALK_SPEED);
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
					this.direction = Direction.LEFT;
					this.speed.x = Math.max(-PLAYER_WALK_SPEED * delta, -PLAYER_WALK_SPEED);
				}
				//move right
				else if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_RIGHT) && !keyInputCmp.isKeyPressed(ECS.Keys.KEY_LEFT)) {
					this.direction = Direction.RIGHT;
					this.speed.x = Math.min(PLAYER_WALK_SPEED * delta, PLAYER_WALK_SPEED);
				}
				//space -> jump
				if (keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
					if (this.inJump) {
						//measure len of the jump
						this.jumpLen += this.oldY - this.owner.y;
						this.oldY = this.owner.y;
					}

					// first stage of jump - add speed, remove gravity
					if (this.isOnGround && !this.inJump) {
						this.inJump = true;
						this.oldY = this.owner.y;
						this.speed.y = -PLAYER_JUMP_SIZE;
						this.isOnGround = false;
					}
					// end of jump (timeout)
					else if (!this.inJump || this.jumpLen > JUMP_TRESHOLD) {
						this.inJump = false; // gravity is back
						keyInputCmp.handleKey(ECS.Keys.KEY_SPACE);
						this.jumpLen = 0;
					}
				}
				// end of jump
				else {
					this.jumpLen = 0;
					this.inJump = false;
				}

				//no jump && on the ground 
				if (this.isOnGround && this.inJump == false) {
					this.playerState = PlayerState.STAND;
				}
				break;
		}

		//fire
		if (this.hasGun && keyInputCmp.isKeyPressed(ECS.Keys.KEY_CTRL)) {
			let bullet = new BulletBuilder(this.direction, this.owner, this.scene);
			bullet.build();

			keyInputCmp.handleKey(ECS.Keys.KEY_CTRL);
		}
	}

	applyMovement() {
		let platformMap = this.scene.getGlobalAttribute<Level>(GlobalAttribute.LEVEL).map;

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
				this.inJump = false;
			}
		}

		//reduce speed
		this.speed.x *= 0.7;
		this.speed.y *= 0.9;

		if (Math.abs(this.speed.x) < 0.01) this.speed.x = 0;
		if (Math.abs(this.speed.y) < 0.01) this.speed.y = 0;
	}
}