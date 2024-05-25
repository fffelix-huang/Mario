// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI extends cc.Component {

    @property(cc.Button)
    signInButton: cc.Button = null;

    @property(cc.Button)
    registerButton: cc.Button = null;

    onLoad() {
        const signInClickEventHandler = new cc.Component.EventHandler();
        signInClickEventHandler.target = this.node;
        signInClickEventHandler.component = "ui"
        signInClickEventHandler.handler = "loadSignInScene";

        this.signInButton.clickEvents.push(signInClickEventHandler);

        const registerClickEventHandler = new cc.Component.EventHandler();
        registerClickEventHandler.target = this.node;
        registerClickEventHandler.component = "ui"
        registerClickEventHandler.handler = "loadRegisterScene";

        this.registerButton.clickEvents.push(registerClickEventHandler);
    }

    start() {
    }

    loadSignInScene() {
        cc.director.loadScene("Sign-In");
    }

    loadRegisterScene() {
        cc.director.loadScene("Register");
    }
}
