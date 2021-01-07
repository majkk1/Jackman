import * as ECS from '../libs/pixi-ecs';
import { Assets, Layer, Messages, Tags } from './constants/enums'
import { LevelParser } from './level-parser';
import { MapLoader } from './map-loader';
import { Level } from './level';
import { StatusbarBuilder } from './statusbar/statusbar-builder';
import { Attribute } from './constants/enums';
import { PlayerState } from './player-state-updater';
import { ScreenLevelName } from './screen-level-name';

export class StageManager extends ECS.Component {

    levels: Level[];

    currentLevelNumber: number;
    playerState: PlayerState;

    onInit() {
        //subscribe control messages
        this.subscribe(Messages.RUN_LEVEL);
        this.subscribe(Messages.PLAYER_DEAD);
        this.subscribe(Messages.LEVEL_DONE);

        //load level data from config file
        this.levels = this.loadLevelsFromFile();

        //assign global Component
        this.scene.addGlobalComponent(new ECS.KeyInputComponent());

        this.initGameStage();

        //load first level
        this.currentLevelNumber = 0;
        this.loadLevelName();
    }

    onMessage(msg: ECS.Message) {
        console.log('msg: ',msg)
        switch (msg.action) {
            case Messages.RUN_LEVEL:
                this.runLevel();
                break;


            case Messages.PLAYER_DEAD:
                this.scene.findObjectByName(Layer.MAP_LAYER).destroy();
                this.playerState = null;
                this.runLevel();
                break;

            case Messages.LEVEL_DONE:
                this.currentLevelNumber++;

                const player = this.scene.findObjectByTag(Tags.PLAYER);
                this.playerState = player.getAttribute(Attribute.PLAYER_STATE) as PlayerState;

                //if player win last level
                if (this.currentLevelNumber == this.levels.length) {
                    //todo show end screen
                    this.currentLevelNumber = 0;
                }

                this.scene.findObjectByName(Layer.MAP_LAYER).destroy();
                this.loadLevelName();
                break;
        }
    }

    private initGameStage() {
        this.loadStatusbar();
    }

    private loadStatusbar() {
        new StatusbarBuilder().build(this.scene);
    }

    private loadLevelsFromFile(): Level[] {
        const levelData = this.scene.app.loader.resources[Assets.LEVELS].data;

        //parse level data
        const parser = new LevelParser();
        const levels = parser.parse(levelData);

        return levels;
    }

    private loadLevelName() {
        //print level name, after player pushed space, this component send message RUN_LEVEL and this.runLevel() is called
        const levelName = this.levels[this.currentLevelNumber].name
        this.scene.addGlobalComponent(new ScreenLevelName(levelName));
    }

    private runLevel() {
        const mapLoader = new MapLoader();
        mapLoader.loadLevel(this.levels[this.currentLevelNumber], this.scene, this.playerState);
        this.scene.stage.sortChildren();
    }
}