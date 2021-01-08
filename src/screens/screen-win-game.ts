import * as ECS from '../../libs/pixi-ecs';
import { Assets, Layer, Messages } from '../constants/enums';

/**
 * Screen after last level - you win the game
 */
export class ScreenWinGame extends ECS.Component {

    readonly score: number;

    keyInputCmp: ECS.KeyInputComponent;
    levelNameLayer: ECS.Container;

    constructor(score: number) {
        super();

        this.score = score;
    }

    onInit() {
        this.keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

        this.levelNameLayer = new ECS.Container(Layer.LEVEL_NAME);
        this.owner.addChild(this.levelNameLayer);
        this.printName();
    }

    onUpdate() {
        if (this.keyInputCmp.isKeyPressed(ECS.Keys.KEY_ENTER)) {
            this.keyInputCmp.handleKey(ECS.Keys.KEY_ENTER);
            this.levelNameLayer.destroy();
            this.sendMessage(Messages.GAME_RESET);
            this.finish();
        }
    }

    private printName() {
        //black screen
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, this.scene.width, this.scene.height);
        this.levelNameLayer.addChild(graphics);

        //text - level name
        let textLevel = new ECS.BitmapText('Text congratulations', 'Congratulations!', Assets.FONT, 1.5, 0xFFFF00);
        textLevel.anchor = 0.5;
        textLevel.position.set(this.scene.width / 2, this.scene.height / 4);
        this.levelNameLayer.addChild(textLevel);

        let textWin = new ECS.BitmapText('Text win', 'You win!', Assets.FONT, 1.25, 0xFFFF00);
        textWin.anchor = 0.5;
        textWin.position.set(this.scene.width / 2, this.scene.height * 3 / 8);
        this.levelNameLayer.addChild(textWin);

        //text - score
        let textScore = new ECS.BitmapText('Text score', 'Your score: ' + this.score, Assets.FONT, 1.25, 0xFF0000);
        textScore.anchor = 0.5;
        textScore.position.set(this.scene.width / 2, this.scene.height * 5 / 8);
        this.levelNameLayer.addChild(textScore);

        //text - reset
        let textReset = new ECS.BitmapText('Text reset', 'Press enter to open menu', Assets.FONT, 0.8, 0xdadada);
        textReset.anchor = 0.5;
        textReset.position.set(this.scene.width / 2, this.scene.height * 14 / 16);
        this.levelNameLayer.addChild(textReset);
    }
}
