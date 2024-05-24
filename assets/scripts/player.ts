// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import GameResultManager from "./game-result-manager";

@ccclass
export default class Player extends cc.Component {

    @property()
    playerSpeed: number = 300;

    @property(cc.SpriteFrame)
    idleFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    jumpFrame: cc.SpriteFrame = null;

    @property(cc.Node)
    gameResultManagerNode: cc.Node = null;

    @property(cc.AudioClip)
    bgmAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    dieAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    killAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    jumpAudio: cc.AudioClip = null;

    private _gameResultManager: GameResultManager;

    private _rigidBody: cc.RigidBody = null;
    private _animation: cc.Animation = null;
    private _collider: cc.Collider = null;

    private _physicManager: cc.PhysicsManager = null

    private _direction: number = 0; // -1: left, 0: nothing, 1: right

    private _leftKeyPressed: boolean = false;
    private _rightKeyPressed: boolean = false;

    private _fallDown: boolean = false;

    private _invincible: boolean = false;
    private _onDeath: boolean = false;

    public numLives: number = 3;
    public numScore: number = 0;

    onLoad() {
        this._rigidBody = this.node.getComponent(cc.RigidBody);
        this._rigidBody.fixedRotation = true;

        this._animation = this.node.getComponent(cc.Animation);

        this._collider = this.node.getComponent(cc.Collider);
        this._collider.enabled = true;

        this._physicManager = cc.director.getPhysicsManager();
        this._physicManager.enabled = true;

        this._gameResultManager = this.gameResultManagerNode.getComponent(GameResultManager);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.reborn();
        this._invincible = true;
    }

    start() {
        cc.audioEngine.stopAll();
        cc.audioEngine.playMusic(this.bgmAudio, true);
    }

    update(deltaTime: number) {
        if(!this._onDeath) {
            this.node.x += this.playerSpeed * this._direction * deltaTime;
            this.node.scaleX = (this._direction >= 0) ? 2 : -2;
        }

        if(Math.abs(this._rigidBody.linearVelocity.y) > 1e-3) {
            this._fallDown = true;
        } else {
            this._fallDown = false;
        }

        this.playAnimation();
    }

    public setDirection(direction: number) {
        this._direction = direction;
    }

    onKeyDown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this._leftKeyPressed = true;
                this.setDirection(-1);
                break;
            case cc.macro.KEY.right:
                this._rightKeyPressed = true;
                this.setDirection(1);
                break;
            case cc.macro.KEY.up:
                this.playerJump(600);
                break;
        }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this._leftKeyPressed = false;

                if(this._rightKeyPressed) {
                    this.setDirection(1);
                } else {
                    this.setDirection(0);
                }

                break;
            case cc.macro.KEY.right:
                this._rightKeyPressed = false;

                if(this._leftKeyPressed) {
                    this.setDirection(-1);
                } else {
                    this.setDirection(0);
                }

                break;
            case cc.macro.KEY.up:
                break;
        }
    }

    public playerJump(velocity: number) {
        if(!this._fallDown) {
            this._rigidBody.linearVelocity = cc.v2(0, velocity);
            
            cc.audioEngine.playEffect(this.jumpAudio, false);
        }
    }

    public playAnimation() {
        if(this._onDeath) {
            this._animation.stop();
            this.getComponent(cc.Sprite).spriteFrame = this.jumpFrame;
            return;
        }

        if(this._fallDown && this._direction == 0) {
            this.getComponent(cc.Sprite).spriteFrame = this.jumpFrame;
        } else {
            if(this._direction == 0) {
                this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
                this._animation.stop();
            } else if(!this._animation.getAnimationState("mario-walk").isPlaying) {
                this._animation.play("mario-walk");
            }
        }
    }

    public reborn() {
        let initialPositionNode = cc.find("Canvas/InitialPosition");

        this._rigidBody.linearVelocity = cc.v2(0, 0);

        this.node.setPosition(initialPositionNode.position);
    }

    public handleLoseLife() {
        this._onDeath = true;
        this._collider.enabled = false;
        this._rigidBody.enabled = false;
        this._rigidBody.linearVelocity = cc.v2(0, 500);

        cc.audioEngine.playEffect(this.dieAudio, false);

        this.playAnimation();

        this.scheduleOnce(() => {
            this.numLives--;
            this._invincible = true;

            if(this.numLives == 0) {
                this._gameResultManager.setGameOver("You Lose!");
                this.node.active = false;
            } else {
                this.reborn();
            }

            this._onDeath = false;
            this._collider.enabled = true;
            this._rigidBody.enabled = true;
        }, 1);
    }

    public handleKillEnemy() {
        this._rigidBody.linearVelocity = cc.v2(0, 400);
        this.numScore += 50;

        cc.audioEngine.playEffect(this.killAudio, false);
    }

    public handleGameWin() {
        this.node.active = false;
        this._gameResultManager.setGameOver("You Win!");
    }

    onBeginContact(contact, self, other) {
        if(other.node.group == "Enemy" || other.node.group == "EnemyFly") {
            let normal = contact.getWorldManifold().normal;
            contact.disabled = true;

            if(normal.y < 0) {
                this.handleKillEnemy();
            } else {
                this.handleLoseLife();
            }
        }

        if(other.node.group == "Spike") {
            contact.disabled = true;

            this.handleLoseLife();
        }

        if(other.node.name == "Flag") {
            this.handleGameWin();
        }
    }

    onEndContact(contact, self, other) {
    }
}