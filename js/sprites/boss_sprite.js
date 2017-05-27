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
        this.initialPositionY = 440;
        this.gravity = 750;
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
    Boss.prototype.setup = function () {   
        // required
        // here you'll actually create your sprite
        this.sprite = this.game.add.sprite(this.initialPositionX, this.initialPositionY, this.imageName);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = this.gravity;
        this.sprite.width = 100; 
        this.sprite.height = 100; 
    }

    /**
     * @type Optional
     */
    Boss.prototype.customMethod = function () {
        // write here your custom method
    }

    // required
    gameManager.addSprite('boss', Boss);

})();
