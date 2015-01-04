var GPBackgroundLayer = cc.Layer.extend({
    _sptBg: null,
    ctor: function(){
        this._super();
        this.initBackground();
    },
    initBackground: function(){
        this._sptBg = new cc.Sprite("#bg01.png");
        this._sptBg.attr({
            x: GC.w_2,
            y: GC.h_2
        });
        this.addChild(this._sptBg);
    }
});