var PlayScene = cc.Scene.extend({
    space: null,
    shapesToRemove :[],

    onEnter: function(){
        this._super();
        this.shapesToRemove = [];

        this.initPhysics();

        this.gameLayer = new cc.Layer();

        this.gameLayer.addChild(new BackgroundLayer(this.space), 0, TagOfLayer.background);
        this.gameLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);
        this.addChild(this.gameLayer);
        this.addChild(new StatusLayer(), 0, TagOfLayer.Status);
        if(!cc.audioEngine.isMusicPlaying()){
            cc.audioEngine.playMusic(res.background_mp3, true);
        }

        this.scheduleUpdate();
    },
    initPhysics:function() {
        //1. new space object 
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, -350);

        // 3. set up Walls
        var wallBottom = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, g_runnerHeight),// start point
            cp.v(4294967295, g_runnerHeight),// MAX INT:4294967295
            0);// thickness of wall
        this.space.addStaticShape(wallBottom);

        this.space.addCollisionHandler(SpriteTag.runner, SpriteTag.coin,
            this.collisionCoinBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.runner, SpriteTag.rock,
            this.collisionRockBegin.bind(this), null, null, null);
    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);

        var animationLayer = this.gameLayer.getChildByTag(TagOfLayer.Animation);
        var backgroundLayer = this.gameLayer.getChildByTag(TagOfLayer.background);

        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        animationLayer.update()
        var eyeX = animationLayer.getEyeX();
        backgroundLayer.checkAndReload(eyeX);
        this.gameLayer.setPosition(cc.p(-eyeX,0));

        statusLayer.updateMeter(eyeX);

        for(var i = 0; i < this.shapesToRemove.length; i++) {
            var shape = this.shapesToRemove[i];
            backgroundLayer.removeObjectByShape(shape);
        }
        this.shapesToRemove = [];
    },
    collisionCoinBegin:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] is runner
        this.shapesToRemove.push(shapes[1]);
        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        statusLayer.addCoin(1);
        cc.audioEngine.playEffect(res.pickup_coin_mp3);
    },

    collisionRockBegin:function (arbiter, space) {
        cc.log("==game over");
        cc.director.pause();
        cc.audioEngine.stopMusic();
        this.addChild(new GameOverLayer());
    }
});