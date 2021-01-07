import * as ECS from '../libs/pixi-ecs';
import { BlinkingSprite } from './blinking-sprite';
import { GUN_AMMO_CAPACITY, INIT_HEALTH, PLAYER_IMMORTALITY_TIME } from './constants/constants'
import { Attribute, Messages, Tags } from './constants/enums'
import { PlayerKey } from './player-key';
import { PlayerGun } from './player-gun';


export interface PlayerState {
	health: number,
	coins: number,

	hasGun: boolean,
	ammo: number,
}


export class PlayerStateUpdater extends ECS.Component {

	state: PlayerState = {
		health: INIT_HEALTH,
		coins: 0,
		hasGun: false,
		ammo: 0,
	};

	onInit() {
		this.subscribe(Messages.HEALTH_ADD);
		this.subscribe(Messages.HEALTH_REMOVE);
		this.subscribe(Messages.COIN_ADD);
		this.subscribe(Messages.GUN_TAKE);
		this.subscribe(Messages.GUN_FIRE);
		this.subscribe(Messages.KEY_TAKE);
		
		//if player is saved, load it
		const savedPlayerState = this.owner.getAttribute(Attribute.PLAYER_STATE) as PlayerState;
		if (savedPlayerState){
			this.state = savedPlayerState;
		}

		//initialize statusbars
		this.sendMessage(Messages.HEALTH_SET, this.state.health);
		this.sendMessage(Messages.COIN_SET, this.state.coins);
		this.sendMessage(Messages.KEY_RESET);
		if(this.state.hasGun){
			this.owner.addComponent(new PlayerGun());
		}
	}

	onRemove() {
		this.sendMessage(Messages.GUN_DROP);
	}

	onMessage(msg: ECS.Message) {
		switch (msg.action) {
			case Messages.HEALTH_ADD:
				this.state.health++;
				this.sendMessage(Messages.HEALTH_SET,this.state.health);
				break;

			case Messages.HEALTH_REMOVE:
				this.state.health--;
				this.sendMessage(Messages.HEALTH_SET,this.state.health);
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
						this.owner.addComponent(new PlayerKey(Tags.BLUE));
						break;
					case Tags.GREEN:
						this.owner.addComponent(new PlayerKey(Tags.GREEN));
						break;
				}
				break;
		}
		this.owner.assignAttribute(Attribute.PLAYER_STATE, this.state);
		console.log(this.state);
	}

}
