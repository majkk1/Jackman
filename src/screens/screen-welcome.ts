import * as ECS from '../../libs/pixi-ecs';
import { Assets, Layer, Messages } from '../constants/enums';

/**
 * Initial (welcome) screen with game logo
 */
export class ScreenWelcome extends ECS.Component {

    readonly levelName: string;

    keyInputCmp: ECS.KeyInputComponent;
    levelNameLayer: ECS.Container;

    textTitle: ECS.BitmapText;
    textSubtitle: ECS.BitmapText;

    onInit() {
        this.keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

        this.levelNameLayer = new ECS.Container(Layer.MENU_SCREEN);
        this.owner.addChild(this.levelNameLayer);
        this.createScreen();
    }

    onUpdate() {
        if (this.keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
            this.keyInputCmp.handleKey(ECS.Keys.KEY_SPACE);
            this.levelNameLayer.destroy();
            this.sendMessage(Messages.NEW_GAME);
            this.finish();
        }
    }

    private createScreen() {
        //black screen
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, this.scene.width, this.scene.height);
        this.levelNameLayer.addChild(graphics);

        //text - jackman
        this.printTitle('Jackman');

        //text - 2D platformer
        this.printSubtitle('2D platformer');

        //graphics - squares
        this.printSquares();

        //text - press space to start
        this.printStartText();
    }

    private printTitle(title: string) {
        this.textTitle = new ECS.BitmapText(title, title, Assets.FONT, 1.5, 0xFC1681);
        this.textTitle.anchor = 0.5;
        this.textTitle.position.set(this.scene.width / 2, this.scene.height / 2);
        this.levelNameLayer.addChild(this.textTitle);
    }

    private printSubtitle(subtitle: string) {
        this.textSubtitle = new ECS.BitmapText(subtitle, subtitle, Assets.FONT, 0.8, 0xFFFFFF);
        this.textSubtitle.anchor = 0.5;
        this.textSubtitle.position.set(this.scene.width / 2, this.scene.height / 2 + this.textSubtitle.height);
        this.levelNameLayer.addChild(this.textSubtitle);

        //blinking subtitle
        this.textSubtitle.addComponent(new ECS.FuncComponent('animator').setFixedFrequency(30)
            .doOnFixedUpdate((cmp) => {
                const current = cmp.owner.visible;
                cmp.owner.visible = !current;

                if (current) cmp.setFixedFrequency(30);
                else if (!current) cmp.setFixedFrequency(10);
            }))
    }

    printSquares() {
        const leftBound = this.textSubtitle.getBounds().left - 1.5;
        const rightBound = this.textSubtitle.getBounds().right + 1.5;
        const topBound = this.textSubtitle.getBounds().bottom - 0.5;

        const square_size = 0.2;
        const numOfSquares = (rightBound - leftBound) / (square_size + 0.1);

        let y = topBound;
        let x = leftBound;

        for (let row = 0; row < 6; row++) {
            for (let col = 0; x < rightBound; col++) {
                if (row < 3 && col > 2 && col < numOfSquares - 3) {
                    x += square_size + 0.1;
                    continue;
                }
                let blueSquare = new ECS.Graphics('blue dot');
                blueSquare.lineStyle(0.05, 0x0083a6, 1);
                blueSquare.beginFill(0x00c9ff);
                blueSquare.drawRect(x, y, square_size, square_size);
                this.levelNameLayer.addChild(blueSquare);
                x += square_size + 0.1;
            }
            y += square_size + 0.1;
            x = leftBound;
        }
    }

    private printStartText() {
        let textContinue = new ECS.BitmapText('Text space', 'Press space to start a game', Assets.FONT, 0.8, 0xdadada);
        textContinue.anchor = 0.5;
        textContinue.position.set(this.scene.width / 2, this.scene.height * 7 / 8);
        this.levelNameLayer.addChild(textContinue);
    }
}