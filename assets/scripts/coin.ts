// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    @property(cc.AudioClip)
    soundEffect: cc.AudioClip = null;

    private _animation: cc.Animation;

    private onEat: boolean = false;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
    }

    start() {
    }

    update(deltaTime: number) {
        if(this.onEat) {
            return;
        }

        if(!this._animation.getAnimationState("coin").isPlaying) {
            this._animation.play("coin");
        }
    }
    
    handleEat() {
        this.onEat = true;

        this._animation.stop();
        this._animation.play("sparkle");

        cc.audioEngine.playEffect(this.soundEffect, false);

        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.3);
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "Player") {
            this.handleEat();
        }
    }
}
