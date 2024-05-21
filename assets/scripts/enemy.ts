// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property()
    enemySpeed: number = 100;

    @property()
    changeDirectionInterval: number = 5;

    private _timeElapsed: number = 0;

    private _rigidBody: cc.RigidBody = null;
    
    private _direction: number = 1;


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

        this.node.x += this._direction * this.enemySpeed * deltaTime;
    }

    onBeginContact(contact, self, other) {
        if(other.node.group == "Wall") {
            this._direction *= -1;
        }

        if(other.node.name == "Player") {
            let normal = contact.getWorldManifold().normal;

            if(normal.y > 0) {
                this.node.destroy();
            }
        }
    }
}
