(function () {
    'use strict';

    var Player = function () {
        //SpriteSheet Player
        this.imageName = 'player_image';
        this.imageUrl = 'assets/spritesheets/walk-idle-transform-BAT.png';
        
        //SpriteSheet Player Jump
        this.imageJumpName = 'player_jump_image';
        this.imageJumpUrl = 'assets/spritesheets/jump-vampixel-128x128.png';
        
        //SpriteSheet Player Bat Fly
        this.imageBatFlyName = 'player_batfly_image';
        this.imageBatFlyUrl = 'assets/spritesheets/batflyItems.png';
        
        //BatShot
        this.imageNameBatShot = 'batShot_image';
        this.imageUrlBatShot = 'assets/spritesheets/Sprites-morcego-bala-16x16.png';
        
        //Lives Blood
        this.imageNameLives = 'lives_image';
        this.imageUrlLives = 'assets/img/blood.png';
        
        //Select Item Hud
        this.imageSelectHud = 'select_hud_image';
        this.imageUrlSelectHud = 'assets/spritesheets/select-item.png';
        
        //Bat Hud
        this.imageBatHud = 'bat_hud_image';
        this.imageUrlBatHud = 'assets/spritesheets/bat_hud.png';
        
        //Capa Hud
        this.imageCapHud = 'capa_hud_image';
        this.imageUrlCapHud = 'assets/spritesheets/capa_hud.png';    
        
        //Select Item Hud
        this.imageSelectHud = 'select_hud_image';
        this.imageUrlSelectHud = 'assets/spritesheets/select-item.png';
                
        
        gameManager.globals.score = 0;
        gameManager.globals.scoreText = '';

        this.amountOfBats = 0;
                
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
        this.canFire = true;
        
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
        //Player Jump
        this.game.load.spritesheet(this.imageJumpName, this.imageJumpUrl, 128, 128);
        //Player Bat Fly
        this.game.load.spritesheet(this.imageBatFlyName, this.imageBatFlyUrl, 64, 64);
        // Bullet Bat
        this.game.load.spritesheet(this.imageNameBatShot, this.imageUrlBatShot, 16, 16);
        // Lives
        this.game.load.image(this.imageNameLives, this.imageUrlLives);
        // Bg Score
        this.game.load.image(this.imageNameScores, this.imageUrlScores);
         // hud
        this.game.load.image(this.imageSelectHud, this.imageUrlSelectHud);
        this.game.load.image(this.imageBatHud, this.imageUrlBatHud);
        this.game.load.image(this.imageCapHud, this.imageUrlCapHud);
        
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
            b.animations.add('shotBat', [0, 1, 2, 3, 4, 5, 6, 7], 100, true);
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
        this.sprite.animations.add('batTransformation', [11,12,13,14,15,16,17,18,19], 10, true);
        this.sprite.animations.add('wolfRun', [10,11,12,13,14,15,16,17,18,19], 22, true);
        // Animations Player Jump
        this.sprite.animations.add('singleJump', [0,1,2,3,4,5,6,7], 10, false);
        // Animations Player Bat Fly
        this.sprite.animations.add('batFly', [1,2,3,4,5,6,7,8,9], 66, true);
        this.sprite.anchor.set(0.5);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = this.normalGravity;
        this.stateContext = stateContext;
        
        //Img Blood Lives
        this.imageBloodLives1 = this.game.add.sprite(40, 25, this.imageNameLives); 
        this.imageBloodLives1.anchor.set(0.5);
        this.imageBloodLives1.fixedToCamera = true;

        this.imageBloodLives2 = this.game.add.sprite(90, 25, this.imageNameLives); 
        this.imageBloodLives2.anchor.set(0.5);
        this.imageBloodLives2.fixedToCamera = true;

        this.imageBloodLives3 = this.game.add.sprite(140, 25, this.imageNameLives); 
        this.imageBloodLives3.anchor.set(0.5);
        this.imageBloodLives3.fixedToCamera = true;
        
        //Hud
        this.imageSelectHudBat = this.game.add.sprite(200, 40, this.imageSelectHud); 
        this.imageSelectHudBat.anchor.set(0.5);
        this.imageSelectHudBat.fixedToCamera = true;
        
        this.imageBatHudView = this.game.add.sprite(204, 45, this.imageBatHud); 
        this.imageBatHudView.anchor.set(0.5);
        this.imageBatHudView.fixedToCamera = true;
        
        this.imageSelectHudCapa = this.game.add.sprite(280, 40, this.imageSelectHud); 
        this.imageSelectHudCapa.anchor.set(0.5);
        this.imageSelectHudCapa.fixedToCamera = true;
        
        
        this.imageCapHudView = this.game.add.sprite(280, 40, this.imageCapHud); 
        this.imageCapHudView.anchor.set(0.5);
        this.imageCapHudView.fixedToCamera = true;
                
        // Text Scores
        gameManager.globals.scoreText = this.game.add.text(640, 10, gameManager.globals.score, { fill: '#ffffff', align: 'center', fontSize: 32 });
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
        
        //hud
        this.butButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.capaButton = this.game.input.keyboard.addKey(Phaser.Keyboard.E);

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
            this.sprite.loadTexture(this.imageName);
            this.sprite.anchor.set(0.5);
            this.sprite.animations.play('walk');
            this.sprite.body.gravity.y = this.normalGravity;
            console.log("checkIsJumping()");
        }
    }

    Player.prototype.gameover = function () {
        this.checkIsJumping();
        this.game.state.start('lose');
    }
    
    Player.prototype.jump = function () { 
        if(this.sprite.body.touching.down || this.sprite.body.onFloor()) {
            this.isJumping = true;
            this.sprite.loadTexture(this.imageJumpName, 0, true);
            this.sprite.anchor.set(0.5,0.7);
            this.sprite.animations.play('singleJump');
            this.sprite.events.onAnimationComplete.add(function(){
                this.sprite.loadTexture(this.imageName);
                this.sprite.anchor.set(0.5);
            },this);
            return doJump.apply(this);
        }
        else if(!this.isDoubleJumping) {
            this.isDoubleJumping = true;
            this.sprite.loadTexture(this.imageBatFlyName);
            this.sprite.animations.play('batFly');
            this.sprite.events.onAnimationComplete.add(function(){
                this.sprite.loadTexture(this.imageName);
                //this.sprite.anchor.set(0.5);
            },this);
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
        
        
        
        if(this.butButton.isDown){
            this.imageSelectHudBat.reset(200, 40);
            this.imageSelectHudCapa.kill();
        }
        
        if(this.capaButton.isDown){
            this.imageSelectHudCapa.reset(280, 40);
            this.imageSelectHudBat.kill();
        }
        
        
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

            if(!this.isJumping) {
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
        var self = this;
        if (self.canFire && self.game.time.now > self.bulletTime) {
            self.bullet = self.bullets.getFirstExists(false);
            if (self.bullet) {                
                self.bullet.reset(self.sprite.x, self.sprite.y);
                if (self.sprite.scale.x == 1) {
                    self.bullet.body.velocity.x = 300;
                    self.bullet.animations.play('shotBat');
                    self.bulletTime = self.game.time.now + 150;
                } else {
                    self.bullet.body.velocity.x = -300;
                    self.bullet.scale.x = -1;
                    self.bullet.animations.play('shotBat');
                    self.bulletTime = self.game.time.now + 150;
                }

                if(!self.amountOfBats) {
                    self.soundShot.play();
                }

                self.amountOfBats++;
                self.canFire = false;

                self.game.time.events.add(Phaser.Timer.SECOND / 2, function () {
                    self.amountOfBats--;
                    self.bullet.kill();
                    if(!self.amountOfBats) {
                        self.soundShot.stop();
                    }
                    self.canFire = true;
                }, this).autoDestroy = true;
            }
        }
    }
    
    Player.prototype.resetBullet = function(bullet) {
        bullet.kill();
    }
    gameManager.addSprite('player', Player);

})();
