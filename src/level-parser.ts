import { BlockType } from './constants'
import { Level, LevelBuilder } from './level'

const decodeLvlChar = {
    '.': BlockType.EMPTY,
    '#': BlockType.WALL
}

export class LevelParser {
    parse(data: string) {

        let levels: Level[] = [];

        const lines = data.split('\n').filter(line => line !== '');

        let levelBuilder: LevelBuilder = null;

        lines.forEach(line => {
            if (line.startsWith(':')) {
                if (levelBuilder) {
                    levels.push(levelBuilder.build());
                }
                levelBuilder = new LevelBuilder();
                levelBuilder.name = line.substr(1);
                return;
            }

            let xPos = 0;

            for (let character of line) {
                if (character.charCodeAt(0) < 32 || character.charCodeAt(0) > 126) {
                    continue;
                }

                let decodedCharacter = decodeLvlChar[character];
                if (decodedCharacter !== undefined) {

                    levelBuilder.tileTypesArr[levelBuilder.sizeY].push(decodedCharacter);
                }

                if (levelBuilder.sizeY === 0) {
                    levelBuilder.sizeX = xPos + 1;
                }
                xPos++;
            }

            if (xPos !== 0) {
                levelBuilder.tileTypesArr.push(new Array());
                levelBuilder.sizeY++;
            }

        });

        if (levelBuilder) {
            levels.push(levelBuilder.build());
        }

        return levels;
    }
}