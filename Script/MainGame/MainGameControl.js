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
        crosschairSpeed: 20,
        crosschairRadius: 100
    },

    onLoad() {
        this._time = -5;//6秒后游戏开始
        this._chicken = new Array();
        this._chickenNum = 0;
        this._gameOver = false;
        this._score = 0;
        this._crosschairDir = 0;
        this._crosschairDir2 = 0;
        this._isMovingCrossChair = false;
        this._movingSca = 0;
        var radius = 50;
        var widget = 100;
        this._locChangeButtonPreviousLocation = cc.p(widget-cc.winSize.width/2+radius,widget-320+radius);//触摸点固定位置

        this.crosschair.node.setPosition(cc.p(0,0));

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

        if(!this._isMovingCrossChair) return;
    
        this.crosschair.node.x += this.crosschairSpeed*Math.cos(this._crosschairDir)*dt*this._movingSca*this._crosschairDir2;
        this.crosschair.node.y += this.crosschairSpeed*Math.sin(this._crosschairDir)*dt*this._movingSca;
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
    setPosFromWin: function(pos){//定高下的策略
        var scal = 960 / cc.winSize.width;
        pos.x *= scal;
        pos.x -= 480;
        pos.y -= 320;
        return pos;
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
            startPos = this._locChangeButtonPreviousLocation;
            this._isMovingCrossChair = true;
            return true;  
        }.bind(this), this);  

        sprite.node.on(cc.Node.EventType.TOUCH_MOVE, function(e){  
            var move_x = e.touch._point.x - e.touch._prevPoint.x;  
            var move_y = e.touch._point.y - e.touch._prevPoint.y;  

            var scal = 960 / cc.winSize.width;
            var tempx =  sprite.node.x + move_x*scal;  
            var tempy = sprite.node.y + move_y*scal;  

            var dist = Math.sqrt((tempx - startPos.x)*
            (tempx - startPos.x)+
            (tempy - startPos.y)*
            (tempy - startPos.y));
            if(dist > this.crosschairRadius){//触摸点的活动范围是有限的
                var scaleOfDist = this.crosschairRadius / dist;
                sprite.node.setPosition(
                    startPos.x+(tempx-startPos.x)*scaleOfDist,
                    startPos.y+(tempy-startPos.y)*scaleOfDist
                );
            }else{
                sprite.node.setPosition(tempx,tempy);
            }
            this._movingSca = dist/100;
            if(this._movingSca>1) this._movingSca=1;

            tempx = (tempx-startPos.x);
            tempy = (tempy-startPos.y);

            if(-0.00001<tempx && tempx <0.00001) tempx = 0.00001;
            if(-0.00001<tempy && tempy <0.00001) tempy = 0.00001;

            var tempz = Math.sqrt(tempx*tempx+tempy*tempy);
            if(-0.00001<tempz && tempz <0.00001){
                return;
            }else{
                this._crosschairDir = Math.asin(tempy/tempz);
                this._crosschairDir2 = tempx>0?1:-1;
            }
        }.bind(this), this ); 

        sprite.node.on(cc.Node.EventType.TOUCH_END, function(e){  
            sprite.node.setPosition(this._locChangeButtonPreviousLocation);
            this._isMovingCrossChair = false;
            this._movingSca = 0;
        }.bind(this), this );  

        sprite.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e){  
            sprite.node.setPosition(this._locChangeButtonPreviousLocation);
            this._isMovingCrossChair = false;
            this._movingSca = 0;
        }.bind(this), this );  
    }
});
