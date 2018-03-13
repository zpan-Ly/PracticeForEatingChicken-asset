var Global = require('GlobalData');   

cc.Class({
    extends: cc.Component,

    properties: {
        music: cc.AudioClip,
        mainNode: cc.Node,
        setNode: cc.Node,
    },

    onLoad () {
        //预加载音乐
        cc.audioEngine.preload("musicworld.mp3");
        cc.audioEngine.preload("jungleworld.mp3");

        //预加载场景
        cc.director.preloadScene('MainGame', function () {
            cc.log('MainGame scene preloaded');
        });
        cc.director.preloadScene('AccuracyGame', function () {
            cc.log('AccuracyGame scene preloaded');
        });
        cc.director.preloadScene('QuickSwap', function () {
            cc.log('QuickSwap scene preloaded');
        });
        cc.director.preloadScene('ReactionTest', function () {
            cc.log('ReactionTest scene preloaded');
        });

        //播放背景音乐
        cc.audioEngine.play(this.music,true,0.8);

        //隐藏设置界面
        this.setNode.active = false;
    },

    onSet: function(){
        this.mainNode.opacity = 100;
        this.setNode.opacity = 255;
        this.setNode.active = true;
    },

    onClose: function(){
        this.mainNode.opacity = 255;
        this.setNode.opacity = 0;
        this.setNode.active = false;
    }
});
