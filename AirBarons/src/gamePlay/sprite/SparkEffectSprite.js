var SparkEffectSprite = cc.Sprite.extend({
    active: true,
    spark1: null,
    spark2: null,
    duration: 0.7, //持续时间
    ctor: function(){
        this.spark1 = this.creatSpark('explode2');
        this.spark2 = this.creatSpark('explode3');
    },
    creatSpark: function(id){
        var obj = new cc.Sprite('#'+id+'.png');
        obj.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        return obj;
    },
    reset: function(x, y){
        var attr = {
            x: x,
            y: y,
            scale: this.scale,
            opacity: 255
        };
        this.spark1.attr(attr);
        attr['rotation'] = Math.random() * 360;
        this.spark2.attr(attr);

        var right = cc.rotateBy(this.duration, 45);
        var scaleBy = cc.scaleBy(this.duration, 3, 3);
        var seq = cc.sequence(cc.fadeOut(this.duration), cc.callFunc(this.destroy, this));

        this.spark1.runAction(right);
        this.spark1.runAction(scaleBy);
        this.spark1.runAction(seq);
        //this.spark1.spawn(right, scaleBy, seq);

        this.spark2.runAction(cc.spawn(scaleBy.clone(), seq.clone()));

    },
    destroy: function(){
        this.active = false;
        this.spark1.visible = false;
        this.spark2.visible = false;
    },
    restore: function(){
        this.active = true;
        this.spark1.setVisible(true);
        this.spark2.setVisible(true);
    }
});

SparkEffectSprite.getOrCreateSparkEffect = function(x, y){
    var selChild = null, sparks = GC.CONTAINER.SPARKS;
    for (var j = 0; j < sparks.length; j++) {
        selChild = sparks[j];
        if (selChild.active == false) {
            selChild.restore();
            selChild.reset(x, y);
            return selChild;
        }
    }
    var spark = SparkEffectSprite.create();
    spark.reset(x, y);
    return spark;
};

SparkEffectSprite.create = function(){
    var sparkEffect = new SparkEffectSprite();
    g_GPTouchLayer.addSpark(sparkEffect.spark1);
    g_GPTouchLayer.addSpark(sparkEffect.spark2);
    GC.CONTAINER.SPARKS.push(sparkEffect);
    return sparkEffect;
};

SparkEffectSprite.preSet = function () {
    var sparkEffect = null;
    for (var i = 0; i < 6; i++) {
        sparkEffect = SparkEffectSprite.create();
        sparkEffect.destroy();
    }
};