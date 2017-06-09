(function () {
    'use strict';

    var Player = function () {
        //SpriteSheet Player
        this.imageName = 'player_image';
        this.imageUrl = 'assets/spritesheets/walk-idle-transform-BAT.png';
        this.sprite = null;
        
        //BatShot
        this.imageNameBatShot = 'batShot_image';
        this.imageUrlBatShot = 'assets/spritesheets/Sprites-morcego-bala-16x16.png';
        this.imageBatShot = null;
        
        //Lives Blood
        this.imageNameLives = 'lives_image';
        this.imageUrlLives = 'assets/img/blood.png';
        this.imageBloodLives = null;
        
        // Score Images
        this.imageNameScores = 'scores_image';
        this.imageUrlScores = 'assets/img/score-highscore.png';
        this.imageScores = null;
        
        gameManager.globals.score = 0;
        gameManager.globals.highScore = 0;
        gameManager.globals.scoreText = '';
                
        this.normalGravity = 750;
        this.fallingGravity = 50;
        this.jumpVelocity = -450;
        this.isJumping = false;
        this.isDoubleJumping = false;
        this.initialPositionX = 50;
        this.initialPositionY = this.game.height - 500;
        
        this.bullets;
        this.bulletTime = 0;
        this.bullet;
        
        //Sound Dead
        this.soundNameDead = 'deadSound';
        this.soundUrlDead = 'assets/sounds/player/die1.ogg';
        this.soundDead = null;
        
        // Sound ShotBats
        this.soundNameShot = 'shotSound';
        this.soundUrlShot = 'assets/sounds/player/longRangeHitBat2.ogg';
        this.soundShot = null;
        
        // Sound Jump
        this.soundNameJump = 'jumpSound';
        this.soundUrlJump = 'assets/sounds/player/jump1.ogg';
        this.soundJump = null;
        
        // Sound Pickup
        //this.soundNamePickupBlood = 'pickupSound';
        //this.soundUrlPickupBlood = 'assets/sounds/sipBlood.ogg';
        //this.soundPickup = null;
        this.stateContext = null;
    }

    Player.prototype.preload = function () {
        //Load Imagens
        // Player
        this.game.load.spritesheet(this.imageName, this.imageUrl, 48, 64);
        // Bullet Bat
        this.game.load.spritesheet(this.imageNameBatShot, this.imageUrlBatShot, 16, 16);
        // Lives
        this.game.load.image(this.imageNameLives, this.imageUrlLives);
        // Bg Score
        this.game.load.image(this.imageNameScores, this.imageUrlScores);

        //Load Sounds
        this.game.load.audio(this.soundNameDead, this.soundUrlDead);
        this.game.load.audio(this.soundNameShot, this.soundUrlShot);
        this.game.load.audio(this.soundNameJump, this.soundUrlJump); 
        
        
        //this.game.load.audio(this.soundNamePickupBlood, this.soundUrlPickupBlood);
    }

    Player.prototype.setup = function (stateContext) {   
        var self = this;

        //Criando balas
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true; 
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 40; i++){
            var b = this.bullets.create(0, 0, this.imageNameBatShot);
            b.name = 'imageNameBatShot' + i;
            b.animations.add('shotBat', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(this.resetBullet, this);
        }
        
        //SpriteSheet and Animations Player
        this.sprite = this.game.add.sprite(this.initialPositionX, this.initialPositionY, this.imageName);   
        this.sprite.frame = 0;
        this.sprite.animations.add('walk', [0, 1, 2, 3], 22, true);
        this.sprite.animations.add('idle', [4,5,6], 4, true);
        this.sprite.animations.add('transform', [7,8,9], 22, true);
        this.sprite.animations.add('batTransformation', [10,11,12,13,14,15,16,17,18,19], 22, true);
        this.sprite.animations.add('wolfRun', [10,11,12,13,14,15,16,17,18,19], 22, true);
        this.sprite.anchor.set(0.5);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = this.normalGravity;
        this.stateContext = stateContext;
        
        //Img Blood Lives
        this.imageBloodLives1 = this.game.add.sprite(40, 40, this.imageNameLives); 
        this.imageBloodLives1.anchor.set(0.5);
        this.imageBloodLives1.fixedToCamera = true;

        this.imageBloodLives2 = this.game.add.sprite(90, 40, this.imageNameLives); 
        this.imageBloodLives2.anchor.set(0.5);
        this.imageBloodLives2.fixedToCamera = true;

        this.imageBloodLives3 = this.game.add.sprite(140, 40, this.imageNameLives); 
        this.imageBloodLives3.anchor.set(0.5);
        this.imageBloodLives3.fixedToCamera = true;
        
        // Img Scores
        this.imageScores = this.game.add.sprite(400, 100, this.imageNameScores); 
        this.imageScores.anchor.set(0.5);
        this.imageScores.fixedToCamera = true;
        
        // Text Scores
        gameManager.globals.scoreText = this.game.add.text(140, 85, gameManager.globals.score, { fill: '#ffffff', align: 'center', fontSize: 32 });
        gameManager.globals.scoreText.anchor.set(0,0);
        gameManager.globals.scoreText.fixedToCamera = true;  
        
        //Sounds
        this.soundDead = this.game.add.audio(this.soundNameDead);
        this.soundShot = this.game.add.audio(this.soundNameShot);
        this.soundJump = this.game.add.audio(this.soundNameJump);
        //this.soundPickup = this.game.add.audio(this.soundNamePickupBlood);
        
        //Controles
        //this.keys = this.game.input.keyboard.createCursorKeys();
        // Movement Player
        this.leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        // Jump
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.jumpButton.onDown.add(this.jump, this);
        // Shot
        this.shotButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // Run
        this.runButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.runButton.onDown.add(this.run,this)

    }
    
    Player.prototype.decreaseLives = function () {
        gameManager.globals.lives--;
        this.soundDead.play();

        if(gameManager.globals.lives === 2) {
            this.imageBloodLives3.kill();
        }

        if(gameManager.globals.lives === 1) {
            this.imageBloodLives2.kill();
        }

        if(gameManager.globals.lives <= 0) {
            this.imageBloodLives1.kill();
            this.gameover();
        }
    }

    Player.prototype.checkIsJumping = function () {
        if((this.isJumping) && (this.sprite.body.touching.down || this.sprite.body.onFloor())) {
            this.isJumping = false;
            this.isDoubleJumping = false;
            this.sprite.animations.play('walk');
            this.sprite.body.gravity.y = this.normalGravity;
        }
    }

    Player.prototype.gameover = function () {
        this.checkIsJumping();
        this.game.state.start('lose');
    }
    
    Player.prototype.jump = function () { 
        if(this.sprite.body.touching.down || this.sprite.body.onFloor()) {
            this.isJumping = true;
            return doJump.apply(this);
        }
        else if(!this.isDoubleJumping) {
            this.isDoubleJumping = true;
            this.sprite.animations.play('batTransformation');            
            return doJump.apply(this);
        }

        function doJump() {
            this.sprite.body.velocity.y = this.jumpVelocity || -450;
            this.soundJump.play();
        }
    }
        
    Player.prototype.run = function () {
        if(this.sprite.body.velocity.x != 0 && this.isJumping == false) {  
            this.sprite.animations.play('transform');
            this.sprite.scale.x = 1 * Math.sign(this.sprite.body.velocity.x);
            this.sprite.body.velocity.x = (this.sprite.body.velocity.x * 15);
            console.log("correndo: ",this.sprite.body.velocity.x);
        }
    }

    Player.prototype.groundCollision = function (playerSprite) {
        this.checkIsJumping();
    }

    Player.prototype.handleInputs = function () {      
        if(this.leftButton.isDown){
            this.sprite.body.velocity.x = -150; // Ajustar velocidade
            // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
            if(this.sprite.scale.x == 1) this.sprite.scale.x = -1;
            // Iniciando a animação 'walk'
            if(!this.isJumping) {
                this.sprite.animations.play('walk');
            }
        }

        // mover o sprite para a direita
        else if(this.rightButton.isDown){
            // se a tecla direita estiver pressionada
            this.sprite.body.velocity.x = 150;  // Ajustar velocidade
            // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
            if(this.sprite.scale.x == -1) this.sprite.scale.x = 1;

            if(!this.isDoubleJumping) {
                this.sprite.animations.play('walk');
            }
        }
        else {
            // Ajustar velocidade para zero
            this.sprite.body.velocity.x = 0;
            
            if(!this.isJumping && !this.isDoubleJumping) {
                this.sprite.animations.play('idle');   
            }
             
            if(!this.isDoubleJumping) {
                this.sprite.animations.play('');
            }
        }
        
        if (this.shotButton.isDown){
            this.fire();
        }
    }

    Player.prototype.checkGravity = function () {
        if(this.sprite.body.velocity.y >= 0 && this.isDoubleJumping) {
            this.sprite.body.gravity.y = this.fallingGravity;
        }
    }
    
    // Score
    Player.prototype.increaseScoreRatos = function () {
        gameManager.globals.score = gameManager.globals.score + 50;
        gameManager.globals.scoreText.setText(gameManager.globals.score);
    }
    
    Player.prototype.increaseScoreEnemies = function () {
        gameManager.globals.score = gameManager.globals.score + 100;
        gameManager.globals.scoreText.setText(gameManager.globals.score);
    }
    
    
    //Shot Bats
    Player.prototype.fire = function () {
        if (this.game.time.now > this.bulletTime) {
            this.bullet = this.bullets.getFirstExists(false);
            if (this.bullet) {
                this.bullet.reset(this.sprite.x, this.sprite.y);
                if (this.sprite.scale.x == 1) {
                    this.bullet.body.velocity.x = 300;
                    this.soundShot.play();
                    this.bullet.animations.play('shotBat');
                    this.bulletTime = this.game.time.now + 150;
                } else {
                    this.bullet.body.velocity.x = -300;
                    this.soundShot.play()
                    this.bullet.animations.play('shotBat');
                    this.bulletTime = this.game.time.now + 150;
                }
            }
        }
    }
    
    Player.prototype.resetBullet = function(bullet) {
        bullet.kill();
    }
    gameManager.addSprite('player', Player);

})();
