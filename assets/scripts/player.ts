// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property()
    playerSpeed: number = 300;

    @property(cc.SpriteFrame)
    idleFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    jumpFrame: cc.SpriteFrame = null;

    private _rigidBody: cc.RigidBody = null;
    private _animation: cc.Animation = null;

    private _physicManager: cc.PhysicsManager = null

    private _direction: number = 0; // -1: left, 0: nothing, 1: right

    private _leftKeyPressed: boolean = false;
    private _rightKeyPressed: boolean = false;

    private _fallDown: boolean = false;

    public numLives: number = 3;

    onLoad() {
        this._rigidBody = this.node.getComponent(cc.RigidBody);
        this._rigidBody.fixedRotation = true;

        this._animation = this.node.getComponent(cc.Animation);

        this._physicManager = cc.director.getPhysicsManager();
        this._physicManager.enabled = true;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        ;
    }

    update(deltaTime: number) {
        this.node.x += this.playerSpeed * this._direction * deltaTime;
        this.node.scaleX = (this._direction >= 0) ? 2 : -2;

        if(Math.abs(this._rigidBody.linearVelocity.y) > 1e-3) {
            this._fallDown = true;
        } else {
            this._fallDown = false;
        }

        this.playAnimation();
    }

    public setDirection(direction: number) {
        this._direction = direction;
    }

    onKeyDown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this._leftKeyPressed = true;
                this.setDirection(-1);
                break;
            case cc.macro.KEY.right:
                this._rightKeyPressed = true;
                this.setDirection(1);
                break;
            case cc.macro.KEY.up:
                this.playerJump(600);
                break;
        }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this._leftKeyPressed = false;

                if(this._rightKeyPressed) {
                    this.setDirection(1);
                } else {
                    this.setDirection(0);
                }

                break;
            case cc.macro.KEY.right:
                this._rightKeyPressed = false;

                if(this._leftKeyPressed) {
                    this.setDirection(-1);
                } else {
                    this.setDirection(0);
                }

                break;
            case cc.macro.KEY.up:
                break;
        }
    }

    public playerJump(velocity: number) {
        if(!this._fallDown) {
            this._rigidBody.linearVelocity = cc.v2(0, velocity);
        }
    }

    public playAnimation() {
        if(this._fallDown && this._direction == 0) {
            this.getComponent(cc.Sprite).spriteFrame = this.jumpFrame;
        } else {
            if(this._direction == 0) {
                this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
                this._animation.stop();
            } else if(!this._animation.getAnimationState("mario-walk").isPlaying) {
                this._animation.play("mario-walk");
            }
        }
    }

    public reborn(rebornPosition: cc.Vec3) {
        this.node.position = rebornPosition;
        this._rigidBody.linearVelocity = cc.v2(0, 0);
    }

    onBeginContact(contact, self, other) {
        if(other.node.group == "Enemy") {
            this.numLives--;
            this.reborn(cc.v3(-449.466, 285.328, 0));
        }
    }
}