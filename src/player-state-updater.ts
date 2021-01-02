import * as ECS from '../libs/pixi-ecs';
import { BlinkingSprite } from './blinking-sprite';
import { GUN_AMMO_CAPACITY, INIT_HEALTH, PLAYER_IMMORTALITY_TIME } from './constants/constants'
import { Attribute, Messages } from './constants/enums'
import { PlayerGun } from './player-gun';

export class PlayerStateUpdater extends ECS.Component {

	health: number;
	coins: number = 0;
	hasGun: boolean = false;
	ammo: number = 0;

	onInit() {
		this.subscribe(Messages.HEALTH_INIT);
		this.subscribe(Messages.HEALTH_ADD);
		this.subscribe(Messages.HEALTH_REMOVE);
		this.subscribe(Messages.COIN_ADD);
		this.subscribe(Messages.GUN_TAKE);
		this.subscribe(Messages.GUN_FIRE);

		//initialize health
		this.health = INIT_HEALTH;
		this.owner.assignAttribute(Attribute.HEALTH, this.health);
		this.sendMessage(Messages.HEALTH_INIT, INIT_HEALTH);

		//initialize coins
		this.sendMessage(Messages.COIN_SET, this.coins);
	}

	onRemove() {
		this.sendMessage(Messages.GUN_DROP);
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
				this.owner.addComponent(new BlinkingSprite(PLAYER_IMMORTALITY_TIME)); //blinking animation
				if (this.health == 0) {
					this.sendMessage(Messages.PLAYER_DEAD);
				}
				break;

			case Messages.COIN_ADD:
				this.coins++;
				this.owner.assignAttribute(Attribute.COINS, this.coins);
				break;

			case Messages.GUN_TAKE:
				if (!this.hasGun) {
					this.hasGun = true;
					this.owner.addComponent(new PlayerGun());
				}
				this.ammo += GUN_AMMO_CAPACITY;
				this.owner.assignAttribute(Attribute.AMMO, this.ammo);
				this.sendMessage(Messages.AMMO_SET, this.ammo);
				break;

			case Messages.GUN_FIRE:
				this.ammo--
				this.sendMessage(Messages.AMMO_SET, this.ammo);
				this.owner.assignAttribute(Attribute.AMMO, this.ammo);
				break;
		}
	}
}