var Global = require('GlobalData');   

cc.Class({
    extends: cc.Component,

    properties: {
        failedLabel: {
            default: null,
            type: cc.Label,
        },
        commentLabel: {
            default: null,
            type: cc.Label,
        },
        remainderLabel: {
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
        gameOverLayer: {
            default: null,
            type: cc.Node
        },
        missOneChickenPartice: {
            default: null,
            type: cc.ParticleSystem
        },
        backgroundMusic: cc.AudioClip,
        interval: 2,
        maintainTime: 1,
        chickenSum: 20,
        crosschairSpeed: 20,
        beginGameTime: 3
    },

    onLoad () {
        this._time = 1-this.beginGameTime;//beginGameTime秒后游戏开始
        this._chicken = new Array();
        this._gameOver = false;
        this._score = 0;
        this._maintainTime = 100;//这个数字代表一只鸡所能维持的剩余时间，初始设为较大
        this._isFirstShow = true;

        this._backgroundMusicID = cc.audioEngine.play(this.backgroundMusic,true,Global.musicVolume*0.5);

        this.onLoadTouchRelated();
        this.setTouchEvent();
        this.receiveEvent();//给鸡注册
    },

    onLoadTouchRelated: function(){
        this._crosschairDir = 0;
        this._crosschairDir2 = 0;
        this._isMovingCrossChair = false;
        this._lastMovingScaChangeTime = 0;
        this._movingSca = 0;
        this._lastMovingSca = 0;
        this.crosschair.node.setPosition(cc.p(0,0));
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
        return cc.p((Math.random()*0.5+0.25)*cc.winSize.width-cc.winSize.width/2,
            (Math.random()*0.5+0.25)*cc.winSize.height-cc.winSize.height/2);
    },

    updateScore: function(){
        this.failedLabel.getComponent(cc.Label).string = "分数: " + this._score;
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
                this.remainderLabel.getComponent(cc.Label).string = "剩余恶鸡: "+this.chickenSum;
                this._time = 0;
                this.chicken.node.opacity = 255;
                this._maintainTime = this.maintainTime;
                var loc = this.getNewchickenPosition()
                this.chicken.node.setPosition(loc);

                if(this._isFirstShow == true){
                    this._isFirstShow = false;
                    this.firstShow(loc);//显示配套文字
                }
            }
        }

        if (this.blood.node.opacity > 1) this.blood.node.opacity -= 1;//血量图透明度降低

        this.updateAbuoutCrossChair(dt);
    },

    updateAbuoutCrossChair: function(dt){
        if(this._lastMovingScaChangeTime>0.03){
            this._movingSca = 0;
            return;
        }

        if(!this._isMovingCrossChair) return;
    
        this.crosschair.node.x += this.crosschairSpeed*Math.cos(this._crosschairDir)*dt*this._movingSca*this._crosschairDir2;
        this.crosschair.node.y += this.crosschairSpeed*Math.sin(this._crosschairDir)*dt*this._movingSca;

        if(this.crosschair.node.x<-cc.winSize.width/2) this.crosschair.node.x = -cc.winSize.width/2;
        if(this.crosschair.node.x>cc.winSize.width/2) this.crosschair.node.x = cc.winSize.width/2;
        if(this.crosschair.node.y<-cc.winSize.height/2) this.crosschair.node.y = -cc.winSize.height/2;
        if(this.crosschair.node.y>cc.winSize.height/2) this.crosschair.node.x = cc.winSize.height/2;
        
        this._lastMovingSca = this._movingSca;

        this._lastMovingScaChangeTime += dt;
    },

    aChickenFailed: function(){
        this.missOneChickenPartice.node.x = this.chicken.node.x;
        this.missOneChickenPartice.node.y = this.chicken.node.y;
        this.scheduleOnce(function() {
            this.missOneChickenPartice.node.x = cc.winSize.width;
            this.missOneChickenPartice.node.y = cc.winSize.height;//移出屏外
        },0.5);

        this._score--;
        this.updateScore();
        this._maintainTime=100;
        this.chicken.node.opacity = 0;
        this.isFinalChicken();
    },

    isFinalChicken: function(){
        if(this.chickenSum<=0){
            this._gameOver = true;

            cc.audioEngine.stop(this._backgroundMusicID);

            var action = cc.moveTo(1,0,0);
            this.gameOverLayer.runAction(action.easing(cc.easeElasticOut(5.0)));
            this.gameOverLayer.setLocalZOrder(101);

            var rank = new Array(-15,-5,8,15);
            var comment = new Array("笨蛋","挂科","秀","李大钊","陈独秀")
            if(this._score<rank[0]){
                this.commentLabel.getComponent(cc.Label).string = comment[0];
            }else if(this._score<rank[1]){
                this.commentLabel.getComponent(cc.Label).string = comment[1];
            }else if(this._score<rank[2]){
                this.commentLabel.getComponent(cc.Label).string = comment[2];
            }else if(this._score<rank[3]){
                this.commentLabel.getComponent(cc.Label).string = comment[3];
            }else{
                this.commentLabel.getComponent(cc.Label).string = comment[4];
            }
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
    },

    receiveEvent: function(){
        this.chicken.node.on("fire", function (event) {
            if(this._gameOver == true
            || this.chicken.node.opacity<5) return;

            this._score++;
            this.updateScore();

            cc.audioEngine.play(this.ak47, false, Global.effectVolume);

            this.chicken.node.opacity = 0;

            this._maintainTime = 100;

            this.isFinalChicken();
        },this);
    },

    setTouchEvent: function(){
        var sprite = this;
        var startPos = cc.p(0,0);

        sprite.node.on(cc.Node.EventType.TOUCH_START, function(e){  
            startPos = e.getLocation();
            this._isMovingCrossChair = true;
            return true;  
        }.bind(this), this);  

        sprite.node.on(cc.Node.EventType.TOUCH_MOVE, function(e){  
            var tempx = e.getLocation().x-cc.winSize.width/2;
            var tempy = e.getLocation().y-cc.winSize.height/2;

            var dist2 = this.getDist(e.getLocation(),e.getPreviousLocation());

            this._movingSca = dist2/5*Global.fireSpeedVolume;
            this._lastMovingScaChangeTime = 0;

            tempx = (e.getLocation().x-e.getPreviousLocation().x);
            tempy = (e.getLocation().y-e.getPreviousLocation().y);

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
            this._isMovingCrossChair = false;
            this._movingSca = 0;
        }.bind(this), this );  

        sprite.node.on(cc.Node.EventType.TOUCH_CANCEL, function(e){  
            this._isMovingCrossChair = false;
            this._movingSca = 0;
        }.bind(this), this );  

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向速度
            onKeyPressed: function(keyCode, event) {
                self.fireButtonPress();
            }}, 
        self.node);
    },
    getDist: function(pos1,pos2){
        return Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x)+
                        (pos1.y-pos2.y)*(pos1.y-pos2.y));
    },
    fireButtonPress: function(){  
        cc.audioEngine.play(this.ak47, false, Global.effectVolume);
        var shouldBlood = true;

        var pos = cc.p(this.crosschair.node.x,this.crosschair.node.y);

        if(this.chicken.node.opacity>0){//鸡可以被看到
            var dist = this.getDist(pos,cc.p(this.chicken.node.x,this.chicken.node.y));
            var radius = 25;//鸡的半径
            if(dist<=radius){
                this.chicken.node.emit('fire');
                this.changeBlood(this.chicken.node.x,this.chicken.node.y);
                shouldBlood = false;
            }
        }
        if(!shouldBlood) return;

        this.blood.node.opacity = 100; //打中空地飘红血
        --this._score; //打中空地降一分  
        this.updateScore();   
    }
});
