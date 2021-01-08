import * as ECS from '../libs/pixi-ecs';
import { Level } from './level'
import { TEXTURE_SCALE } from './constants/constants'
import { Tags, BlockType, GlobalAttribute, Assets, Direction, Attribute, Layer } from './constants/enums'
import { PlayerController } from './game-components/player-controller'
import { PlayerCollision } from './game-components/player-collision'
import { PlayerState, PlayerStateUpdater } from './game-components/player-state-updater'
import { MonsterController } from './game-components/monster-controller'
import { Camera } from './game-components/camera'
import { TextureChanger } from './game-components/texture-changer';
import { SpritesheetInfo } from './constants/spritesheet';

/**
 * This is helper class to create map layer from Level class
 */
export class MapLoader {

    readonly scene;

    constructor(scene: ECS.Scene) {
        this.scene = scene;
    }

    loadLevel(level: Level, scene: ECS.Scene, playerState?: PlayerState) {
        scene.assignGlobalAttribute(GlobalAttribute.LEVEL, level);

        //create map layer
        let mapLayer = new ECS.Container(Layer.MAP_LAYER);
        scene.stage.addChild(mapLayer);

        //add background
        this.buildBackground(mapLayer, level);

        let playerX: number;
        let playerY: number;

        level.map = [];

        //load tiles
        for (let y = 0; y < level.height; y++) {
            level.map.push([]);
            for (let x = 0; x < level.width; x++) {
                let blockType = level.tileTypesArr[y][x];
                level.map[y][x] = null;

                if (blockType === undefined) {
                    throw Error(`Some chars are missing in map (position [${x},${y}])`)
                }

                if (blockType === BlockType.EMPTY) {
                    continue;
                }
                else if (blockType === BlockType.PLAYER) {
                    //add player
                    playerX = x;
                    playerY = y;
                }
                else if (blockType === BlockType.MONSTER) {
                    //add monster
                    this.buildMonster(x, y, scene);
                    continue;
                }
                else if (blockType.substring(0, 4) === BlockType.INFO) {
                    //add infoblock
                    this.buildInfo(x, y, level, blockType, mapLayer);
                    continue;
                }
                else {
                    //add anotherblock
                    this.buildSprite(x, y, level, blockType, mapLayer);
                }
            }
        }

        if (playerX === undefined || playerY === undefined) {
            throw Error(`Player not found on map ${level.name}`);
        }

        //build player - this starts the game
        this.buildPlayer(playerX, playerY, scene, playerState);
    }

    private addTags(sprite: ECS.Sprite, blockType: BlockType) {
        switch (blockType) {
            case BlockType.WALL:
                sprite.addTag(Tags.GROUND);
                break;

            case BlockType.HEALTH_COIN:
                sprite.addTag(Tags.POWERUP);
                sprite.addTag(Tags.HEALTH_COIN);
                break;

            case BlockType.COIN:
                sprite.addTag(Tags.POWERUP);
                sprite.addTag(Tags.COIN);
                break;

            case BlockType.FLY:
                sprite.addTag(Tags.POWERUP);
                sprite.addTag(Tags.FLY);
                break;

            case BlockType.DOUBLE_JUMP:
                sprite.addTag(Tags.POWERUP);
                sprite.addTag(Tags.DOUBLE_JUMP);
                break;

            case BlockType.GUN:
                sprite.addTag(Tags.POWERUP);
                sprite.addTag(Tags.GUN);
                break;

            case BlockType.BLUE_GATE:
                sprite.addTag(Tags.GROUND);
                sprite.addTag(Tags.GATE);
                sprite.addTag(Tags.BLUE);
                break;

            case BlockType.GREEN_GATE:
                sprite.addTag(Tags.GROUND);
                sprite.addTag(Tags.GATE);
                sprite.addTag(Tags.GREEN);
                break;

            case BlockType.BLUE_KEY:
                sprite.addTag(Tags.KEY);
                sprite.addTag(Tags.BLUE);
                break;

            case BlockType.GREEN_KEY:
                sprite.addTag(Tags.KEY);
                sprite.addTag(Tags.GREEN);
                break;

            case BlockType.EXIT_DOOR:
                sprite.addTag(Tags.EXIT_DOOR);
                break;
        }
    }

