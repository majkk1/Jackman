import * as ECS from '../libs/pixi-ecs';
import { BlinkingSprite } from './blinking-sprite';
import { GUN_AMMO_CAPACITY, INIT_HEALTH, PLAYER_IMMORTALITY_TIME } from './constants/constants'
import { Attribute, Messages, Tags } from './constants/enums'
import { PlayerKey } from './player-key';
import { PlayerGun } from './player-gun';

export interface hasKey {
	hasBlueKey: boolean,
	hasGreenKey: boolean
}

export interface PlayerState {
	health: number,
	coins: number,

	hasGun: boolean,
	ammo: number,

	key: hasKey,
}


export class PlayerStateUpdater extends ECS.Component {

	state: PlayerState = {
		health: 0,
		coins: 0,
		hasGun: false,
		ammo: 0,
		key: {
			hasBlueKey: false,
			hasGreenKey: false
		}

	};

	onInit() {
		this.subscribe(Messages.HEALTH_INIT);
		this.subscribe(Messages.HEALTH_ADD);
		this.subscribe(Messages.HEALTH_REMOVE);
		this.subscribe(Messages.COIN_ADD);
		this.subscribe(Messages.GUN_TAKE);
		this.subscribe(Messages.GUN_FIRE);
		this.subscribe(Messages.KEY_TAKE);

		//initialize health
		this.state.health = INIT_HEALTH;
		this.sendMessage(Messages.HEALTH_INIT, INIT_HEALTH);

		//initialize coins
		this.state.coins = 0;
		this.sendMessage(Messages.COIN_SET, this.state.coins);
	}

	onRemove() {
		this.sendMessage(Messages.GUN_DROP);
	}

	onMessage(msg: ECS.Message) {
		switch (msg.action) {
			case Messages.HEALTH_INIT:
				this.state.health = msg.data;
				break;

			case Messages.HEALTH_ADD:
				this.state.health++;
				break;

			case Messages.HEALTH_REMOVE:
				this.state.health--;
				this.owner.addComponent(new BlinkingSprite(PLAYER_IMMORTALITY_TIME)); //blinking animation
				if (this.state.health == 0) {
					this.sendMessage(Messages.PLAYER_DEAD);
					return;
				}
				break;

			case Messages.COIN_ADD:
				this.state.coins++;
				break;

			case Messages.GUN_TAKE:
				if (!this.state.hasGun) {
					this.state.hasGun = true;
					this.owner.addComponent(new PlayerGun());
				}
				this.state.ammo += GUN_AMMO_CAPACITY;
				this.sendMessage(Messages.AMMO_SET, this.state.ammo);
				break;

			case Messages.GUN_FIRE:
				this.state.ammo--
				this.sendMessage(Messages.AMMO_SET, this.state.ammo);
				break;

			case Messages.KEY_TAKE:
				switch (msg.data) {
					case Tags.BLUE:
						this.state.key.hasBlueKey = true;
						this.owner.addComponent(new PlayerKey(Tags.BLUE));
						break;
					case Tags.GREEN:
						this.state.key.hasGreenKey = true;
						this.owner.addComponent(new PlayerKey(Tags.GREEN));
						break;
				}
				break;
		}
		this.owner.assignAttribute(Attribute.PLAYER_STATE, this.state);
	}

}
