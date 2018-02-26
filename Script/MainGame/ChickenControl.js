cc.Class({
    extends: cc.Component,

    properties: {
        failedLable: cc.Label,
        opacityDecrese: 0,
    },

    start () {
        this.addTouchEvent();
        this._score = 0;
        this._haveDone = false;//避免重复点击
    },

    addTouchEvent: function(){
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            if(this._haveDone == false){
                this.node.getComponent(cc.Sprite).enabled = false;//隐藏鸡
                this._haveDone = true;
                this.showChicken();//延时显示鸡
            }
        },this);
    },

    showChicken: function(){
        this._score += 1;
        this.opacityDecrese += 0.1;//分数越高难度越大
        this.failedLable.getComponent(cc.Label).string = "分数: "+this._score;

        //this.node.opacity = 255;//不再更新透明度      
        this.node.scale = 0.1;    
        
        this.scheduleOnce(function() {
            this.node.getComponent(cc.Sprite).enabled = true;
            
            this.node.x = Math.random()*900-450;
            this.node.y = Math.random()*580-290;

            this._haveDone = false;
        },Math.random()*0.5+0.7);
    },

    update: function(){
        if(this.node.getComponent(cc.Sprite).enabled == true){
            //this.node.opacity -= this.opacityDecrese;//不再更新透明度
            this.node.scale -= (this.opacityDecrese/255)*0.1;
        }
        if(this.node.scale <= 0.01){
            this.failed();
        }
    },

    failed: function(){
        if(this._score<5){
            this.failedLable.getComponent(cc.Label).string = "你这个菜鸡！";
        }else if(this._score<10){
            this.failedLable.getComponent(cc.Label).string = "继续努力！";
        }else if(this._score<15){
            this.failedLable.getComponent(cc.Label).string = "哎呦，不错哦！";
        }else if(this._score<20){
            this.failedLable.getComponent(cc.Label).string = "哇，大神在此！";
        }else{
            this.failedLable.getComponent(cc.Label).string = "不说了，收下我的膝盖！";
        }
        this.node.active = false;
    }
});
