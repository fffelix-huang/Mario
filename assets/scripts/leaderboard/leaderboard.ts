// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Leaderboard extends cc.Component {

    async onLoad() {
        const database = firebase.database();
        const data = await database.ref("leaderboard/level-1").get();

        cc.log("data:", data);
    }

    start() {

    }

    // update(deltaTime: number) {}
}
