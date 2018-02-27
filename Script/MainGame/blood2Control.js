cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    update (dt) {
        if(this.node.opacity > 3){
            this.node.opacity -= 3;
        }
    },
});
