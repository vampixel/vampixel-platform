(function () {
    'use strict';

    var Player = gameManager.getModule('playerConstructor');
    Player.prototype.preload = gameManager.getModule('playerPreload');
    Player.prototype.setup = gameManager.getModule('playerSetup');
    
    Player.prototype.checkAmountOfLives = function () {
        if(gameManager.globals.lives === 2) {
            this.imageBloodLives3.alpha = 0;
        }

        if(gameManager.globals.lives === 1) {
            this.imageBloodLives3.alpha = 0;
            this.imageBloodLives2.alpha = 0;
        }

        if(gameManager.globals.lives === 0) {
            this.imageBloodLives3.alpha = 0;
            this.imageBloodLives2.alpha = 0;
            this.imageBloodLives1.alpha = 0;
            this.gameover();
        }
    }

    Player.prototype.decreaseLives = function () {
        if(!this.isDead) {
            gameManager.globals.lives--;
            this.soundDead.play();
            this.playerHit();

            if(gameManager.globals.lives === 2) {
                this.imageBloodLives3.alpha = 0;
            }

            if(gameManager.globals.lives === 1) {
                this.imageBloodLives2.alpha = 0;
            }

            if(gameManager.globals.lives === 0) {
                this.imageBloodLives1.alpha = 0;
                if (gameManager.globals.isLevel1){
                //if (gameManager.globals.isLevelChamine){
                //gameManager.globals.environmentSoundLevelChamine.stop(); 
                gameManager.globals.environmentSoundLevel1.stop(); 
                }            
                this.gameover();
            }
        }
    }
    
    Player.prototype.makeBlood = function () {
        this.emitter.on = true;
        this.emitter.start(true, 1000, null, 20);
        this.emitter.on = false;
    }
    
    Player.prototype.playerHit = function () {
        // Faz o player recuar quando é acertado
        if (this.sprite.body.deltaX() >= 0) {
            this.sprite.body.x -= 20;   
        } else {
            this.sprite.body.x += 20;
        }
        this.sprite.body.y -= 30;
        
        // pinta o player de vermelho
        this.sprite.tint = 0xd41c1c;
        // volta a cor original
        this.game.time.events.add(200, function () {this.sprite.tint = 0xffffff;}, this);
        this.makeBlood();
    }

    
    Player.prototype.livesToCollectCollision = function (player, blood) {
        // sound collecting
        this.soundPickup.play();
        // destroy the blood
        blood.kill();
        this.addBloodLives();
    }
    
    Player.prototype.addBloodLives = function () {
        if(gameManager.globals.lives === 2) { // jogador com 2 corações e adicionando mais uma vida
            this.imageBloodLives3.alpha = 1;
            gameManager.globals.lives++;
            if (this.applyEmitter){
                this.makeEmitterBlood(this.imageBloodLives3);
            }
        }

        if(gameManager.globals.lives === 1) { // jogador com 1 coração e adicionando mais uma vida
            this.imageBloodLives2.alpha = 1;
            gameManager.globals.lives++;
            if (this.applyEmitter){
                this.makeEmitterBlood(this.imageBloodLives2);
            }
        }
    }
    
    Player.prototype.makeEmitterBlood = function (imageBloodLives) {
        this.emitterBlood.x = imageBloodLives.x;
        this.emitterBlood.y = imageBloodLives.y;
        
        this.emitterBlood.on = true;
        this.emitterBlood.start(true, 2000, null, 40);
        this.emitterBlood.on = false;
        
        this.applyEmitter = false;
    }
    
    Player.prototype.capasToCollectCollision = function (player, capa_hud) {
        // Sound Collecting Capa
        this.soundPickupCapa.play();        
        // destruindo a capa coletada
        capa_hud.kill();
        if (gameManager.globals.qtdeCapas < 3){
            gameManager.globals.qtdeCapas++;
            gameManager.globals.textHudQtdeCap.setText(gameManager.globals.qtdeCapas);
        }
    }

    Player.prototype.checkIsJumping = function () {
        if((!this.isDead) && (this.isJumping) && (this.sprite.body.touching.down || this.sprite.body.onFloor())) {
            this.resetJump();
        }
    }

    Player.prototype.resetJump = function () {
        this.isJumping = false;
        this.isDoubleJumping = false;
        this.setNormalOrWolfAnimation('walk', 'wolfRun');        
        this.sprite.body.gravity.y = this.normalGravity;
    }
        
    Player.prototype.gameover = function () {
        this.setAnimation('dead', this.imageDeadName);
        //this.checkIsJumping();
        this.soundDead.stop();
        this.soundPlayerDeath.play();
        this.isDead = true;
        this.sprite.events.onAnimationComplete.add(function(){
            this.game.sound.stopAll();
            this.isDead = false;
            gameManager.globals.InputsPlayer = false;
            this.game.state.start('lose');
        },this);
    }
    
    Player.prototype.jump = function () { 
        if((!this.isDead) && (this.sprite.body.touching.down || this.sprite.body.onFloor())) {
            this.isJumping = true;
            this.setNormalOrWolfAnimation('singleJump', 'wolfRun', this.imageJumpName);
            this.sprite.events.onAnimationComplete.add(function(){
                this.sprite.loadTexture(this.imageName);
                this.sprite.anchor.set(0.5);
            },this);
            return doJump.apply(this);
        }
        else if(!this.isDead && this.isJumping && !this.isDoubleJumping && !this.isWolf) {
            this.isDoubleJumping = true;
            this.setAnimation('batFly', this.imageBatFlyName);
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
    
    Player.prototype.startWolfTransformation = function () {
        if(!this.isDead && !this.isDoubleJumping) {
            this.isWolf = true;
            this.setNormalOrWolfAnimation('walk', 'wolfRun');
        }
    }

    Player.prototype.cancelWolfTransformation = function () {
        if(!this.isDead && !this.isDoubleJumping) {
            this.isWolf = false;
            this.setNormalOrWolfAnimation('walk', 'wolfRun');
        }
    }

    Player.prototype.groundCollision = function (playerSprite) {
        this.checkIsJumping();
    }

    Player.prototype.handleInputs = function () {   
       if (gameManager.globals.InputsEnable) {
        // Itens do HUD
        if (this.butButton.isDown && this.butButton.inputEnabled) {
            //this.soundModItens.play();
            this.imageSelectHudBat.reset(200, 40);
            this.imageSelectHudCapa.kill();
        }
        if (this.capaButton.isDown && this.capaButton.inputEnabled && gameManager.globals.haveCapas && gameManager.globals.qtdeCapas > 0) {
            this.soundModItens.play();
            this.soundPickupCapa.play();
            this.isInvisible = true;
            this.butButton.inputEnabled = false;
            this.capaButton.inputEnabled = false;
            this.sprite.alpha = 0.1;
            gameManager.globals.qtdeCapas--;
            gameManager.globals.textHudQtdeCap.setText(gameManager.globals.qtdeCapas);
            gameManager.globals.isColliderRatos = false;
            gameManager.globals.isColliderSticks = false;
            gameManager.globals.bossBulletCollision = false;
            gameManager.globals.isColliderEnemies = false;
            this.sprite.body.collider = false;
            this.imageSelectHudCapa.reset(280, 40);
            this.imageSelectHudBat.kill();
            this.imageChargerHudView.animations.play('charger');

            // Evento de 10 segundo de utilização da capa
            this.game.time.events.add(this.cloackDuration + 1000, function() {
                this.butButton.inputEnabled = true;
                this.capaButton.inputEnabled = true;
                this.isInvisible = false;
                this.imageChargerHudView.animations.stop('charger');
                this.imageChargerHudView.frame = 0;
                this.imageSelectHudBat.reset(200, 40);
                this.imageSelectHudCapa.kill();
                this.sprite.alpha = 1;
                gameManager.globals.isColliderRatos = true;
                gameManager.globals.bossBulletCollision = true;
                gameManager.globals.isColliderSticks = true;
                gameManager.globals.isColliderEnemies = true;
            }, this);
         }
       }
        
        // Atualiza a posição do emmiter de particulas de sangue para seguir o player
        this.emitter.x = this.sprite.x;
        this.emitter.y = this.sprite.y;
           
        // Movimentação Esquerda e Direita do Player
           if (gameManager.globals.InputsPlayer) {
           if (this.leftButton.isDown) {
            if(!this.isDead) {
                this.sprite.body.velocity.x = this.ifIsWolf(-this.wolfSpeed, -this.normalSpeed); // Ajustar velocidade
                // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
                if (this.sprite.scale.x == 1) this.sprite.scale.x = -1;
            }
                // Iniciando a animação 'walk'
            if (!this.isDead && !this.isJumping) {
                this.setNormalOrWolfAnimation('walk', 'wolfRun');
            }
        } else if (this.rightButton.isDown) {
            if(!this.isDead) {
                // se a tecla direita estiver pressionada
                this.sprite.body.velocity.x = this.ifIsWolf(this.wolfSpeed, this.normalSpeed); // Ajustar velocidade
                // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
                if (this.sprite.scale.x == -1) this.sprite.scale.x = 1;
            }
            if (!this.isDead && !this.isJumping) {
                this.setNormalOrWolfAnimation('walk', 'wolfRun');
            }
        } else {
            // Player Parado
            this.sprite.body.velocity.x = 0;
            if (!this.isDead && !this.isJumping && !this.isDoubleJumping) {
                this.setNormalOrWolfAnimation('idle', 'wolfIdle');
            }
        }

        // pressing down button
        if (!this.isDead && this.downButton.isDown && this.isDoubleJumping) {
            this.resetJump();
        }

        // Player Atirando        
        if (this.shotButton.isDown) {
            this.fire();
        }
      }
    }
    
    /**
     * @description return first value if it's wolf or the second one if it's not
     * @param {any} firstValue
     * @param {any} secondValue
     * @return {any}
     */
    Player.prototype.ifIsWolf = function (firstValue, secondValue) {
        return this.isWolf ? firstValue: secondValue;
    }

    /**
     * @description This method set the animation depending on either the player is wolf or not
     * @param {string} normalAnimationName
     * @param {string} wolfAnimationName
     */
    Player.prototype.setNormalOrWolfAnimation = function (normalAnimationName, wolfAnimationName, textureName) {
        if(this.isWolf) {
            this.setAnimation(wolfAnimationName, this.imageWolfName);
        }
        else {
            if(textureName) {
                this.setAnimation(normalAnimationName, textureName);
            }
            else {
                this.setAnimation(normalAnimationName);
            }
        }
    }

    /**
     * @description This method changes the current animation if it's
     * not already playing. It also change the texture of the sprite if a
     * texture name is passed as the second param
     * @params {string} animationName
     * @params {string} textureName Optional
     */
    
    Player.prototype.setAnimation = function (animationName, textureName) {
        // check if it's not already playing
        if(this.currentAnimationName !== animationName) {
            // change texture
            if(textureName) {
                this.sprite.loadTexture(textureName);
            }
            else {
                this.sprite.loadTexture(this.imageName);
            }
            // update anchor
            this.sprite.anchor.set(0.5);
            // play animation
            this.sprite.animations.play(animationName);
            // update current animation
            this.currentAnimationName = animationName;
        }
    }

    Player.prototype.checkGravity = function () {
        if(this.sprite.body.velocity.y >= 0 && this.isDoubleJumping) {
            this.sprite.body.gravity.y = this.fallingGravity;
        }
    }
    
    // Scores
    // Score Rato
    Player.prototype.increaseScoreRatos = function () {
        //this.soundShot.stop();
        gameManager.globals.score = gameManager.globals.score + gameManager.globals.enemy01Type;
        gameManager.globals.scoreText.setText(gameManager.globals.score);
        this.checkScore(gameManager.globals.enemy01Type);
    }
    
    // Score Enemies
    Player.prototype.increaseScoreEnemies = function () {
        //this.soundShot.stop();
        gameManager.globals.score = gameManager.globals.score + gameManager.globals.enemy02Type;
        gameManager.globals.scoreText.setText(gameManager.globals.score);
        this.checkScore(gameManager.globals.enemy02Type);
    }
    
    Player.prototype.checkScore = function (enemyType) {
        if(gameManager.globals.score >= this.nextScore) {
            this.nextScore = gameManager.globals.score + gameManager.globals.enemyScore;
            this.applyEmitter = true;
            this.addBloodLives();
            console.log("nextScore: ", this.nextScore);
        };
    }
    
    //Shot Bats
    Player.prototype.fire = function () {
        var self = this;
        if (self.canFire && !this.isInvisible && !this.isWolf && self.game.time.now > self.bulletTime) {
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

                self.soundShot.play();

                self.canFire = false;

                self.game.time.events.add(Phaser.Timer.SECOND, function () {
                    self.bullet.kill();
                    self.soundShot.stop();
                    self.canFire = true;
                }, this).autoDestroy = true;
            }
        }
    }
    
    Player.prototype.resetBullet = function(bullet) {
        this.soundShot.stop();
        bullet.kill();
    }

    gameManager.addSprite('player', Player);

})();
