var Global = require('GlobalData');   

cc.Class({
    extends: cc.Component,

    properties: {
    },

    netModeSelect_single: function(){
        cc.director.loadScene("GameModeSelect.fire");
        var scene = cc.director.getScene();
        Global.netMode = 0;
    },
   
    netModeSelect_multiple: function(){
        cc.director.loadScene("GameModeSelect.fire");
        var scene = cc.director.getScene();
        Global.netMode = 1;
    },
//******************************************************************** 
    gameModeSelect_return: function(){
        cc.director.loadScene("NetModeSelect.fire")
    },

    gameModeSelect_professional: function(){
        cc.director.loadScene("MainGame.fire");
        Global.gameMode = 0;
    },

    gameModeSelect_training1: function(){
        cc.director.loadScene("AccuracyGame.fire");
        Global.gameMode = 1;
    },

    gameModeSelect_training2: function(){
        cc.director.loadScene("ReactionTest.fire");
        Global.gameMode = 2;
    },

    gameModeSelect_reactionTest: function(){
        cc.director.loadScene("ReactionTest.fire");
        Global.gameMode = 3;
    },

    gameModeSelect_adventure: function(){
        cc.director.loadScene("MainGame.fire");
        Global.gameMode = 5;
    },
//***********************************************************************
    mainGame_return: function(){
        cc.director.loadScene("GameModeSelect.fire");
        cc._canvas.style.cursor = 'auto';//恢复指针样式
    },

    mainGame_reset: function(){
        cc.director.loadScene("MainGame.fire");
    },
//***********************************************************************
    accuracyGame_return: function(){
        cc.director.loadScene("GameModeSelect.fire");
        cc._canvas.style.cursor = 'auto';//恢复指针样式
    },
    
    accuracyGame_reset: function(){
        cc.director.loadScene("AccuracyGame.fire");
    }
});
