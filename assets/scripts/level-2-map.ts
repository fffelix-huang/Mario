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

    @property(cc.Prefab)
    flowerPrefab: cc.Prefab = null;

    @property(cc.Node)
    flowerNodeParent: cc.Node = null;

    onLoad() {
    }

    start() {
        this.initCoins();
        this.initFlowers();
    }

    initCoins() {
        let coinX = [-100, -50, 0, 50, 100, 150, 200, 250, 300, -100, -50, 0, 50, 100, 150, 200, 250, 300];
        let coinY = [-350, -350, -350, -350, -350, -350, -350, -350, -350, -300, -300, -300, -300, -300, -300, -300, -300, -300];

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

    initFlowers() {
        let flowerX = [];
        let flowerY = [];

        if(flowerX.length != flowerY.length) {
            cc.log("Flower prefab position error! Length doesn\'t match");
            cc.log("flowerX length:", flowerX.length);
            cc.log("flowerY length:", flowerY.length);
        } else {
            for(let i = 0; i < flowerX.length; i++) {
                let newFlower = cc.instantiate(this.flowerPrefab);
                newFlower.parent = this.flowerNodeParent;
                newFlower.setPosition(cc.v2(flowerX[i], flowerY[i]));
            }
        }
    }

    update(deltaTime: number) {
    }
}
