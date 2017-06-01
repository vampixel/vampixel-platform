/**
 * @author Paulo Matos
 */
(function () {
    'use strict';

    var Boss = function () {
        this.sprite = null; 

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

    Boss.prototype.preload = function () {
        this.game.load.image(this.imageName, this.imageUrl);
    }
    
    Boss.prototype.setup = function (stateContext) {   
        this.sprite = this.game.add.sprite(this.initialPositionX, this.initialPositionY, this.imageName);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.anchor.set(0.5);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.width = this.width; 
        this.sprite.height = this.height; 
        this.stateContext = stateContext;
    }

    Boss.prototype.move = function () {
    }

    // required
    gameManager.addSprite('boss', Boss);

})();
