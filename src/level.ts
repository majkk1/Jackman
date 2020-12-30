import * as ECS from '../libs/pixi-ecs';
import { BlockType } from './constants/enums'

export class LevelBuilder {
    name: string;
    sizeX: number = 0;
    sizeY: number = 0;
    tileTypesArr: BlockType[][] = [[]];

    build() {
        return new Level(this.name, this.sizeX, this.sizeY, this.tileTypesArr);
    }
}


export class Level {
    private _name: string;
    private _width: number;
    private _height: number;
    private _tileTypesArr: BlockType[][];
    private _map: ECS.Sprite[][] = [];

    constructor(name: string, width: number, height: number, tileTypesArr: BlockType[][]) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._tileTypesArr = tileTypesArr;
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
}