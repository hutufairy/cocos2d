var MainMenuLayer = cc.Layer.extend({
    _backgroundLayer: null,
    _touchLayer: null,
    ctor: function(){
        this._super();
        this.addBackgroundLayer();
        this.addTouchLayer();
    },
    addBackgroundLayer: function(){
        this._backgroundLayer = new MMBackgroundLayer();
        this.addChild(this._backgroundLayer);
    },
    addTouchLayer: function(){
        this._touchLayer = new MMTouchLayer();
        this.addChild(this._touchLayer);
    }
});

var MainMenuScene = cc.Scene.extend({
    onEnter: function(){
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});