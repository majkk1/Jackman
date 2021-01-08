import * as ECS from '../../libs/pixi-ecs';
import { HEALTH_LIMIT, PLAYER_IMMORTALITY_TIME } from '../constants/constants';
import { Attribute, Messages, Tags } from '../constants/enums'
import { PlayerState } from './player-state-updater';
import { InfoboxController } from './infobox-controller';

/**
 * This component solves player collision with monsters/powerups/keys/infoboxes/exit door.
 */
export class PlayerCollision extends ECS.Component {
    
    playerBox: PIXI.Rectangle;
    lastCollisionMonster: number = 0;
    isOnInfobox: boolean = false;
    lastInfoboxColider: ECS.Container;
    lastInfoboxController: ECS.Component;

    onUpdate(delta: number, absolute: number) {
        this.playerBox = this.owner.getBounds();

        //check for collision with monsters 
        this.checkCollisionMonsters(absolute);

        //check for collision with powerups 
        this.checkCollisionPowerupsKeys();

        //check for collision with infobox
        this.checkCollisionInfobox();

        //check for collision with exit
        this.checkCollisionExitdoor();
    }

    private checkCollisionExitdoor() {
        const exit = this.scene.findObjectsByTag(Tags.EXIT_DOOR);
        const collider = this.collideWith(exit);

        if (collider) {
            this.sendMessage(Messages.LEVEL_DONE); //load next level
            collider.removeTag(Tags.EXIT_DOOR); //sent message only once
        }
    }

    private checkCollisionInfobox() {
        const infoBox = this.scene.findObjectsByTag(Tags.INFO);
        const collider = this.collideWith(infoBox);

        if (collider !== null) {
            //print message of this collider
            if (this.lastInfoboxColider !== collider) {
                //if collision with new collider, find or create controller
                let controller = collider.findComponentByName(InfoboxController.name);
                if (controller) {
                    //if this controller exists, reset its timer
                    this.sendMessage(Messages.RESET_INFOBOX, controller.id);
                }
                else {
                    //else create new controller
                    controller = new InfoboxController();
                    collider.asSprite().addComponent(controller);
                }
                this.lastInfoboxController = controller;
            }
        }
        else {
            if (this.lastInfoboxController) {
                //if go outside of infobox area, start timer to remove msg
                this.sendMessage(Messages.REMOVE_INFOBOX, this.lastInfoboxController.id);
                this.lastInfoboxController = null;
            }
        }
        this.lastInfoboxColider = collider;
    }

    private checkCollisionPowerupsKeys() {
        const powerups = this.scene.findObjectsByTag(Tags.POWERUP);
        const keys = this.scene.findObjectsByTag(Tags.KEY);

        const collider = this.collideWith([...powerups, ...keys]);

        if (collider !== null) {
            if (collider.hasTag(Tags.HEALTH_COIN)) {
                const health = this.owner.getAttribute<PlayerState>(Attribute.PLAYER_STATE).health;
                if (health < HEALTH_LIMIT) {
                    this.sendMessage(Messages.HEALTH_ADD);
                    collider.destroy();
                }
            }
            else if (collider.hasTag(Tags.COIN)) {
                this.sendMessage(Messages.COIN_ADD);
                collider.destroy();
            }
            else if (collider.hasTag(Tags.FLY)) {
                this.sendMessage(Messages.FLY_ENABLED);
                collider.destroy();
            }
            else if (collider.hasTag(Tags.DOUBLE_JUMP)) {
                this.sendMessage(Messages.DOUBLE_JUMP_ENABLED);
                collider.destroy();
            }
            else if (collider.hasTag(Tags.GUN)) {
                this.sendMessage(Messages.GUN_TAKE);
                collider.destroy();
            }
            else if (collider.hasTag(Tags.KEY)) {
                if (collider.hasTag(Tags.BLUE)) {
                    this.sendMessage(Messages.KEY_TAKE, Tags.BLUE);
                }
                else if (collider.hasTag(Tags.GREEN)) {
                    this.sendMessage(Messages.KEY_TAKE, Tags.GREEN);
                }
                else {
                    throw Error('Key sprite has not color tag set.');
                }
                collider.destroy();
            }
        }
    }

    private checkCollisionMonsters(absolute: number) {
        //don't detect collision for 1 sec after last detection
        if (this.lastCollisionMonster !== 0 && absolute - this.lastCollisionMonster > PLAYER_IMMORTALITY_TIME) {
            this.lastCollisionMonster = 0;
        }

        if (this.lastCollisionMonster == 0) {
            const monsters = this.scene.findObjectsByTag(Tags.MONSTER);

            if (this.collideWith(monsters) !== null) {
                this.lastCollisionMonster = absolute;
                this.sendMessage(Messages.HEALTH_REMOVE);
            }
        }
    }

    private collideWith(colidersArray: ECS.Container[]): ECS.Container | null {
        for (let collider of colidersArray) {
            const colliderBox = collider.getBounds();

            //check for collision with player
            let horizIntersection = this.horizIntersection(this.playerBox, colliderBox);
            let verIntersection = this.verIntersection(this.playerBox, colliderBox);
            let collides = (horizIntersection > 0 && verIntersection > 0);

            if (collides) {
                return collider;
            }
        }
        return null;
    }

    private horizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
        return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
    }

    private verIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle) {
        return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
    }
}