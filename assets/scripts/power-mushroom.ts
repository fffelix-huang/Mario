// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PowerMushroom extends cc.Component {

    @property()
    mushroomSpeed: number = 150;

    @property()
    changeDirectionInterval: number = 5;

    @property(cc.AudioClip)
    powerUpAudio: cc.AudioClip = null;

    private _rigidBody: cc.RigidBody = null;

    private _direction: number = 0;

    private _timeElapsed: number = 0;

    onLoad() {
        this._rigidBody = this.node.getComponent(cc.RigidBody);
        this._rigidBody.fixedRotation = true;
    }

    start() {

    }

    update(deltaTime: number) {
        if(Math.abs(this._rigidBody.linearVelocity.y) > 1e-3) {
            this._direction = 0;
            return;
        }

        if(this._direction == 0) {
            this._direction = 1;
        }

        this._timeElapsed += deltaTime;

        if(this._timeElapsed >= this.changeDirectionInterval) {
            this._direction *= -1;
            this._timeElapsed = 0;
        }

        this.node.x += this._direction * this.mushroomSpeed * deltaTime;
    }

    handlePowerUp() {
        cc.audioEngine.playEffect(this.powerUpAudio, false);

        this.node.destroy();
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "Player") {
            this.handlePowerUp();
        }
    }
}
