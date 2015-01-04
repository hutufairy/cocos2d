var ExplosionSprite = cc.Sprite.extend({
    active: true,
    animation: null,
    ctor: function(){
        var pFrame = cc.spriteFrameCache.getSpriteFrame('explosion_01.png');
        this._super(pFrame);
        this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    },
    play: function(){
        var animFrames = [];
        var prefix = 'explosion_';
        for(var i=1; i < 35; i++){
            var str = prefix + (i<10 ? ( '0' + i ) : i) + '.png';
            animFrames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animation = new cc.Animation(animFrames, 0.04);
        this.runAction(cc.sequence(
            cc.animate(animation), 
            cc.callFunc(this.destroy, this)
        ));
    },
    destroy: function(){
        this.visible = false;
        this.active = false;
    },
    restore: function(){
        this.visible = true;
        this.active = true;
    }
});

ExplosionSprite.getOrCreateExplosion = function(){
    var selChild = null, explosions = GC.CONTAINER.EXPLOSIONS;
    for(var j = 0; j < explosions.length; j++ ){//尝试使用已创建且过期的对象
        selChild = explosions[j];
        if(selChild.active === false){
            selChild.restore();
            break;
        }
    }
    if(selChild === null) selChild = ExplosionSprite.create(); //没有符合的对象时重新创建
    selChild.play();
    return selChild;
}

ExplosionSprite.create = function(){
    var explosion = new ExplosionSprite();
    g_GPTouchLayer.addExplosions(explosion); //添加到精灵表中
    GC.CONTAINER.EXPLOSIONS.push(explosion);
    return explosion;
};

ExplosionSprite.preSet = function(){//预创建
    var explosion = null;
    for(var i = 0; i < 6; i++){
        explosion = ExplosionSprite.create();
        explosion.destroy();
    }
}