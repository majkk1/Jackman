import * as ECS from '../libs/pixi-ecs';
import { Assets, Layer, Messages, Tags } from './constants/enums'
import { LevelParser } from './level-parser';
import { MapLoader } from './map-loader';
import { Level } from './level';
import { StatusbarBuilder } from './statusbar/statusbar-builder';
import { Attribute } from './constants/enums';
import { PlayerState } from './game-components/player-state-updater';
import { ScreenWelcome } from './screens/screen-welcome';
import { ScreenLevelName } from './screens/screen-level-name';
import { ScreenGameOver } from './screens/screen-game-over';
import { ScreenWinGame } from './screens/screen-win-game';

/**
 * This is main (global) component which manages whole game. Initializations, loading levels, switching screens...
 */
export class StageManager extends ECS.Component {

    levels: Level[]; //array with levels

    currentLevelNumber: number; //number of current level
    playerState: PlayerState; //player health, coins, ammo, ...

    onInit() {
        //subscribe control messages
        this.subscribe(Messages.NEW_GAME);
        this.subscribe(Messages.RUN_LEVEL);
        this.subscribe(Messages.PLAYER_DEAD);
        this.subscribe(Messages.LEVEL_DONE);
        this.subscribe(Messages.GAME_RESET);

        //load level data from config file
        this.levels = this.loadLevelsFromFile();

        //assign keyinput global Component
        this.scene.addGlobalComponent(new ECS.KeyInputComponent());

        //load welcome screen
        this.loadWelcomeScreen();
    }

    onMessage(msg: ECS.Message) {
        switch (msg.action) {
            case Messages.NEW_GAME:
                //load new game from level 0
                this.loadNewGame();
                break;

            case Messages.RUN_LEVEL:
                //level-name screen enden - show loaded level
                this.runLevel();
                break;

            case Messages.PLAYER_DEAD:
                //player lost all hp, show game over screen
                this.loadGameOverScreen(msg.data.coins)
                break;

            case Messages.GAME_RESET:
                //player decided to reset game - to go to initial (welcome screen
                this.loadWelcomeScreen();
                break;

            case Messages.LEVEL_DONE:
                //player reached exit door of the current level, load next level
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

        //show welcome screen
        this.scene.addGlobalComponent(new ScreenWelcome());
    }

    //load first level
    private loadNewGame() {
        this.initGameStage(); //create status bar
        this.currentLevelNumber = 0;
        this.loadLevelNameScreen(); //display level-name screen of first level
    }

    private loadLevelNameScreen() {
        //print level name, after player pushed space, this component send message RUN_LEVEL and this.runLevel() is called
        const levelName = this.levels[this.currentLevelNumber].name
        this.scene.addGlobalComponent(new ScreenLevelName(levelName));
    }

    private runLevel() {
        //create level and run
        const mapLoader = new MapLoader(this.scene);
        mapLoader.loadLevel(this.levels[this.currentLevelNumber], this.scene, this.playerState);
        this.scene.stage.sortChildren();
    }

    private loadGameOverScreen(coins: number) {
        //destroy map and show game over screen
        this.scene.findObjectByName(Layer.MAP_LAYER).destroy();
        this.scene.addGlobalComponent(new ScreenGameOver(coins));
        this.playerState = null;
    }

    private loadNextLevel() {
        this.currentLevelNumber++;

        //save player state
        const player = this.scene.findObjectByTag(Tags.PLAYER);
        this.playerState = player.getAttribute(Attribute.PLAYER_STATE) as PlayerState;

        //cleanup (this remove also player object)
        this.scene.findObjectByName(Layer.MAP_LAYER).destroy();

        if (this.currentLevelNumber == this.levels.length) {
            //if player win last level - winner screen
            this.scene.addGlobalComponent(new ScreenWinGame(this.playerState.coins));
        }
        else {
            //else load next level
            this.loadLevelNameScreen();
        }
    }

    private initGameStage() {
        new StatusbarBuilder().build(this.scene);
    }

    private loadLevelsFromFile(): Level[] {
        //loads levels from assets
        const levelData = this.scene.app.loader.resources[Assets.LEVELS].data;

        //parse level data
        const parser = new LevelParser();
        const levels = parser.parse(levelData);

        return levels;
    }
}