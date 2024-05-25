// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapController extends cc.Component {

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    @property(cc.Node)
    coinNodeParent: cc.Node = null;

    onLoad() {
    }

    start() {
        let coinX = [-272, 160, 320, 480, 330, 315, 300, 285, 270, 175, 175, 160, 160, 145, 145, 130, 130, 115, 115, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500];
        let coinY = [-97, 0, 62, 123, 205, 205, 205, 205, 205, 270, 290, 270, 290, 270, 290, 270, 290, 270, 290, 340, 340, 340, 340, 340, 340, 340, 340, 340, 340, 340, 340];

        if(coinX.length != coinY.length) {
            cc.log("Coin prefab position error! Length doesn\'t match");
            cc.log("coinX length:", coinX.length);
            cc.log("coinY length:", coinY.length);
        } else {
            for(let i = 0; i < coinX.length; i++) {
                let newCoin = cc.instantiate(this.coinPrefab);
                newCoin.parent = this.coinNodeParent;
                newCoin.setPosition(cc.v2(coinX[i], coinY[i]));
            }
        }
    }

    update(deltaTime: number) {
    }
}
