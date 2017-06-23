(function () {
    'use strict'; 

    var Level2State = function(Level2) {
        // load sprites here
        this.player = gameManager.getSprite('player'); 
    };
    
    Level2State.prototype.preload = function() {
        // Carregando o Player
        this.player.preload();
        
        // SpriteSheet
        this.game.load.spritesheet('rato', 'assets/spritesheets/rato-sprite.png', 64, 64, 3);
        this.game.load.spritesheet('items', 'assets/spritesheets/items.png', 32, 32, 16);
        this.game.load.spritesheet('blood', 'assets/img/blood.png', 42, 42, 1);
        this.game.load.spritesheet('capa_hud', 'assets/spritesheets/capa_hud.png', 64, 64, 1);
        this.game.load.spritesheet('fire', 'assets/spritesheets/sprite-fogo-chamine-32x32.png', 32, 32, 4);    

        
        // Images
        this.game.load.image('tiledFases', 'assets/spritesheets/tiled-fases.png');
        this.game.load.spritesheet('stick', 'assets/img/estacas-chao-teto-parede.png',32,32,4);
        this.game.load.spritesheet('platform', 'assets/img/plataformas-que-caem-32x32.png', 32,32, 8);
        
        //Tile maps
        this.game.load.tilemap('Level2','assets/maps/level_2_chamine.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Sounds
        this.game.load.audio('environmentSoundLevel2', 'assets/sounds/levels/simonMathewson8bitEnergyDrinkComedown1.ogg');
    }

    Level2State.prototype.create = function() {
        
        // set globals
        gameManager.globals.lives = 3;

        // Física ARCADE
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Áudios
        gameManager.globals.environmentSoundLevel2 = this.game.add.audio('environmentSoundLevel2');
        gameManager.globals.environmentSoundLevel2.lopp = true;
        gameManager.globals.environmentSoundLevel2.play();
    
        //Tile maps
        this.Level2 = this.game.add.tilemap('Level2');
        this.Level2.addTilesetImage('tiled-fases','tiledFases');
        
        // setup trigger layer
        this.enemyBackTriggerLayer = this.Level2.createLayer('enemy_back_trigger');
        //Bg Layer
        this.bgLayer = this.Level2.createLayer('Bg');
        //Walls layer
        this.wallsLayer = this.Level2.createLayer('Walls');
        this.wallsLayer.resizeWorld();
        
        //Tile maps - collision
        this.Level2.setCollisionByExclusion([], true, this.enemyBackTriggerLayer);
        this.Level2.setCollisionByExclusion([], true, this.wallsLayer);
        this.Level2.setCollisionByExclusion([], true, this.fireLayer);
        
        // setup initial player properties and camera follow
        this.player.setup(this);
        //this.player.sprite.x = this.game.world.centerX - 340;
        this.player.sprite.x = this.game.world.centerX - 100;
        //this.player.sprite.y = 4700;
        this.player.sprite.y = 70;
        this.player.sprite.body.collideWorldBounds = true;
        this.game.camera.follow(this.player.sprite);
        
        
        // texto do level
        this.Level2Text = this.game.add.text(this.game.world.centerX + 180, 30, 'Chaminé', { fill: '#ffffff', align: 'center', fontSize: 27 });
        this.Level2Text.anchor.set(0.5);
        this.Level2Text.fixedToCamera = true;  
        
        // Platforms group
        this.platforms = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Platforms', 'platform', 'platform', 0, true, false, this.platforms);
        // Para cada objeto do grupo, vamos executar uma função
        this.platforms.forEach(function(platform){
            platform.body.immovable = true;
        });
        
        // Sticks group
        this.sticksUp = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Sticks', 'stick', 'stick', 0, true, false, this.sticksUp);
        // Para cada objeto do grupo, vamos executar uma função
        this.sticksUp.forEach(function(stickUp){
            stickUp.body.immovable = true;
        });
        
        
        // Sticks group
        this.sticksDown = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Sticks', 'stickDown', 'stick', 1, true, false, this.sticksDown);
        // Para cada objeto do grupo, vamos executar uma função
        this.sticksDown.forEach(function(stickDown){
            stickDown.body.immovable = true;
        });
        
        // Grupo de chamas (fogo)
        this.flames = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Flames', 'flame', 'fire', 0, true, false, this.flames);
        // Para cada objeto do grupo, vamos executar uma função
        this.flames.forEach(function(fire){
            // body.immovable = true indica que o objeto não é afetado por forças externas
            fire.body.immovable = true;
            // Adicionando animações; o parâmetro true indica que a animação é em loop
            fire.animations.add('fireAnim', [0,1,2,3,2,1],6, true);
            fire.animations.play('fireAnim');
        });
        
        // Life
        this.livesToCollect = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Items', 'life', 'blood', 0, true, false, this.livesToCollect);
        this.livesToCollect.forEach(function(addlifeLevel2) {
            addlifeLevel2.anchor.setTo(0.5);
            addlifeLevel2.body.immovable = true;
        });
        
        // Capas Level 1
        this.capasToCollectLevel2 = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Items', 'capa', 'capa_hud', 0, true, false, this.capasToCollectLevel2);
        this.capasToCollectLevel2.forEach(function(addCapaLevel2) {
            addCapaLevel2.anchor.setTo(0.5);
            addCapaLevel2.body.immovable = true;
        });
        
        //Ratos
        this.ratos = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Enemies', 'rato', 'rato', 8, true, false, this.ratos);
        this.ratos.forEach(function(rato){
            rato.anchor.setTo(0, 0);
            rato.body.immovable = true;
            rato.animations.add('walk', [1,2,3], 6, true);
            rato.animations.play('walk');
            rato.body.velocity.x = 100;
            rato.body.bounce.x = 1;
        });
        
        // Grupo de fireBullets
        this.fireBullets = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Enemies', 'fireBullet', 'items', 5, true, false, this.fireBullets);
        
        // Para cada objeto do grupo, vamos executar uma função
        this.fireBullets.forEach(function(fireBullet){
            // body.immovable = true indica que o objeto não é afetado por forças externas
            fireBullet.body.immovable = true;
            // Adicionando animações; o parâmetro true indica que a animação é em loop
            fireBullet.animations.add('go', [10, 11, 10], 3, true);
            fireBullet.animations.play('go');
            fireBullet.body.velocity.x = 100;
            fireBullet.body.bounce.x = 1;
        });
        
        // Grupo de diamantes
        this.diamonds = this.game.add.physicsGroup();
        this.Level2.createFromObjects('Items', 'diamond', 'items', 5, true, false, this.diamonds);
        // Para cada objeto do grupo, vamos executar uma função
        this.diamonds.forEach(function(diamond){
            // body.immovable = true indica que o objeto não é afetado por forças externas
            diamond.body.immovable = true;
            // Adicionando animações; o parâmetro true indica que a animação é em loop
            diamond.animations.add('spin', [4, 5, 6, 7, 6, 5], 6, true);
            diamond.animations.play('spin');
        });
        
        // Grupo de inimigos
        this.bats = this.game.add.physicsGroup();
        
        this.Level2.createFromObjects('Enemies', 'bat', 'enemies', 8, true, false, this.bats);
        this.bats.forEach(function(bat){
            bat.anchor.setTo(0.5, 0.5);
            bat.body.immovable = true;
            bat.animations.add('fly', [8, 9, 10], 6, true);
            bat.animations.play('fly');
            // Velocidade inicial do inimigo
            bat.body.velocity.x = 100;
            // bounce.x=1 indica que, se o objeto tocar num objeto no eixo x, a força deverá
            // ficar no sentido contrário; em outras palavras, o objeto é perfeitamente elástico
            bat.body.bounce.x = 1;
        });
    }
    
    Level2State.prototype.update = function() {
        if (gameManager.globals.qtdeCapas > 0){
            gameManager.globals.haveCapas = true;
        }
        
        //Collisões
        this.game.physics.arcade.collide(this.player.sprite, this.platforms, this.platformsCollision, null, this);
        this.game.physics.arcade.collide(this.player.sprite, this.flames, this.flamesCollision, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.sticksUp, this.sticksCollision, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.sticksDown, this.sticksCollision, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.diamonds, this.diamondCollect, null, this); 
        this.game.physics.arcade.overlap(this.player.sprite, this.ratos, this.ratosCollision, null, this);
        this.game.physics.arcade.collide(this.ratos,this.enemyBackTriggerLayer);
        
        // Rato morrendo ao ser atingido pelos morcegos do player
        this.game.physics.arcade.overlap(this.ratos, this.player.bullets, this.playerBulletCollision, null, this);
        
        // Player pegando coração "vida"
        this.game.physics.arcade.overlap(this.player.sprite, this.livesToCollect, this.player.livesToCollectCollision, null, this.player); 
        
        // Player pegando capa
        this.game.physics.arcade.overlap(this.player.sprite, this.capasToCollectLevel2, this.player.capasToCollectCollision, null, this.player); 
        
        // Objetos com as paredes e Plataformas
        this.game.physics.arcade.collide(this.bats, this.wallsLayer);
        this.game.physics.arcade.collide(this.ratos, this.wallsLayer);
        this.game.physics.arcade.collide(this.player.sprite, this.wallsLayer, this.player.groundCollision, null, this.player);
        
        this.game.physics.arcade.overlap(this.player.sprite, this.fireBullets, this.fireBullet, null, this);            
        this.game.physics.arcade.collide(this.fireBullets, this.wallsLayer, this.fireBulletCollideWall, null, this);
        
        this.player.handleInputs();
        //console.log("Animation: ", this.player.sprite.animations.currentAnim.name);
        //console.log("isColliderSticks: ",gameManager.globals.isColliderSticks);
        //console.log("isDead: " , this.player.isDead);
        this.player.checkGravity.apply(this.player); 
        // Para cada morcego, verificar em que sentido ele está indo
        // Se a velocidade for positiva, a escala no eixo X será 1, caso
        // contrário -1
        this.bats.forEach(function(bat){
            if(bat.body.velocity.x != 0) {
                // Math.sign apenas retorna o sinal do parâmetro: positivo retorna 1, negativo -1
                bat.scale.x = 1 * Math.sign(bat.body.velocity.x);
            }
        });
        
        this.ratos.forEach(function(rato){
            if(rato.body.velocity.x != 0) {
                // Math.sign apenas retorna o sinal do parâmetro: positivo retorna 1, negativo -1
                rato.scale.x = 1 * Math.sign(rato.body.velocity.x);
            }
        });
        
        this.fireBullets.forEach(function(fireBullet){
            if(fireBullet.body.velocity.x != 0) {
                // Math.sign apenas retorna o sinal do parâmetro: positivo retorna 1, negativo -1
                fireBullet.scale.x = -1;
            }
        });
    }
        
    Level2State.prototype.playerBulletCollision = function(ratos, bullet) { //Bala do player colidindo com o inimigos "RATO"
        bullet.kill();
        ratos.kill();
        this.player.increaseScoreRatos.apply(this.player);
    }

    Level2State.prototype.diamondCollect = function(player, diamond){ //Jogando Colidindo com o Diamante e indo para o Level 2
        diamond.kill();
        gameManager.globals.environmentSoundLevel2.stop();
        gameManager.globals.isLevel2 = false
        gameManager.globals.isLevel3 = true;
        this.game.state.start('transicao');  
    } 
    
    Level2State.prototype.fireBulletCollideWall = function(fireBullet){
        fireBullet.kill();
    }
    
    Level2State.prototype.fireBullet = function(player, fireBullet){
        fireBullet.kill();
        this.player.decreaseLives.apply(this.player); 
    }
    
    Level2State.prototype.sticksCollision = function(player, stick){
       if (gameManager.globals.isColliderSticks){
           this.player.sprite.body.moves = false
           this.player.isDead = true;
           this.player.playerHit(this.player);
           this.player.gameover();
           gameManager.globals.environmentSoundLevel2.stop()
       }
    }
    
    Level2State.prototype.platformsCollision = function(player, platform){
        platform.body.gravity.y = 80;
    }
    
    Level2State.prototype.ratosCollision = function(player, rato){
       if (gameManager.globals.isColliderRatos){
            rato.kill();
            this.player.decreaseLives.apply(this.player);
       }
    }
    
    Level2State.prototype.flamesCollision = function(player, flame){
        this.player.sprite.body.moves = false
        this.player.isDead = true;
        this.player.playerHit(this.player);
        this.player.gameover();
        gameManager.globals.environmentSoundLevel2.stop()
    }

    gameManager.addState('level2', Level2State);


})();
