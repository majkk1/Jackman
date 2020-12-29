import * as ECS from '../libs/pixi-ecs';
import { Level } from './level'
import { TEXTURE_SCALE, Tags, BlockType, GlobalAttribute, ASSET_RES } from './constants'
import { PlayerController } from './player-controller'
import { Camera } from './camera'

export class MapLoader {

    loadLevel(level: Level, scene: ECS.Scene) {

        //create map
        let map = new ECS.Container('mapLayer');
        scene.stage.addChild(map);

        let platformMap: ECS.Sprite[][] = [];

        for (let y = 0; y < level.ySize; y++) {
            platformMap.push([]);
            for (let x = 0; x < level.xSize; x++) {
                if (level.tileTypesArr[y][x] === BlockType.WALL) {
                    let sprite = new ECS.Sprite('', this.createTexture(0, 0, ASSET_RES, ASSET_RES));
                    sprite.scale.set(TEXTURE_SCALE);
                    sprite.position.x = x;
                    sprite.position.y = y;
                    sprite.addTag(Tags.GROUND);
                    map.addChild(sprite);
                    platformMap[y].push(sprite);
                }
                else {
                    platformMap[y].push(null);
                }
            }
        }

        scene.assignGlobalAttribute(GlobalAttribute.PLATFORM_MAP, platformMap);

        //add player
        new ECS.Builder(scene)
            .anchor(0, 0)
            .localPos(6, 4)
            .withTag(Tags.PLAYER)
            .asSprite(this.createTexture(32, 0, ASSET_RES, ASSET_RES))
            .withParent(scene.stage)
            .withComponent(new PlayerController())
            .withComponent(new Camera())
            .scale(TEXTURE_SCALE)
            .build();
        
        // add global components
        scene.addGlobalComponent(new ECS.KeyInputComponent());
    }

    private createTexture(offsetX: number, offsetY: number, width: number, height: number) {
        let texture = PIXI.Texture.from('spritesheet');
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(offsetX, offsetY, width, height);

        return texture;
    }
}