var Global = require('GlobalData');   

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
        locChangeButton: {
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
        music: cc.AudioClip,
        interval: 1,
        crosschairSpeed: 300,
        crosschairRadius: 100
    },

    onLoad() {
        this._time = -5;//6秒后游戏开始
        this._chicken = new Array();
        this._chickenNum = 0;
        this._gameOver = false;
        this._score = 0;
        this._crosschairDir = 0;//0代表准星没有移动
        this._locChangeButtonPreviousLocation = this.locChangeButton.node.getPosition();//触摸点固定位置

        cc.audioEngine.play(this.music,true,Global.musicVolume);

        this.setTouchEvent();
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
        return cc.p(Math.random()*960-480,Math.random()*460-230);
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

        cc.audioEngine.stopAll();//关掉音乐
    },

    changeSlider: function(dist,tarx,tary){
        //volume=1/dist,当dist<1时设为1
        if(dist>100) 
            dist = 100;
        
        var volume = (1.90476190e-04)*dist*dist + (-2.90476190e-02)*dist + 1;

        this.slider.progress = volume;
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

    setTouchEvent: function(){
        /*this.node.on(cc.Node.EventType.MOUSE_DOWN,function (event) {//枪声
            cc.audioEngine.play(this.ak47, false, Global.effectVolume);
            this.blood.node.opacity = 100; //打中空地飘红血
            this._score--;//打中空地降一分  
            this.updateScore();     
        },this);*/
        var sprite = this.locChangeButton;
        var startPos = cc.p(0,0);

        sprite.node.on(cc.Node.EventType.TOUCH_START, function(e){  
            startPos = cc.p(e.touch._point._x,e.touch._point._y);
            return true;  
        }.bind(this), this);  

        sprite.node.on(cc.Node.EventType.TOUCH_MOVE, function(e){  
            var move_x = e.touch._point.x - e.touch._prevPoint.x;  
            var move_y = e.touch._point.y - e.touch._prevPoint.y;  
            var tempx =  sprite.node.x + move_x;  
            var tempy = sprite.node.y + move_y;  

            var dist = Math.sqrt((tempx - this._locChangeButtonPreviousLocation.x)*
            (tempx - this._locChangeButtonPreviousLocation.x)+
            (tempy - this._locChangeButtonPreviousLocation.y)*
            (tempy - this._locChangeButtonPreviousLocation.y));
            if(dist > this.crosschairRadius){//触摸点的活动范围是有限的
                var scaleOfDist = this.crosschairRadius / dist;
                sprite.node.setPosition(
                    this._locChangeButtonPreviousLocation.x+(tempx-this._locChangeButtonPreviousLocation.x)*scaleOfDist,
                    this._locChangeButtonPreviousLocation.y+(tempy-this._locChangeButtonPreviousLocation.y)*scaleOfDist
                );
            }else{
                sprite.node.setPosition(tempx,tempy);
            }
        }.bind(this), this ); 

        sprite.node.on(cc.Node.EventType.TOUCH_END, function(e){  
            sprite.node.setPosition(this._locChangeButtonPreviousLocation);
        }.bind(this), this );  

        sprite.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e){  
            sprite.node.setPosition(this._locChangeButtonPreviousLocation);
        }.bind(this), this );  
    }
});
