var GamePlayLayer = cc.Layer.extend({
    _backgroundLayer: null,
    _touchLayer: null,
    ctor: function(){
        this._super();
        this.addCache();
        this.addBackgroundLayer();
        this.addTouchLayer();
    },
    addCache: function(){
        cc.spriteFrameCache.addSpriteFrames(res.gp_TextureOpaquePack_plist);//加载精灵框帧缓存
        cc.spriteFrameCache.addSpriteFrames(res.gp_b01_plist);
        cc.spriteFrameCache.addSpriteFrames(res.gp_Explosion_plist);
    },
    addBackgroundLayer: function(){
        this._backgroundLayer = new GPBackgroundLayer();
        this.addChild(this._backgroundLayer);
    },
    addTouchLayer: function(){
        this._touchLayer = new GPTouchLayer();
        this.addChild(this._touchLayer);
    }
});

var GamePlayScene = cc.Scene.extend({
    onEnter: function(){
        this._super();

        var layer = new GamePlayLayer();
        this.addChild(layer);

        var menu = new MMMainMenuLayer(); //返回主界面菜单
        this.addChild(menu, 1);
    }
});