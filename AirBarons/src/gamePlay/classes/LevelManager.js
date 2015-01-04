var LevelManager = cc.Class.extend({
    _currentLevel: null,
    _gamePlayLayer: null,
    ctor: function(gamePlayLayer){
        if(!gamePlayLayer) throw "gameLayer must be non-nil";

        this._currentLevel = Level1;
        this._gamePlayLayer = gamePlayLayer;
        this.setLevel(this._currentLevel);
    },
    setLevel: function(level){
        var locCurrentLevelEnemies = level.enemies;
        for(var i = 0; i < locCurrentLevelEnemies.length; i++){
            locCurrentLevelEnemies[i].ShowTime = this._minuteToSecond(locCurrentLevelEnemies[i].ShowTime);
        }
    },
    _minuteToSecond: function(minuteStr){
        if(!minuteStr) return 0;
        if(typeof(minuteStr) != 'number'){
            var mins = minuteStr.split(':');
            if(mins.length == 1){
                return parseInt(mins[0], 10);
            }else{
                return parseInt(mins[0], 10) * 60 + parseInt(mins[1], 10);
            }
        }
        return minuteStr;
    },
    loadLevelResource: function(dt){
        if(GC.ACTIVE_ENEMIES >= this._currentLevel.enemyMax){//当前敌机数超过最大限制
            return;
        }
        var enemies = this._currentLevel.enemies;
        for(var i=0; i < enemies.length; i++){
            var selEnemy = enemies[i];
            if(selEnemy){
                if(selEnemy.ShowType === 'Once' && selEnemy.ShowTime == dt){
                    this.addEnemiesToGameLayer(selEnemy.Types);
                }else if(selEnemy.ShowType === 'Repeat' &&  dt % selEnemy.ShowTime === 0){
                    this.addEnemiesToGameLayer(selEnemy.Types);
                }
            }
        }
    },
    addEnemiesToGameLayer: function(enemyTypes){
        for(var tIndex = 0; tIndex < enemyTypes.length; tIndex++){
            this.addEnemyToGameLayer(enemyTypes[tIndex]);
        }
    },
    addEnemyToGameLayer: function(enemyType){ //根据敌机类型创建对象
        var addEnemy = EnemySprite.getOrCreateEnemy(EnemyType[enemyType]);
        addEnemy.x = 80 + (GC.w - 160) * Math.random();//敌机出现位置
        addEnemy.y = GC.h;

        var offset, tmpAction;
        var a0=0, a1=0;
        switch (addEnemy.moveType) {
            case GC.ENEMY_MOVE_TYPE.ATTACK:
                offset = cc.p(this._gamePlayLayer._ship.x, this._gamePlayLayer._ship.y);
                tmpAction = cc.MoveTo.create(1, offset); //1秒内移动到飞机所在位置
                break;
            case GC.ENEMY_MOVE_TYPE.VERTICAL://垂直方向向下移动
                offset = cc.p(0, -GC.h - addEnemy.height);
                tmpAction = cc.MoveBy.create(4, offset);
                break;
            case GC.ENEMY_MOVE_TYPE.HORIZONTAL:
                offset = cc.p(0, -100 - 200 * Math.random());
                a0 = cc.MoveBy.create(0.5, offset);
                a1 = cc.MoveBy.create(1, cc.p(-50 - 100 * Math.random(), 0));
                var onComplete = cc.CallFunc.create(function (pSender) {
                    var a2 = cc.DelayTime.create(1);
                    var a3 = cc.MoveBy.create(1, cc.p(100 + 100 * Math.random(), 0));
                    pSender.runAction(cc.Sequence.create(a2, a3, a2.clone(), a3.reverse()).repeatForever());
                }.bind(addEnemy) );
                tmpAction = cc.Sequence.create(a0, a1, onComplete);
                break;
            case GC.ENEMY_MOVE_TYPE.OVERLAP:
                var newX = (addEnemy.x <= GC.w / 2) ? 320 : -320;
                a0 = cc.MoveBy.create(4, cc.p(newX, -240));
                a1 = cc.MoveBy.create(4,cc.p(-newX,-320));
                tmpAction = cc.Sequence.create(a0,a1);
                break;
        }

        addEnemy.runAction(tmpAction);    
    }
});