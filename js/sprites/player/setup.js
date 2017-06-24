(function () {
    'use strict';

    var playerSetup = function (stateContext) {   
        var self = this;

        //Criando balas
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true; 
        this.isWolf = false;
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
        this.sprite.animations.add('wolfRun', [2,3,4,5], 15, true);
        this.sprite.animations.add('dead', [0,1,2,3,4,5,6,7,8,9], 5, false);
        this.sprite.animations.add('idle', [4,5,6], 4, true);
        this.sprite.animations.add('wolfIdle', [0, 1], 2, true);
        this.sprite.animations.add('transform', [7,8,9], 22, true);
        this.sprite.animations.add('batTransformation', [11,12,13,14,15,16,17,18,19], 10, true);
        this.sprite.animations.add('singleJump', [0,1,2,3,4,5,6,7], 10, false);
        this.sprite.animations.add('batFly', [1,2,3,4,5,6,7,8], 24, true);
        this.sprite.anchor.set(0.5);
        this.sprite.checkWorldBounds = true;
        this.sprite.events.onOutOfBounds.add(this.gameover, this);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = this.normalGravity;
        this.isDoubleJumping = false;
        this.isJumping = false;
        this.canFire = true;   
        this.stateContext = stateContext;
        
        
        // Blood particle emmiter
        this.emitter = this.game.add.emitter(0, 0, 100);
        this.emitter.makeParticles(this.imagePlayerBloodName);
        
        // Feedback gain Blood particle emmiter
        this.emitterBlood = this.game.add.emitter(0, 0, 100);
        this.emitterBlood.makeParticles(this.imagePlayerBloodName);
        
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
        // 
        this.imageSelectHudBat = this.game.add.sprite(266, 50, this.imageSelectHud); 
        this.imageSelectHudBat.anchor.set(0.5);
        this.imageSelectHudBat.fixedToCamera = true;
        
        this.imageBatHudView = this.game.add.sprite(270, 55, this.imageBatHud); 
        this.imageBatHudView.anchor.set(0.5);
        this.imageBatHudView.fixedToCamera = true;
        
        this.imageSelectHudCapa = this.game.add.sprite(346, 50, this.imageSelectHud); 
        this.imageSelectHudCapa.anchor.set(0.5);
        this.imageSelectHudCapa.fixedToCamera = true;
        this.imageSelectHudCapa.kill();
       
        this.imageCapHudView = this.game.add.sprite(346, 50, this.imageCapHud); 
        this.imageCapHudView.anchor.set(0.5);
        this.imageCapHudView.fixedToCamera = true;
      
        // charger
        this.imageChargerHudView = this.game.add.sprite(422, 45, this.imageChargerHud); 
        this.imageChargerHudView .frame = 0;
        this.imageChargerHudView .animations.add('charger', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, true);
        this.imageChargerHudView.anchor.set(0.5);
        this.imageChargerHudView.fixedToCamera = true;
        
        // Text Hud Bat
        var textHudQtdeBat = this.game.add.text(247, 2, 'Infinity', { fill: '#ffffff', fontSize: 12 });
        textHudQtdeBat.anchor.set(0,0);  
        textHudQtdeBat.fixedToCamera = true;  
        
        // Text Hud Capa
        gameManager.globals.textHudQtdeCap = this.game.add.text(343, 2, gameManager.globals.qtdeCapas, { fill: '#ffffff', fontSize: 12 });
        gameManager.globals.textHudQtdeCap.anchor.set(0,0);
        gameManager.globals.textHudQtdeCap.fixedToCamera = true; 
        
        // Text Scores
        gameManager.globals.scoreText = this.game.add.text(690, 12, gameManager.globals.score, { fill: '#ffffff', align: 'center', fontSize: 30 });
        gameManager.globals.scoreText.anchor.set(0,0);
        gameManager.globals.scoreText.fixedToCamera = true;  
        
        //Sounds
        this.soundDead = this.game.add.audio(this.soundNameDead);
        this.soundShot = this.game.add.audio(this.soundNameShot);
        this.soundJump = this.game.add.audio(this.soundNameJump);
        this.soundPickup = this.game.add.audio(this.soundNamePickupBlood);
        this.soundPlayerDeath = this.game.add.audio(this.soundNamePlayerDeath);
        this.soundModItens = this.game.add.audio(this.soundNameModItens);
        this.soundPickupCapa = this.game.add.audio(this.soundNamePickupCapa);
        
        //Controles
        // Player Movement
        this.leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        //this.downButtom = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.jumpButton.onDown.add(this.jump, this);
        
        // Shot
        this.shotButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // cancel transformation
        this.downButton = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        
        // Run
        this.runButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.runButton.onDown.add(this.startWolfTransformation, this);
        this.runButton.onUp.add(this.cancelWolfTransformation, this);
        
        //hud of items
        this.butButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.butButton.inputEnabled = true;
       
        this.capaButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.capaButton.inputEnabled = true;
        //this.capaButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R); //Acharia Melhor  utilizar a letra "E"

        this.checkAmountOfLives();
    }

    gameManager.addModule('playerSetup', playerSetup);

})();
