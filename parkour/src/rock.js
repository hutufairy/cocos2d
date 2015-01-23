var Rock = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    _map:0,// map 属于这个参数
    get map() {
        return this._map;
    },
    set map(newMap) {
        this._map = newMap;
    },

    /** 构造器
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor:function (spriteSheet, space, posX) {
        this.space = space;

        this.sprite = new cc.PhysicsSprite("#rock.png");
        var body = new cp.Body(Infinity, Infinity);
        body.nodeIdleTime = Infinity;
        body.setPos(cc.p(posX, this.sprite.getContentSize().height / 2 + g_runnerHeight));
        this.sprite.setBody(body);

        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(SpriteTag.rock);

        this.space.addStaticShape(this.shape);
        spriteSheet.addChild(this.sprite);
    },

    removeFromParent:function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    getShape:function () {
        return this.shape;
    }
})