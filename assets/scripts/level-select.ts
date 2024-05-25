// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    level1Button: cc.Button = null;

    @property(cc.Button)
    level2Button: cc.Button = null;

    onLoad() {
        const level1ClickEventHandler = new cc.Component.EventHandler;
        level1ClickEventHandler.target = this.node;
        level1ClickEventHandler.component = "level-select"
        level1ClickEventHandler.handler = "loadLevel1";

        this.level1Button.clickEvents.push(level1ClickEventHandler);

        const level2ClickEventHandler = new cc.Component.EventHandler;
        level2ClickEventHandler.target = this.node;
        level2ClickEventHandler.component = "level-select"
        level2ClickEventHandler.handler = "loadLevel2";

        this.level2Button.clickEvents.push(level2ClickEventHandler);
    }

    loadLevel1() {
        cc.director.loadScene("Level-1");
    }

    loadLevel2() {
        cc.director.loadScene("Level-2");
    }
}
