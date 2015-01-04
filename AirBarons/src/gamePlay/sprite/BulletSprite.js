//子弹
var BulletSprite = cc.Sprite.extend({
    active: true,
    HP: 1,
    yVelocity: 200,
    ctor: function(bullteSpeed, weaponType, attackMode){
        this._super('#'+weaponType);
        this.yVelocity = -bullteSpeed;
        this.attackMode = attackMode;
        this.setBlendFunc(cc.SRC_ALPHA, cc.ONE); //蒙板
    },
    update: function(dt){//dt: 时间间隔
        var y = this.y;
        this.y = y - this.yVelocity * dt;
        if(y < 0 || y > GC.h + 10 || this.HP <= 0){
            this.destroy();
        }
    },
    destroy: function(){
        this.active = false;
        this.visible = false;
    },
    hurt: function(){
        this.HP--;
        cc.log('BulletSprite hurt ...');
    },
    collideRect: function(x, y){//碰撞检测范围
        return cc.rect(x - 3, y - 3, 6, 6);
    }
});

BulletSprite.getOrCreateBullet = function(bullteSpeed, weaponType, attackMode, zOrder, mode){
    var selChild = null, bullets;
    if(mode == GC.UNIT_TAG.PLAYER_BULLET){
        bullets = GC.CONTAINER.PLAYER_BULLETS;
    }else{
        bullets = GC.CONTAINER.ENEMY_BULLETS;
    }
    for(var j = 0; j < bullets.length; j++){
        selChild = bullets[j];
        if(selChild.active == false){
            selChild.visible = true;
            selChild.active = true;
            selChild.HP = 1;
            return selChild;
        }
    }
    selChild = BulletSprite.create(bullteSpeed, weaponType, attackMode, zOrder, mode)
    return selChild;
};

BulletSprite.create = function(bullteSpeed, weaponType, attackMode, zOrder, mode){
    var bullet = new BulletSprite(bullteSpeed, weaponType, attackMode);

    g_GPTouchLayer.addBullet(bullet, zOrder, mode);

    if(mode == GC.UNIT_TAG.PLAYER_BULLET){
        GC.CONTAINER.PLAYER_BULLETS.push(bullet);
    }else{
        GC.CONTAINER.ENEMY_BULLETS.push(bullet);
    }

    return bullet;
};

BulletSprite.preSet = function(){
    for(var i = 0; i < 10; i++){
        var b1 = BulletSprite.create(GC.BULLEL_SPEED.SHIP, 'W1.png', GC.ENEMY_ATTACK_MODE.NORMAL, 3000, GC.UNIT_TAG.PLAYER_BULLET);
        var b2 = BulletSprite.create(GC.BULLEL_SPEED.ENEMY, 'W2.png', GC.ENEMY_ATTACK_MODE.NORMAL, 3000, GC.UNIT_TAG.ENEMY_BULLET);
        b1.destroy();
        b2.destroy();
    }
}