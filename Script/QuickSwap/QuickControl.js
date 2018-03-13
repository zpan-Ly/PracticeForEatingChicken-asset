cc.Class({
    extends: cc.Component,

    properties: {
        failedLable: {
            default: null,
            type: cc.Label,
        },
        crosschair: {
            default: null,
            type: cc.Sprite,
        },
        chickenPrefab: {
            default: null,
            type: cc.Prefab
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
        music: cc.AudioClip,
        interval: 2,
    },

    onLoad() {
        if(cc.sys.isBrowser){
            cc._canvas.style.cursor = 'none';//浏览器运行下隐藏鼠标，windows下不能使用这个方法。
        }
        this.changePointer();//修改指针样式

        this._time = -5;//6秒后游戏开始
        this._chicken = new Array();
        this._chickenNum = 0;
        this._gameOver = false;
        this._score = 0;

        this.node.on(cc.Node.EventType.MOUSE_DOWN,function (event) {//枪声
            if(event._y > 575 && event._x > 835){
                return;
            }

            cc.audioEngine.play(this.ak47, false, 0.8);
            this.blood.node.opacity = 100; //打中空地飘红血
            this._score--;//打中空地降一分  
            this.updateScore();     
        },this);

        cc.audioEngine.play(this.music,true,0.8);
    },

    changePointer: function(){
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.crosschair.node.x = event.getLocationX() - 480;
            this.crosschair.node.y = event.getLocationY() - 320;
        },this);
        this.crosschair.node.setLocalZOrder(10);
    },

    spawnChicken: function() {
        var newChicken = cc.instantiate(this.chickenPrefab);
        newChicken.getComponent('ChickenControl').parentControl = this;//为鸡设置父亲指针
        this.node.addChild(newChicken);
        newChicken.setPosition(this.getNewchickenPosition());
        newChicken.setLocalZOrder(9);
        return newChicken;
    },

    getNewchickenPosition: function(){
        return cc.p(Math.random()*960-480,Math.random()*500-250);
    },

    update: function(dt){
        if(typeof this._gameOver == "boolean" && this._gameOver==false){
            this._time += dt;
            if(this._time>this.interval){//每隔一段时间产生两只鸡
                this._time = 0;
                this._chicken[this._chickenNum++] = this.spawnChicken();
                this._chicken[this._chickenNum++] = this.spawnChicken();
            }
        }else{
            if(typeof this._gameOver == "boolean"){
                this.failed();
            }
        }

        if (this.blood.node.opacity > 1) this.blood.node.opacity -= 1;//血量图透明度降低
    },

    updateScore: function(){
        if(this._score<40)
            this.failedLable.getComponent(cc.Label).string = "分数: " + this._score;
        else{
            this.failedLable.getComponent(cc.Label).string = "真牛逼，分数: " + this._score;
        }
    },

    failed: function(){
        this.failedLable.node.setLocalZOrder(100);//避免结果被挡住

        for(i = 0;i<this._chickenNum;i++){//停止所有鸡
            if(this._chicken[i]){
                this._chicken[i].getComponent('ChickenControl').pauseAll();
            }
        }

        var rank = new Array(10,20,40,50);
        if(this._score<rank[0]){
            this.failedLable.getComponent(cc.Label).string = "你输了，你这个菜鸡！";
        }else if(this._score<rank[1]){
            this.failedLable.getComponent(cc.Label).string = "你输了，继续努力！";
        }else if(this._score<rank[2]){
            this.failedLable.getComponent(cc.Label).string = "虽败犹荣";
        }else if(this._score<rank[3]){
            this.failedLable.getComponent(cc.Label).string = "接近大神";
        }else{
            this.failedLable.getComponent(cc.Label).string = "不说了，收下我的膝盖！";
        }

        cc.audioEngine.stopAll();//关掉音乐
    },

    changeBlood: function(tarx,tary){
        var newBlood = cc.instantiate(this.bloodPrefab);
        this.node.addChild(newBlood);
        newBlood.setPosition(cc.p(tarx,tary));
        newBlood.setLocalZOrder(10);

        this.scheduleOnce(function() {
            newBlood.removeFromParent();
        },2);
    }
});