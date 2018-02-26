// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        chicken: cc.Sprite,
        crosschair: cc.Sprite,
    },

    start () {
        cc._canvas.style.cursor = 'none';//隐藏默认指针
        this.addTouchEvent();

        this.chicken.node.x = Math.random()*900-450;
        this.chicken.node.y = Math.random()*580-290;
    },

    addTouchEvent: function(){
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.crosschair.node.x = event.getLocationX() - 480;
            this.crosschair.node.y = event.getLocationY() - 320;
        },this);
    },
});
