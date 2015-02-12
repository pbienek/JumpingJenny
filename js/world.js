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
    },



    stats : function(){


        this.score = $.game.add.text(800, 30, "SCORE: 0", {
            font: "20px Arial",
            fill: "#fff",
            align: "left"
        });


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
                name : 'star',
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
                    item_list.push(randomNumberGen(1,3));
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




        deleteWastage(obstacle);
        deleteWastage(gift);

        function deleteWastage(item){


            if(item != null){

                //Delete items when they are off screen
                if(item.x < -item.width){
                    item.destroy();
                }

                //Add points as soon as player jumps item
                if((item.x + item.width) < $.player.image.x && !item.points_awarded){
                    item.points_awarded = true;
                    $.player.points += 10;
                    $.world.score.setText("SCORE: "+$.player.points);
                }

            }

        }


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


































