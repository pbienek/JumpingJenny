/**
 * Created by Peter Bienek on 03/02/2015.
 */

var $  = {};
var boot        = function(game){};
var preload     = function(game){};
var titleScreen = function(game){};
var theGame     = function(game){};
var gameOver    = function(game){};

boot.prototype = {
    preload:function(){
        this.game.load.image("loading","assets/loading.png");
    },

    create: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.setScreenSize();
        this.game.state.start("Preload");
    }
};




preload.prototype = {

    preload: function(){
        //LOADING SCREEN
        var loadingBar = this.add.sprite(160,240,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

        //MENUS
        this.game.load.image("play","assets/play.png");
        this.game.load.image("fullscreen","assets/fullscreen.png");
        this.game.load.image('gameover', 'assets/gameover.png');

        //SCENERY
        this.game.load.image('sky', 'assets/background-sky.png');
        this.game.load.image('ground', 'assets/ground.png');
        this.game.load.image('bushes', 'assets/bushes.png');
        this.game.load.image('mountains', 'assets/mountain-range.png');

        //ITEMS - NEGATIVE
        this.game.load.image('poop', 'assets/poop.png');
        this.game.load.image('cat', 'assets/cat.png');

        //ITEMS _ POSITIVE
        this.game.load.image('star', 'assets/positive-item.png');

        //PLAYER
        this.game.load.spritesheet('player', 'assets/player_sprite.png', 145, 190, 10);
    },

    create: function(){
        this.game.state.start("Title");
    }
};




titleScreen.prototype = {

    create: function(){
        var playButton = this.game.add.button(480,220,"play",this.startPlaying, this);
        playButton.anchor.setTo(0.5,0.5);


        var fs_button = this.game.add.button(480,420,"fullscreen",this.fullScreen, this);
        fs_button.anchor.setTo(0.5,0.5);

        //this.game.state.start("TheGame");
    },


    startPlaying: function(){
        this.game.state.start("TheGame");
    },


    fullScreen : function(){
        $.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        $.game.scale.startFullScreen(true);
    }
};



theGame.prototype = {


    create : function(){
        $.world.create();
        $.player.create();
    },


    update : function(){
        $.world.update();
        $.player.update();
    },


    render : function(){
        //$.game.debug.text('obstacles: ' + $.world.obstacles.total, 74, 580);
        //$.game.debug.text('gifts: ' + $.world.gift_items.total, 200, 580);
        //$.game.debug.text('SCORE: ' + $.player.points, 800, 30);
    }


};


gameOver.prototype = {

    create: function(){
        var gameOverTitle = this.game.add.sprite(160,160,"gameover");
        gameOverTitle.anchor.setTo(0.5,0.5);

        var playButton = this.game.add.button(160,320,"play",this.playTheGame,this);
        playButton.anchor.setTo(0.5,0.5);
        //this.game.state.start("TheGame");


    },
    playTheGame: function(){
        this.game.state.start("TheGame");
    }
};




$.game = new Phaser.Game(960,640, Phaser.AUTO, 'game_container');
$.game.state.add("Boot",boot);
$.game.state.add("Preload",preload);
$.game.state.add("Title",titleScreen);
$.game.state.add("TheGame",theGame);
$.game.state.add("GameOver",gameOver);




$.game.state.start("Boot");



//TODO: Improve item placement algorithm
//IDEA: call spawn function when there are no items left then place multiples according to a grid structure
//use arrays
//TODO: Add sprites for player
//TODO: Add item images
//TODO: Add positive items
//TODO: Improve leveling system





//TODO: Create screens for loading, title and game over states
//TODO: Add animations when you get a positive item
//TODO: Record and display top score


//TODO: Add ducking game mechanic


























