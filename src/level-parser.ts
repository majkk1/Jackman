import { decodeLevelChar } from './constants/constants'
import { Level, LevelBuilder } from './level'

/**
 * Helper class to parse file with levels
 */
export class LevelParser {
    parse(data: string): Level[] {

        let levels: Level[] = [];
        let levelBuilder: LevelBuilder = null;

        const lines = data.split('\n').filter(line => line !== '');

        lines.forEach(line => {
            if (line.startsWith(':')) {
                //this is levelname
                if (levelBuilder) {
                    levels.push(levelBuilder.build());
                }
                levelBuilder = new LevelBuilder();
                levelBuilder.name = line.substr(1);
                return;
            }
            else if (line.match(/^\d\ /)) {
                //this is line with text for info box
                levelBuilder.infoTexts.push(line.substr(2));
                return;
            }

            let xPos = 0;

            for (let character of line) {
                //it should be printable char
                if (character.charCodeAt(0) < 32 || character.charCodeAt(0) > 126) {
                    continue;
                }
                
                //decode char to blocktype and save it
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