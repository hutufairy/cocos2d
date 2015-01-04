var EnemySprite = cc.Sprite.extend({
    HP: 15, //血量
    moveType: null,
    scoreValue: 200, //分值
    enemyType: 1, //敌机类型
    speed: 200,
    active: true, //状态
    delayTime: 1 + 1.2 * Math.random(), //延迟时间(间隔多久射击)
    attackMode: GC.ENEMY_ATTACK_MODE.NORMAL, //攻击类型：普通
    bulletSpeed: GC.BULLET_SPEED.ENMY, //子弹射击速度
    _hurtColorLife: 0,
    ctor: function(arg){
        this._super('#'+arg.textureName);
        this.restore(arg);
    },
    update: function(dt){
        var x = this.x, y = this.y;
        if( x < 0 || x > GC.w || y < 0 || y > GC.h){
            this.active = false;
        }
        if(this.HP <= 0){
            this.destroy();
        }
    },
    shoot: function(){
        var x = this.x, y = this.y;
        var b = BulletSprite.getOrCreateBullet(this.bulletSpeed, 'W2.png', this.attackMode, 3000, GC.UNIT_TAG.ENEMY_BULLET);
        b.x = x;
        b.y = y - this.height * 0.2;
    },
    destroy: function(){
        GC.SCORE += this.scoreValue; //计入分数
        var a = ExplosionSprite.getOrCreateExplosion();//爆炸场景
        a.attr({
            x: this.x,
            y: this.y
        });
        SparkEffectSprite.getOrCreateSparkEffect(this.x, this.y);
        if(GC.SOUND_ON){
            cc.audioEngine.playEffect(res.gp_explodeEffect_mp3); //播放爆炸音乐
        }
        this._destroy();
        GC.ACTIVE_ENEMIES--; //战场上敌机总数减一
    },
    _destroy: function(){
        this.visible = false; //隐藏
        this.active = false; //置为不可用
        this.stopAllActions(); //停止机身所有动作
        this.unschedule(this.shoot); //停止射击定时事件
    },
    restore: function(arg){
        this.HP = arg.HP;
        this.moveType = arg.moveType;
        this.scoreValue = arg.scoreValue;
        this.attackMode = arg.attackMode;
        this.enemyType = arg.type;
        this._hurtColorLife = 0;
        this.active = true;
        this.visible = true;
        this.schedule(this.shoot, this.delayTime);
    },
    hurt: function(){
        this._hurtColorLife = 2;
        this.HP--;
    },
    collideRect: function(x, y){//碰撞范围
        var w = this.width, h = this.height;
        return cc.rect(x-w/2, y-h/4, w, h/2+20);
    }
});

EnemySprite.getOrCreateEnemy = function (arg) {
    var selChild = null;
    for (var j = 0; j < GC.CONTAINER.ENEMIES.length; j++) {
        selChild = GC.CONTAINER.ENEMIES[j];

        if (selChild.active == false && selChild.enemyType == arg.type) {
            selChild.restore(arg);
            break;
        }
    }
    if(selChild === null) selChild = EnemySprite.create(arg);
    GC.ACTIVE_ENEMIES++;
    return selChild;
};

EnemySprite.create = function (arg) {
    var enemy = new EnemySprite(arg);
    g_GPTouchLayer.addEnemy(enemy, enemy.zOrder, GC.UNIT_TAG.ENEMY);
    GC.CONTAINER.ENEMIES.push(enemy);
    return enemy;
};

EnemySprite.preSet = function () {
    var enemy = null;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < EnemyType.length; j++) {
            enemy = EnemySprite.create(EnemyType[j]);
            enemy._destroy();
        }
    }
};