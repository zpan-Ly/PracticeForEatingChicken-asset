cc.Class({
    extends: cc.Component,

    properties: {
        decrese: 0,
    },

    onLoad() {
        this.addTouchEvent();
        this._isBiger = true;
        this.node.scale = 0;
        this._paused = false;
    },

    addTouchEvent: function(){
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            if(this._paused) return;

            this.parentControl._score++;
            this.parentControl.updateScore();
            this.node.active = false;

            this.changeMusic(event)

            this.removeFromParent();
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
                this.parentControl._gameOver = true;
            }
        }
    },

    pauseAll: function(){
        this._paused = true;
    },

    changeMusic: function(event){
        var dist = Math.sqrt( (event._x - this.node.x - 480)*(event._x - this.node.x - 480) + 
            (event._y - this.node.y - 320)*(event._y - this.node.y - 320) );
        this.parentControl.changeSlider(dist);
    }
});
