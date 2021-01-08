import * as ECS from '../libs/pixi-ecs';
import { BlockType } from './constants/enums'

/**
 * Helper class to build level class
 */
export class LevelBuilder {
    name: string;       //name of the level
    sizeX: number = 0;  //size of the level
    sizeY: number = 0;
    tileTypesArr: BlockType[][] = [[]]; //map of blocktypes (chars) from asset file
    infoTexts: string[] = []; //texts for info boxes

    build() {
        return new Level(this.name, this.sizeX, this.sizeY, this.tileTypesArr, this.infoTexts);
    }
}

/**
 * This class holds whole level
 */
export class Level {
    private _name: string; //name of the level
    private _width: number; //size of the level
    private _height: number;
    private _tileTypesArr: BlockType[][]; //map of the level (in chars - loaded from asset file)
    private _infoTexts: string[] = []; //texts for info boxes
    private _map: ECS.Sprite[][] = []; //map of the level - sprites

    constructor(name: string, width: number, height: number, tileTypesArr: BlockType[][], infoTexts: string[]) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._tileTypesArr = tileTypesArr;
        this._infoTexts = infoTexts;
    }

    get name() {
        return this._name;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get tileTypesArr() {
        return this._tileTypesArr;
    }

    get map() {
        return this._map;
    }

    set map(map: ECS.Sprite[][]) {
        this._map = map;
    }

    get infoTexts() {
        return this._infoTexts;
    }
    set infoTexts(infoTexts: string[]) {
        this._infoTexts = infoTexts;
    }
}