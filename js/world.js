/**
 * Created by Peter Bienek on 08/02/2015.
 */


$.world = {


    create : function(){



        this.ground         = null;
        this.spawn_time     = 3000;
        this.next_spawn     = 0;
        this.tick           = 0;
        this.last_tick      = 0;
        this.speed          = -300;
        this.ground_speed   = 3.3;
        this.bush_speed     = 1.2;
        this.current_level  = 1;


        $.game.physics.startSystem(Phaser.Physics.ARCADE);

        $.game.add.sprite(0,0, 'sky');

        this.ground = $.game.add.sprite(0, $.game.world.height - 124, 'ground');
        $.game.physics.arcade.enable(this.ground);

        this.ground.body.immovable = true;

        this.mountain_tile = $.game.add.tileSprite(0, 280 , 960, 960, 'mountains');
        this.bush_tile     = $.game.add.tileSprite(0, $.game.world.height - 190, 960, 960, 'bushes');
        this.ground_tile   = $.game.add.tileSprite(0, $.game.world.height - 124, 960, 960, 'ground');

        this.obstacles  = $.game.add.group();
        this.obstacles.enableBody = true;

        this.gift_items = $.game.add.group();
        this.gift_items.enableBody = true;

        this.stats();


        this.emitter = $.game.add.emitter(0, 0, 100);
        this.emitter.makeParticles('heart');
        this.emitter.gravity = 200;

        this.item_sound = $.game.add.audio('item');
        this.bested = $.game.add.audio('bested');
        this.go_sound = $.game.add.audio('game_over');

    },



    stats : function(){

        this.best_score = localStorage.getItem("jlj_best_score") || 0;
        this.best_score_display = $.game.add.bitmapText(30, 30, 'valentines', "best: " + this.best_score);
        this.score = $.game.add.bitmapText(700, 30, 'valentines', "score: 0");

    },



    spawner : function(){

        var items = [

            {
                name : null,
                type : null
            },
            {
                name : 'cat',
                type : 'negative'
            },
            {
                name : 'poop',
                type : 'negative'
            },
            {
                name : 'spider',
                type : 'negative'
            },
            {
                name : 'chocolate',
                type : 'positive'
            },
            {
                name : 'tea',
                type : 'positive'
            },
            {
                name : 'cake',
                type : 'positive'
            }
        ];


        var placements = generateItemPlacement();

        for(var i = 0; i < placements.length; i++){

            var item_name      = items[placements[i]].name;

            if(item_name !== null){

                var spacing        = (350 + ($.world.current_level * 15));
                var x_position     = (960 + (i * spacing));

                if(items[placements[i]].type === 'negative'){
                    addObstacle();
                }

                if(items[placements[i]].type === 'positive'){
                    addGift();
                }


            }
        }


        function addObstacle(){

            var obstacle_image = $.game.cache.getImage(item_name);
            var height         = ($.game.world.height - $.world.ground.height) - (obstacle_image.height - 4);
            var spawn_item     = $.world.obstacles.create(x_position, height, item_name);
            spawn_item.body.velocity.x = $.world.speed;
        }

        function addGift(){
            var spawn_item     = $.world.gift_items.create(x_position, 100, item_name);
            spawn_item.body.velocity.x = $.world.speed;
        }


        function generateItemPlacement(){

            var item_list = [];
            var list_lng  = 5;

            while(list_lng--){

                var x = Math.round(Math.random());

                if(x){
                    item_list.push(randomNumberGen(1,6));
                }
                else {

                    item_list.push(0);

                }
            }

            return item_list;
        }


        function randomNumberGen(min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }
    },




    update : function(){


        //check for player item overlap
        if($.game.physics.arcade.overlap(this.obstacles, $.player.image)){
            this.go_sound.play()
            $.game.state.start("GameOver");
        }

        //Paralex backgrounds
        this.mountain_tile.tilePosition.x -= 0.5;
        this.bush_tile.tilePosition.x -= 1.2;
        this.ground_tile.tilePosition.x -= this.ground_speed;


        if(this.obstacles.total == 0 && this.gift_items.total == 0){
            this.level_up();
            this.spawner();
        }

        var obstacle = this.obstacles.getFirstAlive();
        var gift     = this.gift_items.getFirstAlive();



        if(obstacle != null){
            //Delete obstacle when they are off screen
            if(obstacle.x < -obstacle.width){
                obstacle.destroy();
            }

            //Add points as soon as player jumps over teh obstacle
            if((obstacle.x + obstacle.width) < $.player.image.x && !obstacle.points_awarded){
                obstacle.points_awarded = true;
                $.player.points += 10;
                $.world.score.setText("score: "+$.player.points);
            }
        }

        if(gift !== null){
            //Delete obstacle when they are off screen
            if(gift.x < -gift.width){
                gift.destroy();
            }
        }

        this.gift_items.forEach(function(item) {


            if($.game.physics.arcade.overlap(item, $.player.image)){
                //delete item
                item.destroy();

                //award points
                $.player.points += 50;
                $.world.score.setText("score: "+$.player.points);
                $.world.item_sound.play();

                //create particle effect
                this.emitter.x = item.x;
                this.emitter.y = item.y;

                //  The first parameter sets the effect to "explode" which means all particles are emitted at once
                //  The second gives each particle a 2000ms lifespan
                //  The third is ignored when using burst/explode mode
                //  The final parameter (10) is how many particles will be emitted in this single burst
                this.emitter.start(true, 2000, null, 10);
            }


        }, this);



        if($.player.points > $.world.best_score && !$.player.beaten_best){


            $.player.beaten_best = true;
            $.world.bested.play();

        }



        //Fade out particles
        this.emitter.forEachAlive(function(p){
            p.alpha = (p.lifespan / $.world.emitter.lifespan);
        });


    },



    level_up : function(){


        if(this.speed > -1000){
            this.speed       -= 30;
            this.current_level++;

            this.ground_speed = (Math.abs(this.speed) / 60.6);
            this.bush_speed = (Math.abs(this.speed) / 166.6);
        }

        console.log(this.speed)

    }






};


































