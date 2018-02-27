cc.Class({
    extends: cc.Component,

    properties: {
        audio: cc.AudioSource,
    },

    onSliderMove: function(sender, eventType){
        this.audio.volume = sender.progress;
    },

    changeVolume: function(volume){
        this.audio.volume = volume;
    }
});
