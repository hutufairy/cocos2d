var res = {
    helloBG_png : "res/helloBG.png",
    start_n_png : "res/start_n.png",
    start_s_png : "res/start_s.png",
    restart_n_png : "res/restart_n.png",
    restart_s_png : "res/restart_s.png",
    playBG_png: "res/PlayBG.png",
    runner_png: "res/runner.png",
    running_png: "res/running.png",
    running_plist: "res/running.plist",
    map_png: "res/map.png",
    map00_tmx: "res/map00.tmx",
    map01_tmx: "res/map01.tmx",
    background_png :"res/background.png",
    background_plist : "res/background.plist"  
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}