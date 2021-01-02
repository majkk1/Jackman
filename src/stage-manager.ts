import * as ECS from '../libs/pixi-ecs';
import { Assets, Layer, Messages } from './constants/enums'
import { LevelParser } from './level-parser';
import { MapLoader } from './map-loader';
import { Level } from './level';
import { StatusbarBuilder } from './statusbar/statusbar-builder';

export class StageManager extends ECS.Component {
    
    levels: Level[];
    currentLevelNumber: number;
    
    onInit(){
        //subscribe control messages
        this.subscribe(Messages.PLAYER_DEAD);;

        //load level data from config file
        this.levels = this.loadLevelsFromFile();
      
        //assign global Component
        this.scene.addGlobalComponent(new ECS.KeyInputComponent());

        this.initGameStage();

        //load first level
        this.currentLevelNumber = 0;
        this.loadLevel(this.currentLevelNumber);
    }

    onMessage(msg: ECS.Message){
        switch(msg.action){
            case Messages.PLAYER_DEAD:
                this.scene.findObjectByName(Layer.MAP_LAYER).destroy();
                this.loadLevel(this.currentLevelNumber);
        }
    }

    private initGameStage(){
        this.loadStatusbar();

    }

    private loadStatusbar(){
        new StatusbarBuilder().build(this.scene);
    }

    private loadLevelsFromFile(): Level[]{
        const levelData = this.scene.app.loader.resources[Assets.LEVELS].data;

		//parse level data
		const parser = new LevelParser();
        const levels = parser.parse(levelData);
        
        return levels;
    }

    private loadLevel(levelNumber: number){
        const mapLoader = new MapLoader();
        mapLoader.loadLevel(this.levels[levelNumber], this.scene);
        this.scene.stage.sortChildren();
    }
}