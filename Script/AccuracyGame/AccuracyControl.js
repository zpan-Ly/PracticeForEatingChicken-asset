cc.Class({
    extends: cc.Component,

    properties: {
        failedLable: {
            default: null,
            type: cc.Label,
        },
        remainderLable: {
            default: null,
            type: cc.Label,
        },
        firstShowLabel: {
            default: null,
            type: cc.Label,
        },
        crosschair: {
            default: null,
            type: cc.Sprite,
        },
        chicken: {
            default: null,
            type: cc.Sprite
        },
        bloodPrefab: {
            default: null,
            type: cc.Prefab
        },
        ak47: {
            default: null,
            url: cc.AudioClip,
        },
        blood: {
            default: null,
            type: cc.Sprite,
        },
        interval: 2,
        maintainTime: 1,
        chickenSum: 20,
    },

    onLoad () {
        if(cc.sys.isBrowser){
            cc._canvas.style.cursor = 'none';//浏览器运行下隐藏鼠标，windows下不能使用这个方法。
        }
        this.changePointer();//修改指针样式

        this._time = -2;//3秒后游戏开始
        this._chicken = new Array();
        this._chickenNum = 0;
        this._gameOver = false;
        this._score = 0;
        this._maintainTime = 100;//这个数字代表一只鸡所能维持的剩余时间，初始设为较大
        this._isFirstShow = true;

        this.node.on(cc.Node.EventType.MOUSE_DOWN,function (event) {//枪声
            if(event._y > 575 && event._x > 835){
                return;
            }

            cc.audioEngine.play(this.ak47, false, 0.5);
            this.blood.node.opacity = 100; //打中空地飘红血
            this._score--;//打中空地降一分  
            this.updateScore();     
        },this);

        this.chicken.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            if(this._gameOver == true
            || this.chicken.node.opacity<5) return;

            this._score++;

            this.updateScore();

            event.stopPropagation()
            
            cc.audioEngine.play(this.ak47, false, 0.5);

            this.chicken.node.opacity = 0;

            this._maintainTime = 100;

            this.changeBlood(event._x-480,event._y-320);

            this.isFinalChicken();
        },this);
    },

    changePointer: function(){
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.crosschair.node.x = event.getLocationX() - 480;
            this.crosschair.node.y = event.getLocationY() - 320;
        },this);
        this.crosschair.node.setLocalZOrder(10);
    },

    changeBlood: function(tarx,tary){
        var newBlood = cc.instantiate(this.bloodPrefab);
        this.node.addChild(newBlood);
        newBlood.setPosition(cc.p(tarx,tary));
        newBlood.setLocalZOrder(10);

        this.scheduleOnce(function() {
            newBlood.removeFromParent();
        },2);
    },

    getNewchickenPosition: function(){
        return cc.p(Math.random()*960-480,Math.random()*500-250);
    },

    updateScore: function(){
        this.failedLable.getComponent(cc.Label).string = "分数: " + this._score;
    },

    update: function(dt){  
        this._maintainTime -= dt;
        if(this._maintainTime<0){
            this.aChickenFailed();
        }

        if(typeof this._gameOver == "boolean" && this._gameOver==false && this.chickenSum>0){//只要游戏还没结束，不停产鸡
            this._time += dt;
            if(this._time>this.interval){//每隔一段时间产生一只鸡
                this.chickenSum--;
                this.remainderLable.getComponent(cc.Label).string = "剩余恶鸡: "+this.chickenSum;
                this._time = 0;
                this.chicken.node.opacity = 255;
                this._maintainTime = this.maintainTime;
                var loc = this.getNewchickenPosition()
                this.chicken.node.setPosition(loc);

                if(this._isFirstShow == true){
                    this._isFirstShow = false;
                    this.firstShow(loc);
                }
            }
        }

        if (this.blood.node.opacity > 1) this.blood.node.opacity -= 1;//血量图透明度降低
    },

    aChickenFailed: function(){
        this._score--;
        this.updateScore();
        this._maintainTime=100;
        this.chicken.node.opacity = 0;
        this.isFinalChicken();
    },

    isFinalChicken: function(){
        if(this.chickenSum==0){
             this._gameOver = true;

            this.remainderLable.node.setLocalZOrder(100);//避免结果被挡住

            var rank = new Array(-15,-5,8,15);
            if(this._score<rank[0]){
                this.remainderLable.getComponent(cc.Label).string = "你输了，你这个菜鸡！\n不要轻易开枪";
            }else if(this._score<rank[1]){
                this.remainderLable.getComponent(cc.Label).string = "你输了，继续努力！\n一枪未中的后果是很严重的";
            }else if(this._score<rank[2]){
                this.remainderLable.getComponent(cc.Label).string = "虽败犹荣\n迅捷！准确！";
            }else if(this._score<rank[3]){
                this.remainderLable.getComponent(cc.Label).string = "接近大神中";
            }else{
                this.remainderLable.getComponent(cc.Label).string = "请收下我的膝盖！";
            }

            this.remainderLable.node.setPosition(cc.p(0,0));
        }
    },

    firstShow(loc){
        this.scheduleOnce(function(){
            this.firstShowLabel.node.x = -1000;
            this.firstShowLabel.node.y = -1000;//移除屏幕
        },0.6);
        var x = loc.x;
        var y = loc.y;
        if(x>=0 && y>=0){
            this.firstShowLabel.node.x = loc.x-30;
            this.firstShowLabel.node.y = loc.y-30;
            this.firstShowLabel.node.rotation = 45;
            return;
        }
        if(x>=0 && y<0){
            this.firstShowLabel.node.x = loc.x-30;
            this.firstShowLabel.node.y = loc.y+30;
            this.firstShowLabel.node.rotation = -45;
            return;
        }
        if(x<0 && y>=0){
            this.firstShowLabel.node.x = loc.x+30;
            this.firstShowLabel.node.y = loc.y-30;
            this.firstShowLabel.node.rotation = -45;
            return;
        }
        if(x<0 && y<0){
            this.firstShowLabel.node.x = loc.x+30;
            this.firstShowLabel.node.y = loc.y+30;
            this.firstShowLabel.node.rotation = 45;
            return;
        }
    }
});
