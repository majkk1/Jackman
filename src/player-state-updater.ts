import * as ECS from '../libs/pixi-ecs';
import { DELTA_MUL, GRAVITY, INIT_HEALTH, JUMP_TRESHOLD, PLAYER_JUMP_SIZE, PLAYER_WALK_SPEED } from './constants/constants'
import { Attribute, Direction, Messages, GlobalAttribute, PlayerState } from './constants/enums'
import { Vector2 } from './utils/vector2';
import { Level } from './level';
import { BulletBuilder } from './bullet-builder';

export class PlayerStateUpdater extends ECS.Component {

	health: number;
	coins: number = 0;

	onInit() {
		this.subscribe(Messages.HEALTH_INIT);
		this.subscribe(Messages.HEALTH_ADD);
		this.subscribe(Messages.HEALTH_REMOVE);
		this.subscribe(Messages.COIN_ADD);

		//initialize health
		this.health = INIT_HEALTH;
		this.owner.assignAttribute(Attribute.HEALTH, this.health);
		this.sendMessage(Messages.HEALTH_INIT, INIT_HEALTH);

		//initialize coins
		this.sendMessage(Messages.COIN_SET, this.coins);
	}

	onMessage(msg: ECS.Message) {
		switch (msg.action) {
			case Messages.HEALTH_INIT:
				this.health = msg.data;
				this.owner.assignAttribute(Attribute.HEALTH, this.health);
				break;

			case Messages.HEALTH_ADD:
				this.health++;
				this.owner.assignAttribute(Attribute.HEALTH, this.health);
				break;

			case Messages.HEALTH_REMOVE:
				this.health--;
				this.owner.assignAttribute(Attribute.HEALTH, this.health);
				if (this.health == 0) {
					this.sendMessage(Messages.PLAYER_DEAD);
				}
				break;

			case Messages.COIN_ADD:
					this.coins++;
					this.owner.assignAttribute(Attribute.COINS, this.coins);
					break;
		}
	}
}