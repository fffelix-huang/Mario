// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartButton extends cc.Component {

    @property(cc.Button)
    private _button: cc.Button = null;

    onLoad () {
        this._button = this.node.getComponent(cc.Button);

        if(!this._button) {
            cc.warn(`StartButton.ts: Component cc.Button missing on node ${this.node.name}.`)
        }

        const clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "start-button"
        clickEventHandler.handler = "loadGameScene";

        this._button.clickEvents.push(clickEventHandler);
    }

    start () {
    }

    loadGameScene() {
        cc.log("clicked");
        cc.director.loadScene("Game");
    }

    // update (dt) {}
}
