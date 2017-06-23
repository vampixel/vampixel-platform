(function () {
    'use strict'; 

    var Level3State = function() {
        this.player = gameManager.getSprite('player');
    };

    Level3State.prototype.preload = function() {
        // player
        this.player.preload();
        // images
        this.game.load.image('tileMapImage', 'assets/spritesheets/Tiles-Castelo-32x32.png');
        // spritesheets
        this.game.load.spritesheet('freira', 'assets/spritesheets/FREIRA-SPRITE.png', 64, 64, 4);
        this.game.load.spritesheet('arqueiro', 'assets/spritesheets/ARQUEIRO-SPRITE.png', 64, 64, 3);
        this.game.load.spritesheet('blood', 'assets/img/blood.png', 42, 42, 1);
        this.game.load.spritesheet('capa_hud', 'assets/spritesheets/capa_hud.png', 64, 64, 1);
        this.game.load.spritesheet('platform', 'assets/img/plataformas-que-caem-32x32.png', 32,32, 8);
        this.game.load.spritesheet('items', 'assets/spritesheets/items.png', 32, 32, 16);
        
        // tilemap
        this.game.load.tilemap('level3Map', 'assets/maps/level_3_castle.json', null, Phaser.Tilemap.TILED_JSON);
        // audios
        this.game.load.audio('environmentSoundLevel2', 'assets/sounds/levels/gumbelElSiniestroYLaVelz.ogg');
    }

    Level3State.prototype.create = function() {
        // setup physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // setup tilemap and add tileset
        this.level3Map = this.game.add.tilemap('level3Map');
        this.level3Map.addTilesetImage('Tiles-Castelo-32x32', 'tileMapImage');

        // setup trigger layer
        this.enemyBackTriggerLayer = this.level3Map.createLayer('enemy_back_trigger');
        this.level3Map.setCollisionByExclusion([], true, this.enemyBackTriggerLayer);

        // bg 2 layer setup
        this.bg2Layer = this.level3Map.createLayer('bg2');

        // bg layer setup
        this.bgLayer = this.level3Map.createLayer('bg');
        
        this.wallLayer = this.level3Map.createLayer('wall');
        this.level3Map.setCollisionByExclusion([], true, this.wallLayer);

        // floor layer setup
        this.floorLayer = this.level3Map.createLayer('floor');
        this.level3Map.setCollisionByExclusion([], true, this.floorLayer);
        this.wallLayer.resizeWorld();        

        // setup initial player properties        
        this.player.setup(this);
        this.player.sprite.x = 80;
        this.player.sprite.y = 2310;
        
        //Teste1
        //this.player.sprite.x = 80;
        //this.player.sprite.y = 950;
       
        //Teste2
        //this.player.sprite.x = 1000;
        //this.player.sprite.y = 250;
        
        this.game.camera.follow(this.player.sprite);

        // Platforms group
        this.platforms = this.game.add.physicsGroup();
        this.level3Map.createFromObjects('Platforms', 'platform', 'platform', 0, true, false, this.platforms);
        // Para cada objeto do grupo, vamos executar uma função
        this.platforms.forEach(function(platform){
            platform.body.immovable = true;
        });
        
        // Diamond
        this.diamonds = this.game.add.physicsGroup();
        this.level3Map.createFromObjects('Items', 'diamond', 'items', 5, true, false, this.diamonds);
        this.diamonds.forEach(function(diamond){
            diamond.anchor.setTo(0.5);
            diamond.body.immovable = true;
            diamond.animations.add('spin', [4, 5, 6, 7, 6, 5], 6, true);
            diamond.animations.play('spin');
        });
        
        // setup cloaks
        this.capasToCollectLevel2 = this.game.add.physicsGroup();
        this.level3Map.createFromObjects('Items', 'capa', 'capa_hud', 0, true, false, this.capasToCollectLevel2);
        this.capasToCollectLevel2.forEach(function(addCapaLevel2) {
            addCapaLevel2.anchor.setTo(0.5);
            addCapaLevel2.body.immovable = true;
        });

        // setup lives
        this.livesToCollect = this.game.add.physicsGroup();
        this.level3Map.createFromObjects('Items', 'life', 'blood', 0, true, false, this.livesToCollect);
        this.livesToCollect.forEach(function(addlifeLevel2) {
            addlifeLevel2.anchor.setTo(0.5);
            addlifeLevel2.body.immovable = true;
        });

        // arqs group setup   
        this.arqs = this.game.add.physicsGroup();
        this.level3Map.createFromObjects('Enemies', 'arq', 'arqueiro', 8, true, false, this.arqs);
        this.arqs.forEach(function(arq){
            arq.anchor.setTo(0, 0);
            arq.body.immovable = true;
            arq.body.gravity.y = 50;
            arq.animations.add('walk', [1,2,3], 6, true);
            arq.animations.play('walk');
            arq.body.velocity.x = 100;
            arq.body.bounce.x = 1;
        });
        
        // nun group setup    
        this.nuns = this.game.add.physicsGroup();
        this.level3Map.createFromObjects('Enemies', 'nun', 'freira', 8, true, false, this.nuns);
        this.nuns.forEach(function(nun){
            nun.anchor.setTo(0, 0);
            nun.body.immovable = true;
            nun.body.gravity.y = 50;
            nun.animations.add('walk', [1,2,3,4], 6, true);
            nun.animations.play('walk');
            nun.body.velocity.x = 100;
            nun.body.bounce.x = 1;
        });

        // audio setup
        gameManager.globals.environmentSoundLevel2 = this.game.add.audio('environmentSoundLevel2');
        gameManager.globals.environmentSoundLevel2.loop = true;
        gameManager.globals.environmentSoundLevel2.play();
    }
    
    Level3State.prototype.update = function() {
        // workaround
        // Please find a better place to this code Fernando...
        if (gameManager.globals.qtdeCapas > 0){
            gameManager.globals.haveCapas = true;
        }  

        this.handleCollisions();
        this.playerUpdate();   
        this.enemiesUpdate();   
    }

    Level3State.prototype.playerBulletCollision = function(enemy, bullet) { //Bala do player colidindo com o inimigos "RATO"
        bullet.kill();
        enemy.kill();
        this.player.increaseScoreRatos.apply(this.player);
    }

    Level3State.prototype.handleCollisions = function() {
        // player
        this.game.physics.arcade.collide(this.player.sprite, this.floorLayer, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.wallLayer);
        this.game.physics.arcade.collide(this.player.sprite, this.platforms);
        this.game.physics.arcade.overlap(this.player.sprite, this.diamonds, this.diamondCollect, null, this);
        
        // cloak
        this.game.physics.arcade.overlap(this.player.sprite, this.capasToCollectLevel2, this.player.capasToCollectCollision, null, this.player); 

        // life
        this.game.physics.arcade.overlap(this.player.sprite, this.livesToCollect, this.player.livesToCollectCollision, null, this.player); 

        // enemies
        this.game.physics.arcade.overlap(this.player.sprite, this.nuns, this.enemiesCollision, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.arqs, this.enemiesCollision, null, this);

        // player bullet collision
        this.game.physics.arcade.overlap(this.nuns, this.player.bullets, this.playerBulletCollision, null, this);
        this.game.physics.arcade.overlap(this.arqs, this.player.bullets, this.playerBulletCollision, null, this);

        // enemies with wall
        this.game.physics.arcade.collide(this.arqs, this.enemyBackTriggerLayer);
        this.game.physics.arcade.collide(this.nuns, this.enemyBackTriggerLayer);
        this.game.physics.arcade.collide(this.arqs, this.floorLayer);
        this.game.physics.arcade.collide(this.nuns, this.floorLayer);
        this.game.physics.arcade.collide(this.arqs, this.wallLayer);
        this.game.physics.arcade.collide(this.nuns, this.wallLayer);
    }

    Level3State.prototype.diamondCollect = function(player, diamond) {
        diamond.kill();
        gameManager.globals.environmentSoundLevel2.stop();
        gameManager.globals.isLevel2 = false
        gameManager.globals.isLevel3 = false;
        gameManager.globals.isLevel4 = true;
        this.game.state.start('transicao');  
    }
    
    Level3State.prototype.enemiesCollision = function(player, enemy) {
        if (gameManager.globals.isColliderEnemies) {
            enemy.kill();
            this.player.decreaseLives.apply(this.player);
        }
    }

    Level3State.prototype.enemiesUpdate = function() {
        this.arqs.forEach(function(arq){
           if(arq.body.velocity.x != 0) {
               arq.scale.x = 1 * Math.sign(arq.body.velocity.x);
           }
        });
        
        this.nuns.forEach(function(nun){
           if(nun.body.velocity.x != 0) {
               nun.scale.x = 1 * Math.sign(nun.body.velocity.x);
           }
        });
    }

    Level3State.prototype.playerUpdate = function() {
        this.player.handleInputs();
        this.player.checkGravity.apply(this.player); 
    }

    Level3State.prototype.diamondCollect = function(player, diamond){
        diamond.kill();
        gameManager.globals.environmentSoundLevel2.stop();
        gameManager.globals.isLevel3 = false;
        gameManager.globals.isLevel4 = true;
        this.game.state.start('transicao');
    }

    Level3State.prototype.render = function() {
        // this.game.debug.inputInfo(32, 32);
        // this.game.debug.spriteInfo(this.player.sprite, 32, 32);
        // this.game.debug.body(this.player.sprite);
    }

    gameManager.addState('level3', Level3State);

})();