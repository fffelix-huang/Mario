// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BackButton extends cc.Component {

    private _button: cc.Button;

    onLoad() {
        this._button = this.node.getComponent(cc.Button);

        const clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "back-button";
        clickEventHandler.handler = "loadGameScene";

        this._button.clickEvents.push(clickEventHandler);
    }

    loadGameScene() {
        cc.director.loadScene("Menu");
    }
}
