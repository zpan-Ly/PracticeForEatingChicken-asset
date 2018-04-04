var Global = require('GlobalData');   

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
        this._musicId = cc.audioEngine.play(this.music,true,Global.musicVolume);

        this.scheduleOnce(function(){
            this.resultTime = 0;
            this.chicken.node.opacity = 255;
        },2);

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if(this.chicken.node.opacity<=5){
                this.label.getComponent(cc.Label).string = "骗子，点早了！";
                return;
            }

            var eventLocation = cc.p(event.getLocation().x-cc.winSize.width/2,
                                    event.getLocation().y-cc.winSize.height/2);
            var dist = this.getDist(eventLocation,cc.p(this.chicken.node.x,this.chicken.node.y));
            if(dist<859/2/2){
                this.chicken.node.emit("fire",{});
            }
        },this);

        this.chicken.node.on("fire", function (event) {
            this.chicken.node.opacity = 0;

            this.label.getComponent(cc.Label).string = this.resultTime.toFixed(2)*1000+ " ms";

            this.relaxTime = Math.random()*2+1;
        },this)
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
    getDist: function(pos1,pos2){
        return Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x)+
                        (pos1.y-pos2.y)*(pos1.y-pos2.y));
    },
});
