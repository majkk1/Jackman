import * as ECS from '../../libs/pixi-ecs';
import { Attribute, Assets, Direction, Messages } from '../constants/enums'
import { BulletBuilder } from './bullet-builder';
import { ASSET_RES } from '../constants/constants';
import { PlayerState } from './player-state-updater';

/**
 * This component is assgined to the player, where he take a gun. It controls shooting (keyboard input, creating bullet) and also creates texture with gun on player. 
 */
export class PlayerGun extends ECS.Component {

	keyInputCmp: ECS.KeyInputComponent;
	ammo: number = 0;
	gunSprite: ECS.Container;

	onInit() {
		this.keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

		//load gun texture
		let gunTexture = PIXI.Texture.from(Assets.SPRITESHEET).clone();
		gunTexture.frame = new PIXI.Rectangle(224, 0, ASSET_RES, ASSET_RES);

		//if player direction === right -> flip texture
		const playerDirection = this.owner.getAttribute(Attribute.DIRECTION);
		if (playerDirection == Direction.RIGHT){
			gunTexture = new PIXI.Texture(gunTexture.baseTexture, gunTexture.frame, null, null, 12);
		}

		//create gun sprite on player
		let gunSprite = new ECS.Sprite('gun sprite',gunTexture);
		gunSprite.anchor.x = 0.5;
		gunSprite.x += gunSprite.width/2;
		this.owner.addChild(gunSprite);
	}

	onUpdate() {
		//if space is pushed -> fire
		if (this.keyInputCmp.isKeyPressed(ECS.Keys.KEY_CTRL)) {
			const ammo = this.owner.getAttribute<PlayerState>(Attribute.PLAYER_STATE).ammo;
			const direction = this.owner.getAttribute(Attribute.DIRECTION) as Direction;
			//make a bullet
			if (ammo > 0) {
				const bullet = new BulletBuilder(direction, this.owner, this.scene);
				bullet.build();
				this.sendMessage(Messages.GUN_FIRE);
			}
			this.keyInputCmp.handleKey(ECS.Keys.KEY_CTRL);
		}
	}
}