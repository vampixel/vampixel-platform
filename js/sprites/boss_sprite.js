/**
 * @author Paulo Matos
 * @description Use this example for creating new sprites
 */
(function () {
    'use strict';

    /**
     * @type Required
     * @description you can't use it as a sprite constructor. Instead, use the `setup` method
     */
    var Boss = function () {
        // required
        this.sprite = null; 

        // the bellow properties are optionals
        // you can hard code it when creating the sprite directly
        this.imageName = 'boss_image';
        this.imageUrl = 'assets/img/red_square_10x10.png';
        this.initialPositionX = 600;
        this.initialPositionY = 500;
        this.width = 100;
        this.height = 100;
        this.gravity = 750;
        this.velocity = 5;
        this.stateContext = null;
        this.isGoing = '';
    }

    /**
     * @type Optional
     * @description Call it inside the preload method in your state
     */
    Boss.prototype.preload = function () {
        this.game.load.image(this.imageName, this.imageUrl);
    }

    /**
     * @type Required
     * @description Call it inside the create method in your state
     */
    Boss.prototype.setup = function (stateContext) {   
        this.sprite = this.game.add.sprite(this.initialPositionX, this.initialPositionY, this.imageName);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.anchor.set(0.5);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.width = this.width; 
        this.sprite.height = this.height; 
        this.stateContext = stateContext;
    }

    /**
     * @type Optional
     */
    Boss.prototype.move = function () {
        // if(this.sprite.body.velocity.x != 0) {
        //     this.sprite.scale.x = 1 * Math.sign(this.sprite.body.velocity.x);
        // }
    }

    // required
    gameManager.addSprite('boss', Boss);

})();
