var ShipSprite = cc.Sprite.extend({
    _rect: null,
    HP: 5,
    active: true,
    _bornSprite: null,
    _canBeAttack: true,
    _hurtColorLife: 0,
    ctor: function(aTexture){
        this._super(aTexture);
        this._rect = cc.rect(0, 0, this.getContentSize().width, this.getContentSize.height);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded,
            onTouchCancelled: this.onTouchCancelled
        }, this);
        
        //创建精灵帧数组
        var frame0 = cc.spriteFrameCache.getSpriteFrame('ship01.png');
        var frame1 = cc.spriteFrameCache.getSpriteFrame('ship02.png');

        var animateFrames = [];
        animateFrames.push(frame0);
        animateFrames.push(frame1);

        //用精灵帧数组和一定的时间间隔创建一个动画
        var animation = new cc.Animation(animateFrames, 0.1);
        var animate = cc.animate(animation);

        //用一个重复持续动作封装这个精灵动作
        var action = animate.repeatForever();
        this.runAction(action);

        this.schedule(this.shoot, 1/6);
        this.initBornSprite();
        this.born();
    },
    isTouchInRect: function(touch){
        var getPoint = touch.getLocation();
        var myRect = this.getRect(this.x, this.y);
        return cc.rectContainsPoint(myRect, getPoint);
    },
    getRect: function(x, y){
        return cc.rect( x - this._rect.width * 0.5, y - this._rect.height * 0.5, this._rect.width, this._rect.height );
    },
    onTouchBegan: function(touch, event){
        var target = event.getCurrentTarget();
        if(!target.isTouchInRect(touch)) return false;
        return true;
    },
    onTouchMoved: function(touch, event){
        var target = event.getCurrentTarget();
        target.setPosition(touch.getLocation());
    },
    onTouchEnded: function(touch, event){

    },
    onTouchCancelled: function(touch, event){

    },
    update: function(dt){
        if(this.HP <= 0){
            this.active = false;
            this.destroy();//销毁飞机
        }
    },
    destroy: function(){
        GC.LIFE--;

    },
    shoot: function(dt){
        //飞机发射双排子弹
        var leftBullet = BulletSprite.getOrCreateBullet(GC.BULLET_SPEED.SHIP, 'W1.png', GC.ENEMY_ATTACK_MODE.NORMAL, 3000, GC.UNIT_TAG.PLAYER_BULLET);
        leftBullet.x = this.x - 13; //中心偏左
        leftBullet.y = this.y + 3 + this.height * 0.3;

        var rightBullet = BulletSprite.getOrCreateBullet(GC.BULLET_SPEED.SHIP, 'W1.png', GC.ENEMY_ATTACK_MODE.NORMAL, 3000, GC.UNIT_TAG.PLAYER_BULLET);
        rightBullet.x = this.x + 13; //中心偏右
        rightBullet.y = this.y + 3 + this.height * 0.3;

    },
    initBornSprite: function(){
        this._bornSprite = new cc.Sprite('#ship03.png');
        this._bornSprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE);

        this._bornSprite.x = this.width/2;
        this._bornSprite.y = this.height/2;
        this._bornSprite.visible = false;
        this.addChild(this._bornSprite, 3000, 99999);
    },
    born: function(){
        this._canBeAttack = false;
        this._bornSprite.scale = 8;
        this._bornSprite.runAction(cc.scaleTo(0.5, 1, 1));
        this._bornSprite.visible = true;
        var blinks = cc.blink(3, 9);
        var makeBeAttack = cc.callFunc(function(t){
            t._canBeAttack = true;
            t.visible = true;
            t._bornSprite.visible = false;
        }.bind(this));
        this.runAction(cc.sequence(cc.delayTime(0.5), blinks, makeBeAttack));

        this.HP = 5;
        this._hurtColorLife = 0;
        this.active = true;
    },
    collideRect: function(x, y){//碰撞范围
        var w = this.width, h = this.height;
        return cc.rect(x-w/2, y-h/2, w, h);
    },
    hurt: function(){
        if(this._canBeAttack){
            this._hurtColorLife = 2;
            this.HP--;
        }
    }

});