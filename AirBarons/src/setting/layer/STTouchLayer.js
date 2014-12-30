var STTouchLayer = cc.Layer.extend({

    ctor : function(){

        this._super();
        this.initTouchOption();

    },
    initTouchOption : function(){
        //标题
        var title = new cc.Sprite(res.st_menuTitle_png, cc.rect(0, 0, 134, 34));
        title.x = GC.w_2;
        title.y = GC.h - 120;
        this.addChild(title);

        var t1 = this.setMenu('Sound'),
            t2 = this.setMenu('Mode');

        var item1 = new cc.MenuItemToggle(
                this.setMenu('On', 26),
                this.setMenu('Off', 26)
            );

        var item2 = new cc.MenuItemToggle(
                this.setMenu('Easy', 26),
                this.setMenu('Normal', 26),
                this.setMenu('Hard', 26)
            );
        //设置颜色 
        //t2.setColor(cc.color(255, 0, 0, 255));
        var label = new cc.LabelTTF('Go Back', 'Arial', 20);
        var back = new cc.MenuItemLabel(label, this.onBackCallback);
        back.scale = 0.8;

        t1.setEnabled(false);
        t2.setEnabled(false);

        item1.setCallback(this.onSoundControl);
        item1.setSelectedIndex(!GC.SOUND_ON * 1);

        item2.setCallback(this.onModeControl);

        var menu = new cc.Menu(t1, t2, item1, item2, back);

        // 类似网格布局，三行，第一行为2列，第二行为2列，第三行为1列
        menu.alignItemsInColumns(2, 2, 1);
        this.addChild(menu);
        back.y -= 50;
    },
    onSoundControl: function(){
        GC.SOUND_ON = !GC.SOUND_ON;
        var audioEngine = cc.audioEngine;
        if(GC.SOUND_ON){
            if(!audioEngine.isMusicPlaying()){
                audioEngine.playMusic(res.mm_bgMusic_mp3, true);
            }
        }else{
            audioEngine.stopMusic();
            audioEngine.stopAllEffects();
        }
    },
    onModeControl: function(){
        cc.log('[STTouchLayer]: changeModeChange');
    },
    onBackCallback: function(){
        cc.log('[STTouchLayer]: onBack');
        cc.director.runScene(new cc.TransitionFade(1.2, new MainMenuLayer()));
    },
    setMenu: function(txt, size){
        size = 18 || size;
        cc.MenuItemFont.setFontName('Arial');
        cc.MenuItemFont.setFontSize(size);
        return (new cc.MenuItemFont(txt));
    }
});