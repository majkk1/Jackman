import { decodeLevelChar } from './constants/constants'
import { Level, LevelBuilder } from './level'

export class LevelParser {
    parse(data: string): Level[] {

        let levels: Level[] = [];
        let levelBuilder: LevelBuilder = null;

        const lines = data.split('\n').filter(line => line !== '');

        lines.forEach(line => {
            if (line.startsWith(':')) {
                if (levelBuilder) {
                    levels.push(levelBuilder.build());
                }
                levelBuilder = new LevelBuilder();
                levelBuilder.name = line.substr(1);
                return;
            }
            else if (line.match(/^\d\ /)) {
                levelBuilder.infoTexts.push(line.substr(2));
                return;
            }

            let xPos = 0;

            for (let character of line) {
                if (character.charCodeAt(0) < 32 || character.charCodeAt(0) > 126) {
                    continue;
                }

                let decodedCharacter = decodeLevelChar[character];
                if (decodedCharacter !== undefined) {
                    levelBuilder.tileTypesArr[levelBuilder.sizeY].push(decodedCharacter);
                }
                else {
                    throw Error(`Bad formating: ${character}`)
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