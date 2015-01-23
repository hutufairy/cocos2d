var GameOverLayer = cc.LayerColor.extend({
    ctor: function(){
        this._super(cc.color(0,0,0,180));
        this.init();
    },
    init: function(){
        var size = cc.winSize;
        var centerPos = cc.p(size.width/2, size.height/2);

        var item  = new cc.MenuItemSprite(
            new cc.Sprite(res.restart_n_png),
            new cc.Sprite(res.restart_s_png), 
            null, 
            this.onRestart, this);
        var menu = new cc.Menu(item);
        menu.setPosition(centerPos);
        this.addChild(menu);

    },
    onRestart: function(){
        cc.director.resume();
        cc.director.runScene(new PlayScene());
    }
});