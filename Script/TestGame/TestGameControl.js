cc.Class({
    extends: cc.Component,

    properties: {
        chicken: cc.Sprite,
        label: cc.Label,
        music: cc.AudioClip,
        button: cc.Button,
    },

    onLoad () {
        this.resultTime = 0;
        this.relaxTime = 100;
        this._musicId = cc.audioEngine.play(this.music,true,1);

        this.scheduleOnce(function(){
            this.resultTime = 0;
            this.chicken.node.opacity = 255;
        },2);

        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            if(event._y > 575 && event._x > 895){
                return;
            }
            this.label.getComponent(cc.Label).string = "骗子，点早了！";
        },this);

        this.chicken.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            if(this.chicken.node.opacity <= 5){
                return;
            }

            event.stopPropagation();

            this.chicken.node.opacity = 0;

            this.label.getComponent(cc.Label).string = this.resultTime.toFixed(2)*1000+ " ms";

            this.relaxTime = Math.random()*2+1;
        },this)

        this.button.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            cc.audioEngine.stop(this._musicId);
        },this);
    },

    update (dt) {
        this.resultTime+=dt;
        this.relaxTime-=dt;

        if(this.relaxTime<=0){
            this.chicken.node.opacity = 255;
            this.resultTime = 0;
            this.relaxTime = 100;
        }
    },
});
