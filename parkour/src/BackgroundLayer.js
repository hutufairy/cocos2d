var BackgroundLayer = cc.Layer.extend({
    map00:null,
    map01:null,
    mapWidth:0,
    mapIndex:0,
    objects: [],
    space: null,
    spriteSheet: null,
    ctor: function(space){
        this._super();
        this.space = space;
        this.objects = [];
        this.init();
    },
    init: function(){
        this.map00 = new cc.TMXTiledMap(res.map00_tmx);
        this.addChild(this.map00);
        this.mapWidth = this.map00.getContentSize().width;
        this.map01 = new cc.TMXTiledMap(res.map01_tmx);
        this.map01.setPosition(cc.p(this.mapWidth, 0));
        this.addChild(this.map01);        

        cc.textureCache.addImage(res.background_png);
        cc.spriteFrameCache.addSpriteFrames(res.background_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.background_png);
        this.addChild(this.spriteSheet);

        this.loadObjects(this.map00, 0);
        this.loadObjects(this.map01, 1);
        // var size = cc.winSize;
        // var centerPos = cc.p(size.width/2, size.height/2);
        // var bg = new cc.Sprite(res.playBG_png);
        // bg.setPosition(centerPos);
        // this.addChild(bg);
    },
    loadObjects: function(map, mapIndex){
        //添加硬币
        var coinGroup = map.getObjectGroup("coin");//读取地图中对象的信息
        var coinArray = coinGroup.getObjects();
        for (var i = 0; i < coinArray.length; i++) {
            var coin = new Coin(this.spriteSheet,
                this.space,
                cc.p(coinArray[i]["x"] + this.mapWidth * mapIndex,coinArray[i]["y"]));
            coin.mapIndex = mapIndex;
            this.objects.push(coin);
        }

        // 添加岩石
        var rockGroup = map.getObjectGroup("rock");
        var rockArray = rockGroup.getObjects();
        for (var i = 0; i < rockArray.length; i++) {
            var rock = new Rock(this.spriteSheet,
                this.space,
                rockArray[i]["x"] + this.mapWidth * mapIndex);
            rock.mapIndex = mapIndex;
            this.objects.push(rock);
        }
    },
    removeObjects:function (mapIndex) {//通过mapIndex移除一个对象
        while((function (obj, index) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].mapIndex == index) {
                    obj[i].removeFromParent();
                    obj.splice(i, 1);
                    return true;
                }
            }
            return false;
        })(this.objects, mapIndex));
    },
    removeObjectByShape:function (shape) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getShape() == shape) {
                this.objects[i].removeFromParent();
                this.objects.splice(i, 1);
                break;
            }
        }
    },
    checkAndReload:function (eyeX) {
        var newMapIndex = parseInt(eyeX / this.mapWidth);
        if (this.mapIndex == newMapIndex) {
            return false;
        }

        if (0 == newMapIndex % 2) {
            // 改变mapSecond
            this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
            this.loadObjects(this.map01, newMapIndex + 1);
        } else {
            // 改变mapFirst
            this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
            this.loadObjects(this.map00, newMapIndex + 1);
        }
        this.removeObjects(newMapIndex - 1);
        this.mapIndex = newMapIndex;

        return true;
    }
})