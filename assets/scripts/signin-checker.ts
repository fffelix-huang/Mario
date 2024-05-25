// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SignInChecker extends cc.Component {

    @property(cc.Node)
    usernameInput: cc.Node = null;

    @property(cc.Node)
    emailInput: cc.Node = null;

    @property(cc.Node)
    passwordInput: cc.Node = null;

    private usernameEditBox: cc.EditBox;
    private emailEditBox: cc.EditBox;
    private passwordEditBox: cc.EditBox;

    private _button: cc.Button;

    onLoad() {
        if(this.usernameInput) {
            this.usernameEditBox = this.usernameInput.getComponent(cc.EditBox);
        }

        this.emailEditBox = this.emailInput.getComponent(cc.EditBox);
        this.passwordEditBox = this.passwordInput.getComponent(cc.EditBox);
    
        this._button = this.node.getComponent(cc.Button);

        const clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "signin-checker";
        clickEventHandler.handler = "loadMenuScene";

        this._button.clickEvents.push(clickEventHandler);

    }

    start() {
    }

    update() {
        let valid = this.checkInputs();

        this._button.interactable = valid;
    }

    checkInputs() {
        const email = this.emailEditBox.string;
        const password = this.passwordEditBox.string;

        if(password.length < 6) {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return false;
        }

        if(this.usernameInput) {
            const username = this.usernameEditBox.string;

            if(username.length == 0) {
                return false;
            }
        }

        return true;
    }

    loadMenuScene() {
        cc.director.loadScene("Menu");
    }
}
