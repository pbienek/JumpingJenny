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
        var loadingBar = this.add.sprite(480,300,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

        //MENUS
        this.game.load.image("home","assets/home_screen.png");
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
        this.game.load.image('spider', 'assets/spider.png');

        //ITEMS _ POSITIVE
        this.game.load.image('chocolate', 'assets/chocolate.png');
        this.game.load.image('tea', 'assets/tea.png');
        this.game.load.image('cake', 'assets/cake.png');

        //PLAYER
        this.game.load.spritesheet('player', 'assets/player_sprite.png', 145, 190, 10);

        //Particles
        this.game.load.image('heart', 'assets/heart.png');


        //FONTS
        this.game.load.bitmapFont('valentines', 'assets/valentines.png', 'assets/valentines.xml');



        //SOUNDS
        this.game.load.audio('item', 'assets/item_sound.wav');
        this.game.load.audio('bested', 'assets/best_score_sound.wav');


    },

    create: function(){
        this.game.state.start("Title");
    }
};




titleScreen.prototype = {

    create: function(){

        $.game.add.sprite(0, 0, 'home');


        var playButton = this.game.add.button(600,360,"play",this.startPlaying, this);
        playButton.anchor.setTo(0.5,0.5);
        $.game.add.tween(playButton).to({ y: 340 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);


        var fs_button = this.game.add.button(600,510,"fullscreen",this.fullScreen, this);
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
        var gameOverTitle = this.game.add.sprite(0,0,"gameover");

        var playButton = this.game.add.button(480,530,"play",this.playTheGame,this);
        playButton.anchor.setTo(0.5,0.5);
        //this.game.state.start("TheGame");

        var b_score =  localStorage.getItem("jlj_best_score") || 0;



        var score = $.game.add.bitmapText(560, 295, 'valentines', $.player.points.toString());
        var best_score = $.game.add.bitmapText(560, 385, 'valentines', $.world.best_score.toString());


        if($.player.points > b_score){

            localStorage.setItem("jlj_best_score", $.player.points)
        }
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



//DONE: Improve item placement algorithm
//DONE: Add sprites for player
//DONE: Add item images
//DONE: Add positive items
//DONE: Improve leveling system


//DONE: Create screens for loading, title and game over states
//DONE: Add animations when you get a positive item
//DONE: Record and display top score


//TODO: Add ducking game mechanic
//TODO: Credit must be given to kiririn & habeastibi for heart pattern used on title screen


























