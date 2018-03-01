cc.Class({
    extends: cc.Component,

    properties: {
        chicken: cc.Sprite,
        label: cc.Label,
    },

    onLoad () {
        this.resultTime = 0;
        this.relaxTime = 100;

        this.scheduleOnce(function(){
            this.resultTime = 0;
            this.chicken.node.opacity = 255;
        },2);

        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
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
