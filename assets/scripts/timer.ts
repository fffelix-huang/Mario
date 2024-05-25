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

    @property(cc.Node)
    cameraNode: cc.Node = null;

    update() {
        // Update position
        this.node.x = this.cameraNode.x;
        this.node.y = this.cameraNode.y + 300;
    }
}
