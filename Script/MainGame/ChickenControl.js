var Global = require('GlobalData');   

cc.Class({
    extends: cc.Component,

    properties: {
        decrese: 0,
    },

    onLoad() {
        var gameModeMainGame = 0;
        if(Global.gameMode == gameModeMainGame)//使用此速度的模式为：职业吃鸡模式
            this.decrese = 5;
        else 
            this.decrese = 7;//使用此速度的模式为：快切模式，冒险模式

        this.addTouchEvent();
        this._isBiger = true;
        this.node.scale = 0;
        this._paused = false;
    },
    addTouchEvent: function(){
        this.node.on('fire', function (event) {
            if(this._paused) return;

            this.parentControl._score++;

            this.parentControl.updateScore();

            this.parentControl.changeBlood(this.node.x,this.node.y);
            
            if(this.parentControl.slider)
                cc.audioEngine.play(this.parentControl.ak47, false, this.parentControl.slider.progress*0.5);
            else
                cc.audioEngine.play(this.parentControl.ak47, false, Global.effectVolume);

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
                var gameModeOfQuickSwap = 2;
                if(Global.gameMode != gameModeOfQuickSwap)//快切模式一只鸡没点钟后不会gameOver
                    this.parentControl._gameOver = true;
            }
        }
    },

    pauseAll: function(){
        this._paused = true;
    },
});
