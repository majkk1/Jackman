import * as ECS from '../libs/pixi-ecs';

export class BlinkingSprite extends ECS.Component {

    duration: number;
    startTime: number;

    constructor(duration: number) {
        super();

        this.duration = duration;
    }

    onInit() {
        this.startTime = Date.now();

        this.fixedFrequency = 30;
    }

    onFixedUpdate() {
        if (this.owner.visible) {
            this.owner.visible = false;
        }
        else {
            this.owner.visible = true;
        }

        const time = Date.now();
        if (time - this.startTime > this.duration) {
            this.owner.visible = true;
            this.finish();
        }
    }
}