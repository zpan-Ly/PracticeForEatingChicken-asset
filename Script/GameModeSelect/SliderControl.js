var Global = require('GlobalData');   

cc.Class({
    extends: cc.Component,

    properties: {
        slider_m: cc.Slider,
        slider_e: cc.Slider,
        slider_f: cc.Slider
    },

    onLoad(){
        this.slider_m.progress = Global.musicVolume;
        this.slider_e.progress = Global.effectVolume;
        this.slider_f.progress = Global.fireSpeedVolume;
    },

    musicEvent (sender, eventType) {
        Global.musicVolume =  sender.progress;
        cc.audioEngine.setVolume(Global.musicId,Global.musicVolume);
    },

    effectEvent (sender, eventType) {
        Global.effectVolume =  sender.progress;
    },

    speedEvent (sender, eventType) {
        Global.fireSpeedVolume =  sender.progress;
    },
});
