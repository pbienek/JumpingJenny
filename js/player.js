/**
 * Created by Peter Bienek on 08/02/2015.
 */
$.player = {



    beaten_best : false,




    preload : function(){



    },


    create : function(){

        this.points = 0;

        this.image = $.game.add.sprite(240, $.game.world.height - 360, 'player');

        this.image.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);

        this.image.animations.play('run');

        this.downward_gravity = 3500;


        $.game.physics.arcade.enable(this.image);

        //this.image.body.bounce.y = 0.2;
        this.image.body.gravity.y = 2000;
        this.image.body.collideWorldBounds = true;
        //this.image.body.maxVelocity.y = 450;


        //width, height, x, y
        this.image.body.setSize(70, 190, 38, 0);


        this.controls();
    },



    controls : function(){

        //this.jumpButton = $.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        $.game.input.onDown.add(this.movement, $.game);

    },



    movement : function(){


        if($.player.image.body.touching.down){
            $.player.image.body.velocity.y -= 1100;
        }





        //else {
        //
        //
        //    if(this.jumpButton.isDown && this.jump_timer != 0){
        //
        //
        //        if(this.jump_timer > 15){
        //            this.jump_timer = 0;
        //        }
        //
        //        else {
        //
        //            this.jump_timer++;
        //            this.image.body.velocity.y += -10;
        //        }
        //    }
        //    else{
        //
        //        if (this.jump_timer != 0) {
        //            this.jump_timer = 0;
        //        }
        //    }
        //}

    },




    update : function(){

        $.game.physics.arcade.collide($.player.image, $.world.ground);

        //if(this.jumpButton.isDown && $.player.image.body.touching.down){
        //
        //    $.player.image.body.velocity.y -= 1000;
        //}
        //

        if(this.image.body.velocity.y < 0){
            $.player.image.frame = 8;
        }

        if(this.image.body.velocity.y > 0){
            $.player.image.frame = 9;
        }


        //Increase gravity if falling
        if($.player.image.body.velocity.y > 0){
            this.image.body.gravity.y = this.downward_gravity;
        }
        //Otherwise we're jumping
        else {
            this.image.body.gravity.y = 2000;
        }

    }


};