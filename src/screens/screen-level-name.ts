import * as ECS from '../../libs/pixi-ecs';
import { Assets, Layer, Messages } from '../constants/enums';

/**
 * Screen with level name (before level starts)
 */
export class ScreenLevelName extends ECS.Component {

    readonly levelName: string;

    keyInputCmp: ECS.KeyInputComponent;
    levelNameLayer: ECS.Container;

    constructor(levelName: string) {
        super();

        this.levelName = levelName;
    }

    onInit() {
        this.keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

        this.levelNameLayer = new ECS.Container(Layer.MENU_SCREEN);
        this.owner.addChild(this.levelNameLayer);
        this.printName();
    }

    onUpdate() {
        if (this.keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
            this.keyInputCmp.handleKey(ECS.Keys.KEY_SPACE);
            this.levelNameLayer.destroy();
            this.sendMessage(Messages.RUN_LEVEL);
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
        let textLevel = new ECS.BitmapText('Text Level Name', '' + this.levelName, Assets.FONT, 1.5, 0xFFFF00);
        textLevel.anchor = 0.5;
        textLevel.position.set(this.scene.width / 2, this.scene.height / 2);
        this.levelNameLayer.addChild(textLevel);

        //text - press space to continue
        let textSpace = new ECS.BitmapText('Text space', 'Press space', Assets.FONT, 0.8, 0xdadada);
        textSpace.anchor = 0.5;
        textSpace.position.set(this.scene.width / 2, this.scene.height * 7 / 8);
        this.levelNameLayer.addChild(textSpace);
    }
}
