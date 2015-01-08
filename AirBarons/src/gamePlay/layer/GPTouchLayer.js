STATE_PLAYING = 0;
STATE_GAMEOVER = 1;

MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var g_GPTouchLayer;
var GPTouchLayer = cc.Layer.extend({
    _state : STATE_PLAYING,
    _texOpaqueBatch: null,
    _texTransparentBatch: null,
    _lbScore: null,
    _lbLife: null,
    _ship: null,
    _temScore: 0, //得分
    _time: null,
    _levelManager: null,
    ctor: function(){
        this._super();
        this.playMusic();
        this.initGC();

        g_GPTouchLayer = this;
        this._state = STATE_PLAYING;

        this._levelManager = new LevelManager(this);

        this.initBatchNode();
        this.initAboutInfo();
        this.initShip();
        this.scheduleUpdate();
        this.schedule(this.scoreCounter, 1);

        //        子弹敌人等预备
        BulletSprite.preSet();
        EnemySprite.preSet();
        SparkEffectSprite.preSet();
        ExplosionSprite.preSet();

    },
    initGC: function(){
        GC.LIFE = 4;

        GC.SCORE = 0;

        GC.CONTAINER.SPARKS = [];
        GC.CONTAINER.ENEMIES = [];
        GC.CONTAINER.ENEMY_BULLETS = [];
        GC.CONTAINER.PLAYER_BULLETS = [];
        GC.CONTAINER.EXPLOSIONS = [];
        GC.GAME_STATE = GC.GAME_STATE_ENUM.PLAY;

    },
    playMusic: function(){
        if(GC.SOUND_ON){
            cc.audioEngine.playMusic(res.mm_bgMusic_mp3, true);
        }
    },
    initBatchNode: function(){
        var texOpaque = cc.textureCache.addImage(res.gp_TextureOpaquePack_png);
        this._texOpaqueBatch = new cc.SpriteBatchNode(texOpaque);
        this._texOpaqueBatch.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.addChild(this._texOpaqueBatch);

        var texTransparent = cc.textureCache.addImage(res.TextureTransparentPack_png);
        this._texTransparentBatch = new cc.SpriteBatchNode(texTransparent);
        this.addChild(this._texTransparentBatch);

        var explosionTexture = cc.textureCache.addImage(res.gp_Explosion_png);
        this._explosions = new cc.SpriteBatchNode(explosionTexture);
        this._explosions.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.addChild(this._explosions);
    },
    initAboutInfo: function(){
        this._lbScore = new cc.LabelBMFont("Score: 0", res.sh_arial_14_fnt);
        this._lbScore.attr({
            anchorX: 1,
            anchorY: 0,
            x: GC.w - 5,
            y: GC.h - 30
        });
        this._lbScore.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
        this.addChild(this._lbScore, 1000);

        var life = new cc.Sprite('#ship01.png');
        life.attr({
            scale: 0.6,
            x: 30,
            y: 460
        });
        this._texTransparentBatch.addChild(life, 1, 5);

        this._lbLife = new cc.LabelTTF('0', 'Arial', 20);
        this._lbLife.attr({
            x: 60,
            y: 463,
            color: cc.color(255, 0, 0)
        });
        this.addChild(this._lbLife, 1000);
    },
    initShip: function(){
        this._ship = new ShipSprite("#ship01.png");
        this._ship.attr({
            x: 160,
            y: 60
        });
        this.addChild(this._ship, 1);
    },
    update: function(dt){
        if(this._state == STATE_PLAYING){
            this.updateUI();
            this.moveActiveUnit(dt);
            this.checkIsCollide();
            this.checkIsReborn();
        }
    },
    updateUI: function(){
        this._temScore += 1;
        this._lbLife.setString(GC.LIFE + '');
        this._lbScore.setString('Score: ' + this._temScore);
    },
    moveActiveUnit: function(dt){
        var selChild, children = this._texOpaqueBatch.getChildren();
        for(var i in children){
            selChild = children[i];
            if(selChild && selChild.active){//子弹移动
                selChild.update(dt);
            }
        }
        children = this._texTransparentBatch.getChildren();
        for(var i in children){
            selChild = children[i];
            if(selChild && selChild.active){
                selChild.update(dt);
            }
        }
        this._ship.update(dt);
    },
    checkIsCollide: function(){
        var selChild, bulletChild;
        var i, locShip = this._ship;
        var enemies = GC.CONTAINER.ENEMIES,
            player_bullets = GC.CONTAINER.PLAYER_BULLETS,
            enemy_bullets = GC.CONTAINER.ENEMY_BULLETS;
        for( i = 0; i < enemies.length; i++){
            selChild = enemies[i];
            if(!selChild.active){
                continue;
            }

            for(var j = 0; j < player_bullets.length; j++ ){//子弹与敌机碰撞
                bulletChild = player_bullets[j];
                if(bulletChild.active && this.collide(selChild, bulletChild)){
                    bulletChild.hurt();
                    selChild.hurt();
                }
            }
            if(locShip.active && this.collide(selChild, locShip)){//飞机与敌机相撞
                selChild.hurt();
                locShip.hurt();
            }
        }

        for( i = 0; i < enemy_bullets; i++ ){//飞机被敌机射中
            selChild = enemy_bullets[i];
            if(selChild.active && locShip.active && this.collide(selChild, locShip)){
                selChild.hurt();
                locShip.hurt();
            }
        }
    },
    checkIsReborn: function(){//飞机重生
        var locShip = this._ship;
        if(!locShip.active){
            if(GC.LIFE > 0){
                locShip.born();
            }else{
                this._ship = null;
                this._state = STATE_GAMEOVER;
                GC.GAME_STATE = GC.GAME_STATE_ENUM.OVER;

                var action = cc.sequence(cc.delayTime(0.2), cc.callFunc(this.onGameOver, this));
                this.runAction(action);
            }

        }
    },
    collide: function(a, b){//碰撞检测
        var ax = a.x, ay = a.y, bx = b.x, by = b.y;
        if(Math.abs(ax-bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by ) > MAX_CONTAINT_HEIGHT){
            return false; //超出边界
        }
        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    },
    onGameOver: function(){//游戏结束
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        cc.director.runScene(new cc.TransitionFade(1.2, new GameOverScene()));
    },
    scoreCounter: function(){
        if(this._state == STATE_PLAYING){
            this._time++;
            this._levelManager.loadLevelResource(this._time);
        }
    }
});

GPTouchLayer.prototype.addBullet = function(bullet, zOrder, mode){
    this._texOpaqueBatch.addChild(bullet, zOrder, mode);
};

GPTouchLayer.prototype.addEnemy = function(enemy, z, tag){
    this._texTransparentBatch.addChild(enemy, z, tag);
};

GPTouchLayer.prototype.addExplosions = function(explosion){
    this._explosions.addChild(explosion);
};

GPTouchLayer.prototype.addSpark = function(spark){
    this._texOpaqueBatch.addChild(spark);
}