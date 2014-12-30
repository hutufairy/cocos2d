var MMBackgroundLayer = cc.Layer.extend({
    _sptBg: null,
    _sptLogo: null,
    _ship: null,
    ctor: function(){
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.TextureTransparentPack_plist);//加载精灵框帧缓存
        this.initBackground();
        this.initShip();
        this.initLogo();
    },
    initBackground: function(){
        this._sptBg = new cc.Sprite(res.mm_bg_png);
        this._sptBg.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: GC.w_2,
            y: GC.h_2
        });
        this.addChild(this._sptBg);
    },
    initLogo: function(){
        this._sptLogo = new cc.Sprite(res.mm_logo_png);
        this._sptLogo.attr({
            x: GC.w_2,
            y: GC.h - 160
        });
        this.addChild(this._sptLogo, 1);
    },
    initShip: function(){
        this._ship = new cc.Sprite('#ship01.png');
        this.addChild(this._ship);
        this._ship.x = Math.random() * GC.w;
        this._ship.y = 0;

        this._ship.runAction(cc.moveBy(2, cc.p(Math.random() * GC.w, this._ship.y + GC.h + 100)));

        this.schedule(this.update, 0.1);
    },
    update: function(){
        if(this._ship.y > 480){
            this._ship.x = Math.random() * GC.w;
            this._ship.y = 10;
            this._ship.runAction(cc.moveBy(parseInt(5*Math.random(), 10), cc.p(Math.random() * GC.w, this._ship.y + 480)));
        }
    }
});