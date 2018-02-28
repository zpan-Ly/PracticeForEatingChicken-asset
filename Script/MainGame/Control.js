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
        slider: {
            default: null,
            type: cc.Slider,
        },
        MusicControl: {
            default: null,  
            type: cc.Node,
        },
        interval: 1,
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
            cc.audioEngine.play(this.ak47, false, this.slider.progress*0.5);
            this.blood.node.opacity = 100; //打中空地飘红血
            this._score--;//打中空地降一分  
            this.updateScore();     
        },this);
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
        return cc.p(Math.random()*960-480,Math.random()*520-260);
    },

    update: function(dt){
        this.interval -= dt*0.008*(-0.01*this._score+1);

        if(typeof this._gameOver == "boolean" && this._gameOver==false){
            this._time += dt;
            if(this._time>this.interval){//每隔一段时间产生一只鸡
                this._time = 0;
                this._chicken[this._chickenNum] = this.spawnChicken();
                this._chickenNum++;
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

        this.MusicControl.getComponent("MusicControl").changeVolume(0);//关掉音乐
    },

    changeSlider: function(dist,tarx,tary){
        //volume=1/dist,当dist<1时设为1
        if(dist>100) 
            dist = 100;
        
        var volume = (1.90476190e-04)*dist*dist + (-2.90476190e-02)*dist + 1;

        this.slider.progress = volume;
        this.MusicControl.getComponent("MusicControl").changeVolume(volume);

        this.changeBlood(volume,tarx,tary);
    },

    changeBlood: function(volume,tarx,tary){
        var newBlood = cc.instantiate(this.bloodPrefab);
        this.node.addChild(newBlood);
        newBlood.setPosition(cc.p(tarx,tary));
        newBlood.setLocalZOrder(10);

        this.scheduleOnce(function() {
            newBlood.removeFromParent();
        },2);
    }
});
