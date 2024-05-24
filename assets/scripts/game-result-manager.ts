// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Timer from "./timer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameResultManager extends cc.Component {

    @property(cc.Node)
    cameraNode: cc.Node = null;

    @property(cc.Node)
    backButtonNode: cc.Node = null;

    @property(cc.Node)
    gameResultLabelNode: cc.Node = null;

    private _gameResultLabel: cc.Label;

    @property(cc.Node)
    timerNode: cc.Node = null;

    private _timer: Timer;
    
    onLoad() {
        this.node.active = false;

        this._gameResultLabel = this.gameResultLabelNode.getComponent(cc.Label);

        this._timer = this.timerNode.getComponent(Timer);
    }

    update() {
        this.node.setPosition(this.cameraNode.position);
    }

    setGameOver(result: string) {
        this._timer.stopTimer();

        this._gameResultLabel.string = result;
        this.node.active = true;
        this.gameResultLabelNode.active = true;
    }
}
