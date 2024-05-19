// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Camera from "./camera";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Live extends cc.Component {

    @property(cc.Node)
    cameraNode: cc.Node = null;

    private _camera: Camera = null;

    private _label: cc.Label = null;

    onLoad() {
        this._camera = this.cameraNode.getComponent(Camera);

        this._label = this.node.getComponent(cc.Label);
    }

    start() {
    }

    update() {
        // Update position
        this.node.x = this.cameraNode.x - 450;
        this.node.y = this.cameraNode.y + 300;
    }
}
