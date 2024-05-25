// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import GameResultManager from "./game-result-manager";
import TimerCounter from "./timer-counter";

@ccclass
export default class Player extends cc.Component {

    @property()
    playerSpeed: number = 300;

    @property(cc.SpriteFrame)
    idleFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bigIdleFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    jumpFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bigJumpFrame: cc.SpriteFrame = null;

    @property(cc.Node)
    gameResultManagerNode: cc.Node = null;

    @property(cc.Node)
    timerNode: cc.Node = null;

    private _timer: TimerCounter;

    @property(cc.AudioClip)
    bgmAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    dieAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    killAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    jumpAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    winAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    loseAudio: cc.AudioClip = null;

    @property(cc.Node)
    rebornPosition: cc.Node = null;

    private _emptySpriteFrame: cc.SpriteFrame = null;

    private _gameResultManager: GameResultManager;

    private _rigidBody: cc.RigidBody = null;
    private _animation: cc.Animation = null;
    private _collider: cc.PhysicsBoxCollider = null;

    private _physicManager: cc.PhysicsManager = null

    private _direction: number = 0; // -1: left, 0: nothing, 1: right

    private _leftKeyPressed: boolean = false;
    private _rightKeyPressed: boolean = false;

    private _fallDown: boolean = false;

    private _invincible: boolean = false;
    private _onDeath: boolean = false;

    public numLives: number = 3;
    public numScore: number = 0;

    public powerUp: boolean = false;
    private _timeElapsed: number = 0;

    onLoad() {
        this._rigidBody = this.node.getComponent(cc.RigidBody);
        this._rigidBody.fixedRotation = true;

        this._animation = this.node.getComponent(cc.Animation);

        this._collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this._collider.enabled = true;

        this._physicManager = cc.director.getPhysicsManager();
        this._physicManager.enabled = true;

        this._gameResultManager = this.gameResultManagerNode.getComponent(GameResultManager);

        this._timer = this.timerNode.getComponent(TimerCounter);

        this._emptySpriteFrame = new cc.SpriteFrame;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.reborn();
    }

    start() {
        cc.audioEngine.stopAll();
        cc.audioEngine.playMusic(this.bgmAudio, true);
    }

    update(deltaTime: number) {
        // Check timeout
        if(this._timer.timeout()) {
            this.handleGameLose();
        }

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
            if(!this.powerUp) {
                this.getComponent(cc.Sprite).spriteFrame = this.jumpFrame;
            } else {
                this.getComponent(cc.Sprite).spriteFrame = this.bigJumpFrame;
            }
            return;
        }

        if(this._fallDown && this._direction == 0) {
            if(!this.powerUp) {
                this.getComponent(cc.Sprite).spriteFrame = this.jumpFrame;
            } else {
                this.getComponent(cc.Sprite).spriteFrame = this.bigJumpFrame;
            }
        } else {
            if(this._direction == 0) {
                if(!this.powerUp) {
                    this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
                } else {
                    this.getComponent(cc.Sprite).spriteFrame = this.bigIdleFrame;
                }
                this._animation.stop();
            } else if(!this.powerUp && !this._animation.getAnimationState("mario-walk").isPlaying) {
                this._animation.play("mario-walk");
            } else if(this.powerUp && !this._animation.getAnimationState("big-mario-walk").isPlaying) {
                this._animation.play("big-mario-walk");
            }
        }
    }

    public updateCollisionBox() {
        if(!this.powerUp) {
            this._collider.size = cc.size(16, 16);
            this._collider.offset = cc.v2(0, 0);
        } else {
            this._collider.size = cc.size(16, 26);
            this._collider.offset = cc.v2(0, 0);
        }
        this._collider.apply();
    }

    public handlePowerUp() {
        this.powerUp = true;
        this.updateCollisionBox();
    }

    public handleHealthUp() {
        this.numLives++;
    }

    public reborn() {
        let initialPositionNode = this.rebornPosition;

        this._rigidBody.linearVelocity = cc.v2(0, 0);

        this.node.setPosition(initialPositionNode.position);
        this.powerUp = false;
        this._invincible = false;
        this.updateCollisionBox();
    }

    clearSpriteFrame() {
        this.node.getComponent(cc.Sprite).spriteFrame = this._emptySpriteFrame;
    }

    public handleLoseLife() {
        if(this.powerUp) {
            this.powerUp = false;
            this.updateCollisionBox();

            this._invincible = true;

            this.schedule(this.clearSpriteFrame, 0.2);

            this.scheduleOnce(() => {
                this._invincible = false;
                this.node.active = true;

                this.unschedule(this.clearSpriteFrame);
            }, 3);

            return;
        }

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
                this.handleGameLose();
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

        cc.audioEngine.stopAll();
        cc.audioEngine.playEffect(this.winAudio, false);

        this._gameResultManager.setGameOver("You Win!");
    }

    public handleGameLose() {
        cc.audioEngine.stopAll();
        cc.audioEngine.playEffect(this.loseAudio, false);

        this._gameResultManager.setGameOver("You Lose!");
        this.node.active = false;
    }

    onBeginContact(contact, self, other) {
        if(other.node.group == "Enemy" || other.node.group == "EnemyFly") {
            let normal = contact.getWorldManifold().normal;
            contact.disabled = true;

            if(other.node.name == "Flower") {
                if(!this._invincible) {
                    this.handleLoseLife();
                }
            }

            if(normal.y < 0) {
                this.handleKillEnemy();
            } else {
                if(!this._invincible) {
                    this.handleLoseLife();
                }
            }
        }

        if(other.node.group == "Spike") {
            contact.disabled = true;

            this.handleLoseLife();
        }

        if(other.node.name == "Flag") {
            this.handleGameWin();
        }

        if(other.node.group == "Item") {
            contact.disabled = true;

            if(other.node.name == "Coin") {
                this.numScore += 30;
            }

            if(other.node.name == "PowerMushroom") {
                this.handlePowerUp();
            }

            if(other.node.name == "HealthMushroom") {
                this.handleHealthUp();
            }
        }
    }
}