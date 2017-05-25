(function () {
    'use strict';

    var Player = function () {
        //SpriteSheet Player
        this.imageName = 'player_image';
        this.imageUrl = 'assets/spritesheets/walk-idle-transform-BAT.png';
        this.sprite = null;
        
        //BatShot
        this.imageNameBatShot = 'batShot_image';
        this.imageUrlBatShot = 'assets/img/red_square_10x10.png';
        this.imageBatShot = null;
        
        //Sound Jump
        this.soundNameJump = 'jumpSound';
        this.soundUrlJump = 'assets/sounds/jump2.ogg';
        this.soundJump = null;
        
        //Sound Pickup
        this.soundNamePickupBlood = 'pickupSound';
        this.soundUrlPickupBlood = 'assets/sounds/sipBlood.ogg';
        this.soundPickup = null;
        
        this.gravity = 750;
        this.jumpVelocity = -450;
        this.isJumping = false;
        this.isDoubleJumping = false;
        this.initialPositionX = 100;
        this.initialPositionY = this.game.height - 500;
    }

    Player.prototype.preload = function () {
        //Imagens
        this.game.load.spritesheet(this.imageName, this.imageUrl, 48, 64);
        this.game.load.image(this.imageNameBatShot, this.imageUrlBatShot);
        
        //Sounds
        this.game.load.audio(this.soundNameJump, this.soundUrlJump);
        this.game.load.audio(this.soundNamePickupBlood, this.soundUrlPickupBlood);
    }

    Player.prototype.setup = function (stateContext) {   
        //SpriteSheet and Animations Player
        this.sprite = this.game.add.sprite(this.initialPositionX, this.initialPositionY, this.imageName);   
        this.sprite.frame = 0;
        this.sprite.animations.add('walk', [0, 1, 2, 3], 22, true);
        this.sprite.animations.add('transform', [7,8,9], 22, true);
        this.sprite.animations.add('batGirl', [10,11,12,13,14,15,16,17,18,19], 22, true);
        //this.sprite.animations.add('jump', [], , true);
        this.sprite.anchor.set(0.5);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = this.gravity;
        this.stateContext = stateContext;
                
        //Sounds
        this.soundJump = this.game.add.audio(this.soundNameJump);
        this.soundPickup = this.game.add.audio(this.soundNamePickupBlood);
        
        //Controles
        this.keys = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.jumpButton.onDown.add(this.jump, this);
        //this.shotButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    }

    Player.prototype.jump = function () {
        
        var onFloor = this.sprite.body.onFloor();

        if(onFloor) {
            this.isJumping = true;
            return doJump.apply(this);
        }
        else if(!this.isDoubleJumping) {
            //console.log('double jump...');
            this.isDoubleJumping = true;
            //this.sprite.animations.play('transform');
            this.sprite.animations.play('batGirl');
            return doJump.apply(this);
        }

        function doJump() {
            //this.sprite.animations.play('jump');
            this.sprite.body.velocity.y = this.jumpVelocity || -450;
            this.soundJump.play();
        }
    }

    Player.prototype.groundCollision = function (playerSprite) {
        if((this.isJumping) && (this.sprite.body.touching.down || this.sprite.body.onFloor())) {
            this.isJumping = false;
            this.isDoubleJumping = false;
            //this.sprite.animations.stop('batGirl');
        }
    }

    Player.prototype.handleInputs = function () {

        if(this.keys.left.isDown){
            this.sprite.body.velocity.x = -150; // Ajustar velocidade
            // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
            if(this.sprite.scale.x == 1) this.sprite.scale.x = -1;
            // Iniciando a animação 'walk'
            this.sprite.animations.play('walk');
        }
        // Se a tecla direita estiver pressionada (this.keys.right.isDown == true),
        // mover o sprite para a direita
        else if(this.keys.right.isDown){
            // se a tecla direita estiver pressionada
            this.sprite.body.velocity.x = 150;  // Ajustar velocidade
            // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
            if(this.sprite.scale.x == -1) this.sprite.scale.x = 1;
            this.sprite.animations.play('walk');
        }
        else {
            // Ajustar velocidade para zero
            this.sprite.body.velocity.x = 0;
            this.sprite.animations.stop('walk');
            this.sprite.animations.play('idle');
        }
    }

    Player.prototype.bloodCollision = function (player, blood) {
        this.soundPickup.play();
        this.bloodParticleEmitter.setSize(1, 1);
        this.bloodParticleEmitter.x = blood.x;
        this.bloodParticleEmitter.y = blood.y;
 
        this.bloodParticleEmitter.start(true, 500, null, 500);

        // calculate new score
        var newPoint = calculatePoints.call(this, (blood.y));

        // display to the player
        displayNewPoint.call(this, newPoint, blood.x, blood.y)

        // update score
        this.score = this.score + newPoint;
        this.scoreText.setText(this.score);

        // destroy blood
        blood.kill();

        if(this.score >= gameManager.globals.scoreToGoToLevel2) {
            this.game.state.start('level2');
        }
    }
    // give points based on the Y of blood
            /*function calculatePoints(bloodY) {
                if(bloodY <= 150) {
                    return 5;
                }
                if(bloodY <= 200) {
                    return 3;
                }
                if(bloodY <= 300) {
                    return 2;
                }
                    return 1;
                }*/

    function displayNewPoint(newPoint, x, y) {
        var newPointText = this.game.add.text(x, y, '+' + newPoint, { fill: '#ffffff', align: 'center', fontSize: 15 });
        newPointText.anchor.set(0.5);

        this.game.add.tween(newPointText).to({ y: newPointText.y - 50, alpha: 0 }, 500, "Linear", true);
        setTimeout(function () {
            newPointText.kill();
        }, 500)
    }

    gameManager.addSprite('player', Player);

})();