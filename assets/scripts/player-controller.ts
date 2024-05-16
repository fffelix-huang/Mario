// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class PlayerController extends cc.Component {

    @property()
    playerSpeed: number = 300;

    private _rigidBody: cc.RigidBody = null;

    private _physicManager: cc.PhysicsManager = null

    private _direction: number = 0; // -1: left, 0: nothing, 1: right

    private _leftKeyPressed: boolean = false;
    private _rightKeyPressed: boolean = false;

    private _fallDown: boolean = false;

    onLoad() {
        this._rigidBody = this.node.getComponent(cc.RigidBody);

        this._physicManager = cc.director.getPhysicsManager();
        this._physicManager.enabled = true;
        this._physicManager.gravity = cc.v2(0, -200);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        ;
    }

    update(deltaTime: number) {
        this.node.x += this.playerSpeed * this._direction * deltaTime;
        this.node.scaleX = (this._direction >= 0) ? 1 : -1;

        if(this._rigidBody.linearVelocity.y != 0) {
            this._fallDown = true;
        } else {
            this._fallDown = false;
        }
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

    public reborn(rebornPosition: cc.Vec3) {
        this.node.position = rebornPosition;
        this._rigidBody.linearVelocity = cc.v2(0, 0);
    }
}