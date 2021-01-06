import * as ECS from '../../libs/pixi-ecs';
import { Assets, Messages } from '../constants/enums'
import { ASSET_RES, HEALTH_LIMIT, TEXTURE_SCALE } from '../constants/constants'

export class HealthbarController extends ECS.Component {

    hearts: ECS.Sprite[] = [];

    onInit() {
        this.subscribe(Messages.HEALTH_SET)
    }

    onMessage(msg: ECS.Message) {
        if(msg.action === Messages.HEALTH_SET){
            const diff = msg.data - this.hearts.length;

            if(diff > 0){
                this.addHearts(diff);
            }
            else if(diff < 0){
                this.removeHearts(Math.abs(diff));
            }
        }
    }

    private addHeart() {
        if (this.hearts.length - 1 > HEALTH_LIMIT) {
            throw Error(`Health limit (${HEALTH_LIMIT}) exceeded.`);
        }

        let texture = PIXI.Texture.from(Assets.SPRITESHEET);
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(96, 0, ASSET_RES, ASSET_RES);

        let heart = new ECS.Sprite('heart', texture);
        heart.scale.set(TEXTURE_SCALE);
        heart.anchor.set(1, 0);
        heart.x = this.scene.width - this.hearts.length - 1;

        this.owner.addChild(heart);
        this.hearts.push(heart);
    }

    private addHearts(number: number) {
        for (let i = 0; i < number; i++) {
            this.addHeart();
        }
    }

    private removeHeart() {
        if (this.hearts.length == 0) {
            throw Error('No hearts left on screen.');
        }

        let removedHeart = this.hearts.pop();
        removedHeart.destroy();
    }

    private removeHearts(number: number){
        for (let i = 0; i < number; i++) {
            this.removeHeart();
        }
    }
}
