import * as ECS from '../libs/pixi-ecs';
import { Level } from './level'
import { SCENE_WIDTH, TEXTURE_SCALE, PlayerState, Tags, Vector2, BlockType } from './constants'
import { PlayerController } from './player-controller'

export class Factory {

    loadLevel(level: Level, scene: ECS.Scene) {

        //create map
        let map = new ECS.Container('mapLayer');
        scene.stage.addChild(map);

        for (let y = 0; y < level.ySize; y++) {
            for (let x = 0; x < level.xSize; x++) {
                if (level.tileTypesArr[y][x] === BlockType.WALL) {
                    let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
                    sprite.scale.set(TEXTURE_SCALE);
                    sprite.position.x = x;
                    sprite.position.y = y;
                    sprite.addTag(Tags.GROUND);
                    map.addChild(sprite);
                }
            }
        }

        //add player
        new ECS.Builder(scene)
            .anchor(0, 0)
            .localPos(7, 7)
            .withTag(Tags.PLAYER)
            .asSprite(this.createTexture(32, 0, 32, 32))
            .withParent(scene.stage)
            .withComponent(new PlayerController())
            .withAttribute('speed', Vector2)
            .withAttribute('onGround', true)
            .withAttribute('sideCol', false)
            .withAttribute('jumpTime', 0)
            .withAttribute('playerState', PlayerState.STAND)
            .scale(TEXTURE_SCALE)
            .build();

        // add global components
        scene.addGlobalComponent(new ECS.KeyInputComponent());
    }

    // loadLevel(scene: ECS.Scene) {
    //     // init the scene and run your game
    //     //add map
    //     let map = new ECS.Container('mapLayer');
    //     scene.stage.addChild(map);

    //     const sceneHeight = SCENE_WIDTH / (scene.app.view.width / scene.app.view.height)
    //     scene.assignGlobalAttribute('SCENE_HEIGHT', sceneHeight);

    //     for (let i = 0; i < SCENE_WIDTH; i++) {
    //         let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
    //         sprite.scale.set(TEXTURE_SCALE);
    //         sprite.position.x = i;
    //         sprite.position.y = sceneHeight - 1;
    //         sprite.addTag(Tags.GROUND);
    //         map.addChild(sprite);
    //     }

    //     for (let i = 0; i < Math.floor(2 * SCENE_WIDTH / 3); i++) {
    //         let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
    //         sprite.scale.set(TEXTURE_SCALE);
    //         sprite.position.x = i;
    //         sprite.position.y = sceneHeight - 5;
    //         sprite.addTag(Tags.GROUND);
    //         map.addChild(sprite);
    //     }

    //     for (let i = Math.ceil(3 * SCENE_WIDTH / 4); i < SCENE_WIDTH; i++) {
    //         let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
    //         sprite.scale.set(TEXTURE_SCALE);
    //         sprite.position.x = i;
    //         sprite.position.y = sceneHeight - 8;
    //         sprite.addTag(Tags.GROUND);
    //         map.addChild(sprite);
    //     }

    //     for (let i = Math.ceil(SCENE_WIDTH / 4); i < Math.ceil(3 * SCENE_WIDTH / 4); i++) {
    //         let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
    //         sprite.scale.set(TEXTURE_SCALE);
    //         sprite.position.x = i;
    //         sprite.position.y = sceneHeight - 11;
    //         sprite.addTag(Tags.GROUND);
    //         map.addChild(sprite);
    //     }

    //     let sprite2 = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
    //     sprite2.scale.set(TEXTURE_SCALE);
    //     sprite2.position.x = 2;
    //     sprite2.position.y = sceneHeight - 2;
    //     sprite2.addTag(Tags.GROUND);
    //     map.addChild(sprite2);

    //     let sprite = new ECS.Sprite('', this.createTexture(0, 0, 32, 32));
    //     sprite.scale.set(TEXTURE_SCALE);
    //     sprite.position.x = 14;
    //     sprite.position.y = sceneHeight - 2;
    //     sprite.addTag(Tags.GROUND);
    //     map.addChild(sprite);

    //     //add player
    //     new ECS.Builder(scene)
    //         .anchor(0, 0)
    //         .localPos(7, sceneHeight - 2)
    //         .withTag(Tags.PLAYER)
    //         .asSprite(this.createTexture(32, 0, 32, 32))
    //         .withParent(scene.stage)
    //         .withComponent(new PlayerController())
    //         .withAttribute('speed', Vector2)
    //         .withAttribute('onGround', true)
    //         .withAttribute('sideCol', false)
    //         .withAttribute('jumpTime', 0)
    //         .withAttribute('playerState', PlayerState.STAND)
    //         .scale(TEXTURE_SCALE)
    //         .build();

    //     // add global components
    //     scene.addGlobalComponent(new ECS.KeyInputComponent());

    // }

    private createTexture(offsetX: number, offsetY: number, width: number, height: number) {
        let texture = PIXI.Texture.from('spritesheet');
        texture = texture.clone();
        texture.frame = new PIXI.Rectangle(offsetX, offsetY, width, height);

        return texture;
    }
}