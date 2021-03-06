var MMMainMenuLayer = cc.Layer.extend({
    ctor: function(){
        this._super();
        cc.MenuItemFont.setFontSize(18);
        cc.MenuItemFont.setFontName("Arial");
        var systemMenu = new cc.MenuItemFont("Main Menu", this.onSysMenu);
        var menu = new cc.Menu(systemMenu);
        menu.x = 0;
        menu.y = 0;
        systemMenu.attr({
            x: GC.w - 95,
            y: 5,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(menu, 1, 2);
    },
    onSysMenu: function(pSender){
        if(GC.GAME_STATE != GC.GAME_STATE_ENUM.HOME){
            GC.GAME_STATE = GC.GAME_STATE_ENUM.HOME;
            cc.audioEngine.stopMusic();
        }
        cc.audioEngine.stopAllEffects();
        cc.director.runScene(new cc.TransitionFade(1.2, new MainMenuScene()));
    }
});