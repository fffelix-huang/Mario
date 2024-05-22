// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LiveCounter extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

    private _player: Player = null;
    
    private _label: cc.Label = null;

    onLoad() {
        this._player = this.playerNode.getComponent(Player);

        this._label = this.node.getComponent(cc.Label);
    }

    start() {
    }

    update() {
        // Update lives
        this._label.string = "" + this._player.numScore;
    }
}
