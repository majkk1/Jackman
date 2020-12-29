export class LevelBuilder {
	name: string;
	sizeX: number = 0;
	sizeY: number = 0;
	tileTypesArr: number[][] = [[]];

	build() {
		return new Level(this.name, this.sizeX, this.sizeY, this.tileTypesArr);
	}
}


export class Level {
    private _name: string;
    private _xSize: number;
    private _ySize: number;
    private _tileTypesArr: number[][];
    
    constructor(name: string, xSize: number, ySize: number, tileTypesArr: number[][]){
        this._name = name;
        this._xSize = xSize;
        this._ySize = ySize;
        this._tileTypesArr = tileTypesArr;
    }

    get name(){
        return this._name;
    }
    
    get xSize(){
        return this._xSize;
    }

    get ySize(){
        return this._ySize;
    }

    get tileTypesArr(){
        return this._tileTypesArr;
    }

}