// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(cc.Button)
    startButton: cc.Button = null;

    @property(cc.Button)
    leaderboardButton: cc.Button = null;

    onLoad() {
        const startClickEventHandler = new cc.Component.EventHandler();
        startClickEventHandler.target = this.node;
        startClickEventHandler.component = "ui-manager"
        startClickEventHandler.handler = "loadLevelSelectScene";

        this.startButton.clickEvents.push(startClickEventHandler);

        const leaderboardClickEventHandler = new cc.Component.EventHandler();
        leaderboardClickEventHandler.target = this.node;
        leaderboardClickEventHandler.component = "ui-manager"
        leaderboardClickEventHandler.handler = "loadLeaderboardScene";

        this.leaderboardButton.clickEvents.push(leaderboardClickEventHandler);
    }

    start() {
    }

    loadLevelSelectScene() {
        cc.director.loadScene("Level-Select");
    }

    loadLeaderboardScene() {
        cc.director.loadScene("Leaderboard");
    }
}
