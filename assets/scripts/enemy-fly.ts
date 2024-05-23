// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property()
    startX: number = 0;

    @property()
    startY: number = 0;

    @property()
    endX: number = 0;

    @property()
    endY: number = 0;

    @property()
    animationDelay: number = 1;

    @property(cc.SpriteFrame)
    deadFrame: cc.SpriteFrame = null;

    private _animation: cc.Animation = null;
    private _rigidBody: cc.RigidBody = null;

    private _onDead: boolean = false;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);

        this._rigidBody = this.node.getComponent(cc.RigidBody);
        this._rigidBody.fixedRotation = true;

        this.node.setPosition(this.startX, this.startY);
    }

    start() {
        this.enemyFly();
    }

    update() {
        if(this._onDead) {
            return;
        }

        if(!this._animation.getAnimationState("goomba-fly").isPlaying) {
            this._animation.play("goomba-fly");
        }
    }

    handleDead() {
        this._onDead = true;
        this.node.group = "Transparent";
        this._animation.stop();
        this.node.getComponent(cc.Sprite).spriteFrame = this.deadFrame;

        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.3);
    }

    public enemyFly() {
        let easeRate = 3.0;

        let flyAction = cc.repeatForever(
            cc.sequence(
                cc.moveTo(this.animationDelay, this.startX, this.startY).easing(cc.easeInOut(easeRate)),
                cc.moveTo(this.animationDelay, this.endX, this.endY).easing(cc.easeInOut(easeRate)),
            )
        );

        this.node.runAction(flyAction);
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "Player") {
            let normal = contact.getWorldManifold().normal;

            if(normal.y > 0) {
                this.handleDead();
            }
        }
    }
}
