var MenuLayer = cc.Layer.extend({
    ctor: function(){
        this._super();
        this.init();
    },
    init: function(){
        var size = cc.winSize;
        var centerPos = cc.p(size.width/2, size.height/2);

        var bg = new cc.Sprite(res.helloBG_png);
        bg.setPosition(centerPos);
        this.addChild(bg);

        var item  = new cc.MenuItemSprite(
            new cc.Sprite(res.start_n_png),
            new cc.Sprite(res.start_s_png), 
            null, 
            this.onPlay, this);
        var menu = new cc.Menu(item)
        menu.setPosition(centerPos)
        this.addChild(menu)
    },
    onPlay: function(){
        cc.director.runScene(new PlayScene())
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});

