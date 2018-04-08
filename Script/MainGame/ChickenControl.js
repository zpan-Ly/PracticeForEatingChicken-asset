var Global = require('GlobalData');   

cc.Class({
    extends: cc.Component,

    properties: {
        decrese: 0,
    },

    onLoad() {
        if(Global.gameMode == Global.MAINMODE)//使用此速度的模式为：职业吃鸡模式
            this.decrese = Global.MAINMODEDECREASE;
        else 
            this.decrese = Global.QUICKANDADVENTUREDECREASE;//使用此速度的模式为：快切模式，冒险模式

        this.addTouchEvent();
        this._isBiger = true;
        this.node.scale = 0;
        this._paused = false;
        this._haveDereaseHealthNum = false;
    },
    addTouchEvent: function(){
        this.node.on('fire', function (event) {
            if(this._paused) return;

            this.parentControl._score++;

            this.parentControl.updateScore();

            this.parentControl.newChickenBlood(this.node.x,this.node.y);
            
            this.scheduleOnce(function() {
                cc.audioEngine.play(this.parentControl.shotChickenMp3, false, Global.effectVolume);
            },0.2);

            this.node.active = false;

            this.parentControl._chicken[this.idInParentArray] = null;

            this.node.removeFromParent();
        },this);
    },

    update: function(){
        if(this._paused){
            return;
        }

        if(this._isBiger){
            if(this.node.scale < 0.1){
                this.node.scale += (this.decrese/255)*0.1;
            }else{
                this._isBiger = false;
            }
        }else{
            if(this.node.scale > 0){
                this.node.scale -= (this.decrese/255)*0.1;
            }else{
                if(Global.gameMode != Global.QUICKMODE && !this._haveDereaseHealthNum){//快切模式一只鸡没点钟后不会gameOver
                    this.parentControl.missOneChickenPartice.node.x = this.node.x;
                    this.parentControl.missOneChickenPartice.node.y = this.node.y;
                    this.parentControl.scheduleOnce(function() {
                        this.missOneChickenPartice.node.x = cc.winSize.width;
                        this.missOneChickenPartice.node.y = cc.winSize.height;//移出屏外
                    },0.5);

                    --this.parentControl.healthNum;
                    this.parentControl.initHP();
                    this._haveDereaseHealthNum = true;
                }
            }
        }
    },

    pauseAll: function(){
        this._paused = true;
    },
});
