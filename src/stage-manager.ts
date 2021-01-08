import * as ECS from '../libs/pixi-ecs';
import { Assets, Layer, Messages, Tags } from './constants/enums'
import { LevelParser } from './level-parser';
import { MapLoader } from './map-loader';
import { Level } from './level';
import { StatusbarBuilder } from './statusbar/statusbar-builder';
import { Attribute } from './constants/enums';
import { PlayerState } from './player-state-updater';
import { ScreenWelcome } from './screen-welcome';
import { ScreenLevelName } from './screen-level-name';
import { ScreenGameOver } from './screen-game-over';
import { ScreenWinGame } from './screen-win-game';

export class StageManager extends ECS.Component {

    levels: Level[];

    currentLevelNumber: number;
    playerState: PlayerState;

    onInit() {
        //subscribe control messages
        this.subscribe(Messages.NEW_GAME);
        this.subscribe(Messages.RUN_LEVEL);
        this.subscribe(Messages.PLAYER_DEAD);
        this.subscribe(Messages.LEVEL_DONE);
        this.subscribe(Messages.GAME_RESET);

        //load level data from config file
        this.levels = this.loadLevelsFromFile();

        //assign global Component
        this.scene.addGlobalComponent(new ECS.KeyInputComponent());

        //load welcome screen
        this.loadWelcomeScreen();
    }

    onMessage(msg: ECS.Message) {
        switch (msg.action) {
            case Messages.NEW_GAME:
                this.loadNewGame();
                break;

            case Messages.RUN_LEVEL:
                this.runLevel();
                break;

            case Messages.PLAYER_DEAD:
                this.loadGameOverScreen(msg.data.coins)
                break;

            case Messages.GAME_RESET:
                this.loadWelcomeScreen();
                break;

            case Messages.LEVEL_DONE:
                this.loadNextLevel();
                break;
        }
    }
    private loadWelcomeScreen() {
        //clean up
        const statusBar = this.scene.findObjectByName(Layer.STATUSBAR);
        if (statusBar) {
            statusBar.destroy();
        }
        this.playerState = null;

        this.scene.addGlobalComponent(new ScreenWelcome());
    }

    private loadNewGame() {
        this.initGameStage();
        this.currentLevelNumber = 0;
        this.loadLevelNameScreen();
    }

    private loadLevelNameScreen() {
        //print level name, after player pushed space, this component send message RUN_LEVEL and this.runLevel() is called
        const levelName = this.levels[this.currentLevelNumber].name
        this.scene.addGlobalComponent(new ScreenLevelName(levelName));
    }

    private runLevel() {
        const mapLoader = new MapLoader(this.scene);
        mapLoader.loadLevel(this.levels[this.currentLevelNumber], this.scene, this.playerState);
        this.scene.stage.sortChildren();
    }

    private loadGameOverScreen(coins: number) {
        this.scene.findObjectByName(Layer.MAP_LAYER).destroy();
        this.scene.addGlobalComponent(new ScreenGameOver(coins));
        this.playerState = null;
    }

    private loadNextLevel() {
        this.currentLevelNumber++;

        const player = this.scene.findObjectByTag(Tags.PLAYER);
        this.playerState = player.getAttribute(Attribute.PLAYER_STATE) as PlayerState;

        //cleanup
        this.scene.findObjectByName(Layer.MAP_LAYER).destroy();

        //if player win last level
        if (this.currentLevelNumber == this.levels.length) {
            this.scene.addGlobalComponent(new ScreenWinGame(this.playerState.coins));
        }
        else {
            this.loadLevelNameScreen();
        }
    }

    private initGameStage() {
        new StatusbarBuilder().build(this.scene);
    }

    private loadLevelsFromFile(): Level[] {
        const levelData = this.scene.app.loader.resources[Assets.LEVELS].data;

        //parse level data
        const parser = new LevelParser();
        const levels = parser.parse(levelData);

        return levels;
    }
}