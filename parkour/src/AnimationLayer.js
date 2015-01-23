var AnimationLayer = cc.Layer.extend({
    spriteSheet:null,
    runningAction:null,
    sprite:null,
    jumpUpAction: null,
    jumpDownAction: null,
    recognizer: null,
    stat: RunnerStat.running,
    ctor: function(space){
        this._super();
        this.space = space;
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        // Parallax ratio and offset
        this.addChild(this._debugNode, 10);
        this.init();
    },
    init: function(){
        cc.textureCache.addImage(res.running_png);
        this.spriteSheet = new cc.SpriteBatchNode(res.running_png);
        cc.spriteFrameCache.addSpriteFrames(res.running_plist);
        this.addChild(this.spriteSheet);

        this.initAction();
        // this.sprite = new cc.Sprite("#runner0.png");
        // this.sprite.attr({x:g_runnerStartX, y:85});

        this.sprite = new cc.PhysicsSprite("#runner0.png");
        var contentSize = this.sprite.getContentSize();
        // 2. init the runner physic body
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        //3. set the position of the runner
        this.body.p = cc.p(g_runnerStartX, g_runnerHeight + contentSize.height / 2);
        //4. apply impulse to the body
        this.body.applyImpulse(cp.v(150, 0), cp.v(0, 0));//run speed
        //5. add the created body to space
        this.space.addBody(this.body);
        //6. create the shape for the body
        this.shape = new cp.BoxShape(this.body, contentSize.width - 14, contentSize.height);
        //7. add shape to space
        this.space.addShape(this.shape);
        //8. set body to the physic sprite
        this.sprite.setBody(this.body);

        this.spriteSheet.addChild(this.sprite);

        this.sprite.runAction(this.runningAction.repeatForever());

        // var runner = new cc.Sprite(res.runner_png);
        // runner.setPosition(g_runnerStartX, 85);
        // this.addChild(runner);

        // var action = cc.moveBy(2, cc.p(220, 0));
        // runner.runAction(cc.sequence(action, action.reverse(), action.clone()))

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
        this.recognizer = new SimpleRecognizer();
    },
    initAction: function(){
        var frames = [];
        for(var i = 0; i < 8; i++){
            var str = "runner" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }

        var animation = new cc.Animation(frames, 0.1);
        this.runningAction = new cc.Animate(animation);
        this.runningAction.retain(); //保留

        frames = [];
        for(var i = 0; i < 4; i++){
            var str = "runnerJumpUp" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }

        animation = new cc.Animation(frames, 0.2);
        this.jumpUpAction = new cc.Animate(animation);
        this.jumpUpAction.retain();

        frames = [];
        for(var i = 0; i < 2; i++){
            var str = "runnerJumpDown" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }

        animation = new cc.Animation(frames, 0.4);
        this.jumpDownAction = new cc.Animate(animation);        
        this.jumpDownAction.retain();
    },
    getEyeX:function () {
        return this.sprite.getPositionX() - g_runnerStartX;
    },
    onTouchBegan: function(touch, event){
        var pos = touch.getLocation();
        var target = event.getCurrentTarget();
        target.recognizer.beginPoint(pos.x, pos.y)
        return true;
    },
    onTouchMoved: function(touch, event){
        var pos = touch.getLocation();
        var target = event.getCurrentTarget();
        target.recognizer.movePoint(pos.x, pos.y)        
    },
    onTouchEnded: function(touch, event){
        var pos = touch.getLocation();
        var target = event.getCurrentTarget();
        var dir = target.recognizer.endPoint(pos.x, pos.y);
        switch(dir){
            case 'up':
                target.jump();
                break;
            default:
                break;
        }
    },
    update: function(){
        var vel = this.body.getVel();
        if(this.stat == RunnerStat.jumpUp){
            if(vel.y < 0.1){
                this.switchAction(RunnerStat.jumpDown, this.jumpDownAction);
            }
        }else if(this.stat == RunnerStat.jumpDown){
            if(vel.y  < 0.1){
                this.switchAction(RunnerStat.running, this.runningAction);
            }
        }
    },
    jump: function(){
        cc.log('jump');
        if(this.stat == RunnerStat.running){
            cc.audioEngine.playEffect(res.jump_mp3);
            this.body.applyImpulse(cp.v(0, 250), cp.v(0, 0));
            this.switchAction(RunnerStat.jumpUp, this.jumpUpAction);
        }
    },
    switchAction: function(stat, action){
        this.stat = stat;
        this.sprite.stopAllActions();
        this.sprite.runAction(action)
    },
    onExit: function(){
        this.runningAction.release();
        this.jumpUpAction.release();
        this.jumpDownAction.release();
        this._super();
    }
})