    private buildSprite(x: number, y: number, level: Level, blockType: BlockType, mapLayer: ECS.Container) {
        //build tile (which is not so special)
        const textureInfo = SpritesheetInfo[blockType];

        let sprite = new ECS.Sprite(blockType + ` [${x},${y}]`, this.createTexture(textureInfo.x, textureInfo.y, textureInfo.width, textureInfo.height));
        sprite.scale.set(TEXTURE_SCALE);
        sprite.position.x = x;
        sprite.position.y = y;
        this.addTags(sprite, blockType);
        mapLayer.addChild(sprite);

        if (!(sprite.hasTag(Tags.POWERUP) || sprite.hasTag(Tags.KEY) || sprite.hasTag(Tags.EXIT_DOOR))) {
            level.map[y][x] = sprite;
        }
    }

    private buildInfo(x: number, y: number, level: Level, blockType: BlockType, mapLayer: ECS.Container) {
        //build info tile
        let textureInfo = SpritesheetInfo[BlockType.INFO];
        let sprite = new ECS.Sprite(level.infoTexts[blockType.substring(4, 5)], this.createTexture(textureInfo.x, textureInfo.y, textureInfo.width, textureInfo.height));

        sprite.scale.set(TEXTURE_SCALE);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.addTag(Tags.INFO);
        mapLayer.addChild(sprite);
    }

    private buildPlayer(x: number, y: number, scene: ECS.Scene, playerState?: PlayerState) {
        let textureInfo = SpritesheetInfo[BlockType.PLAYER];
        new ECS.Builder(scene)
            .anchor(0, 0)
            .localPos(x, y)
            .withName(BlockType.PLAYER)
            .withTag(Tags.PLAYER)
            .asSprite(this.createTexture(textureInfo.x, textureInfo.y, textureInfo.width, textureInfo.height))
            .withParent(<ECS.Container>scene.stage.getChildByName(Layer.MAP_LAYER))
            .withComponent(new PlayerController())
            .withComponent(new PlayerCollision())
            .withComponent(new PlayerStateUpdater())
            .withComponent(new Camera())
            .withComponent(new TextureChanger())
            .withAttribute(Attribute.DIRECTION, Direction.LEFT)
            .withAttribute(Attribute.PLAYER_STATE, playerState)
            .scale(TEXTURE_SCALE)
            .build();
    }

    private buildMonster(x: number, y: number, scene: ECS.Scene) {
        let textureInfo = SpritesheetInfo[BlockType.MONSTER];
        new ECS.Builder(scene)
            .anchor(0, 0)
            .localPos(x, y)
            .withName(BlockType.MONSTER)
            .withTag(Tags.MONSTER)
            .asSprite(this.createTexture(textureInfo.x, textureInfo.y, textureInfo.width, textureInfo.height))
            .withParent(<ECS.Container>scene.stage.getChildByName(Layer.MAP_LAYER))
            .withComponent(new MonsterController())
            .withComponent(new TextureChanger())
            .scale(TEXTURE_SCALE)
            .build();
    }

    private createTexture(offsetX: number, offsetY: number, width: number, height: number) {
        let texture = PIXI.Texture.from(Assets.SPRITESHEET);
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(offsetX, offsetY, width, height);

        return texture;
    }

    private buildBackground(mapLayer: ECS.Container, level: Level) {
        let texture = PIXI.Texture.from(Assets.LEVEL_BACKGROUND).clone();
        texture.frame = new PIXI.Rectangle(0, 0, 1600, 1200);
        let background = new ECS.Sprite('background', texture);

        background.scale.set(TEXTURE_SCALE);
        background.width = level.width;
        background.height = level.height;
        mapLayer.addChild(background);
    }
}