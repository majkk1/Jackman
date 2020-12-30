import * as ECS from '../libs/pixi-ecs';
import { Level } from './level'
import { TEXTURE_SCALE, ASSET_RES, } from './constants/constants'
import { Tags, BlockType, GlobalAttribute, Assets, Direction, Attribute } from './constants/enums'
import { PlayerController } from './player-controller'
import { MonsterController } from './monster-controller'
import { MonsterCollision } from './monster-collision'
import { Camera } from './camera'
import { TextureChanger } from './texture-changer';

export class MapLoader {

    loadLevel(level: Level, scene: ECS.Scene) {

        //create map
        let map = new ECS.Container('mapLayer');
        scene.stage.addChild(map);

        for (let y = 0; y < level.height; y++) {
            level.map.push([]);
            for (let x = 0; x < level.width; x++) {
                if (level.tileTypesArr[y][x] === BlockType.WALL) {
                    let sprite = new ECS.Sprite('', this.createTexture(0, 0, ASSET_RES, ASSET_RES));
                    sprite.scale.set(TEXTURE_SCALE);
                    sprite.position.x = x;
                    sprite.position.y = y;
                    sprite.addTag(Tags.GROUND);
                    map.addChild(sprite);
                    level.map[y].push(sprite);
                }
                else if (level.tileTypesArr[y][x] === BlockType.PLAYER) {
                    //add player
                    new ECS.Builder(scene)
                        .anchor(0, 0)
                        .localPos(x, y)
                        .withTag(Tags.PLAYER)
                        .asSprite(this.createTexture(0, 32, ASSET_RES, ASSET_RES))
                        .withParent(scene.stage)
                        .withComponent(new PlayerController())
                        .withComponent(new Camera())
                        .withComponent(new TextureChanger(0, 32))
                        .withAttribute(Attribute.DIRECTION, Direction.LEFT)
                        .scale(TEXTURE_SCALE)
                        .build();
                    level.map[y].push(null);
                }
                else if (level.tileTypesArr[y][x] === BlockType.MONSTER) {
                    new ECS.Builder(scene)
                        .anchor(0, 0)
                        .localPos(x, y)
                        .withTag(Tags.MONSTER)
                        .asSprite(this.createTexture(0, 64, ASSET_RES, ASSET_RES))
                        .withParent(scene.stage)
                        .withComponent(new MonsterController())
                        .withComponent(new MonsterCollision())
                        .withComponent(new TextureChanger(0, 64))
                        .withAttribute(Attribute.DIRECTION, Direction.LEFT)
                        .scale(TEXTURE_SCALE)
                        .build();
                    level.map[y].push(null);
                }
                else {
                    level.map[y].push(null);
                }
            }
        }

        scene.assignGlobalAttribute(GlobalAttribute.LEVEL, level);

        // add global components
        scene.addGlobalComponent(new ECS.KeyInputComponent());
    }

    private createTexture(offsetX: number, offsetY: number, width: number, height: number) {
        let texture = PIXI.Texture.from(Assets.SPRITESHEET);
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(offsetX, offsetY, width, height);

        return texture;
    }
}