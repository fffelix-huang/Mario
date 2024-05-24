// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Camera from "./camera";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Timer extends cc.Component {

    @property()
    initialTime: number = 0;

    @property(cc.Node)
    cameraNode: cc.Node = null;

    private _camera: Camera = null;

    private _label: cc.Label = null;

    private secondsRemain: number = 0;

    onLoad() {
        this._camera = this.cameraNode.getComponent(Camera);

        this._label = this.node.getComponent(cc.Label);

        this.secondsRemain = this.initialTime;
    }

    private updateTimer() {
        if(this.secondsRemain == 0) {
            return;
        }

        this.secondsRemain--;
        this._label.string = "" + this.secondsRemain;
    }

    public stopTimer() {
        this.unschedule(this.updateTimer);
    }

    public timeout() {
        return this.secondsRemain == 0;
    }

    start() {
        this.updateTimer();

        this.schedule(this.updateTimer, 1);
    }

    update() {
        // Update position
        this.node.x = this.cameraNode.x;
        this.node.y = this.cameraNode.y + 270;
    }
}
