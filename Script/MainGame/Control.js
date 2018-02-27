cc.Class({
    extends: cc.Component,

    properties: {
        failedLable: cc.Label,
        crosschair: cc.Sprite,
        chickenPrefab: {
            default: null,
            type: cc.Prefab
        },
        slider: cc.Slider,
        MusicControl: cc.Node,
        interval: 1,
    },

    onLoad() {
        cc._canvas.style.cursor = 'none';
        this.changePointer();//修改指针样式
    
        this._time = 0;
        this._chicken = new Array();
        this._chickenNum = 0;

        this._gameOver = false;
        
        this._score = 0;
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
        return cc.p(Math.random()*900-450,Math.random()*580-290);
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

    changeSlider: function(dist){
        //volume=1/dist,当dist<1时设为1
        if(dist>100) 
            dist = 100;
        
        var volume = (1.90476190e-04)*dist*dist + (-2.90476190e-02)*dist + 1;

        this.slider.progress = volume;
        this.MusicControl.getComponent("MusicControl").changeVolume(volume);
    }
});
