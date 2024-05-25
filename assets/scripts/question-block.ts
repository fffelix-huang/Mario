// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class QuestionBlock extends cc.Component {

    @property(cc.SpriteFrame)
    disabledFrame: cc.SpriteFrame = null;

    @property(cc.Prefab)
    surprisePrefab: cc.Prefab = null;

    private _physicManager: cc.PhysicsManager = null;
    private _animation: cc.Animation = null;
    
    private _animationEnabled: boolean;

    onLoad() {
        this._physicManager = cc.director.getPhysicsManager();
        this._physicManager.enabled = true;

        this._animation = this.node.getComponent(cc.Animation);

        this._animationEnabled = true;
    }

    start() {
        ;
    }

    update(deltaTime: number) {
        if(this._animationEnabled) {
            if(!this._animation.getAnimationState("question-block").isPlaying) {
                this._animation.play("question-block");
            }
        } else {
            this.getComponent(cc.Sprite).spriteFrame = this.disabledFrame;
        }
    }

    onBeginContact(contact, self, other) {
        let normal = contact.getWorldManifold().normal;

        if(normal.y < 0) {
            this.handleHitFromBelow();
        }
    }

    onEndContact(contact, self, other) {
        ;
    }

    handleHitFromBelow() {
        // Stop animation
        if(this._animationEnabled) {
            this._animationEnabled = false;
            this._animation.stop();
            this.getComponent(cc.Sprite).spriteFrame = this.disabledFrame;

            let surpriseNode = cc.instantiate(this.surprisePrefab);
            surpriseNode.parent = cc.find("Canvas");
            
            let initialPosition = cc.v2(this.node.x, this.node.y + this.node.height * this.node.scaleY);
            surpriseNode.setPosition(initialPosition);
            surpriseNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 150);
        }
    }
}
