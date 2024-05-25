// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    
    private _animation: cc.Animation;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
    }

    update() {
        cc.log(!this._animation.getAnimationState("flower").isPlaying);
        if(!this._animation.getAnimationState("flower").isPlaying) {
            this._animation.play("flower");
        }
    }
}
