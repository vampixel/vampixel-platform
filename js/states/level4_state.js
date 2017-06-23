(function () {
    'use strict'; 

    var Level4State = function() {
         this.player = gameManager.getSprite('player');
         this.boss = gameManager.getSprite('boss');
    };


    Level4State.prototype.preload = function() {
        // Para carregar um sprite, basta informar uma chave e dizer qual é o arquivo
        this.game.load.image('mapTiles', 'assets/spritesheets/tiled-fases.png');
        this.game.load.image('platform', 'assets/spritesheets/platform.png');
        this.game.load.spritesheet('capa_hud', 'assets/spritesheets/capa_hud.png', 64, 64, 1);

        this.game.load.tilemap('level4', 'assets/maps/level_4_boss.json', null, Phaser.Tilemap.TILED_JSON);

        this.game.load.audio('environmentSoundBoss', 'assets/sounds/levels/VLAD8BitBull.ogg');

        // player preload
        this.player.preload();

        // boss preload
        this.boss.preload();
    }

    Level4State.prototype.create = function() {

        // start physic system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // tilemap
        this.level4 = this.game.add.tilemap('level4');

        // tileset
        this.level4.addTilesetImage('tiled-fases', 'mapTiles');
        
        // layers
        this.bgLayer = this.level4.createLayer('BG');
        this.items = this.level4.createLayer('Items');
        this.floor = this.level4.createLayer('Floor');

        /* PLATFORMS */
	    this.platform1 = this.game.add.sprite(110, 210, 'platform');
	    this.platform2 = this.game.add.sprite(280, 320, 'platform');
        this.game.physics.arcade.enable(this.platform1);
        this.game.physics.arcade.enable(this.platform2);
        this.platform1.body.immovable = true;
        this.platform2.body.immovable = true;
        this.platform1.body.checkCollision.down = false;
        this.platform2.body.checkCollision.down = false;

        this.bgLayer.resizeWorld();
        
        this.level4.setCollisionByExclusion([], true, this.items);
        this.level4.setCollisionByExclusion([], true, this.floor);
            
        // Inicializando jogador
        this.player.setup(this);
        this.player.sprite.x = 170;
        this.player.sprite.y = 100;
        
        // Inicializando Boss
        this.boss.setup(this);

        // Música de fundo - criada da mesma forma, mas com o parâmetro loop = true
        this.bossSound = this.game.add.audio('environmentSoundBoss');
        this.bossSound.loop = true;
        this.bossSound.play();
        
        // Capas Level 3
        this.capasToCollectLevel3 = this.game.add.physicsGroup();
        this.level4.createFromObjects('Items', 'capa', 'capa_hud', 0, true, false, this.capasToCollectLevel3);
        this.capasToCollectLevel3.forEach(function(addCapaLevel3) {
            addCapaLevel3.anchor.setTo(0.5);
            addCapaLevel3.body.immovable = true;
        });
        
        // Texto do level
        this.level4Text = this.game.add.text(this.game.world.centerX + 180, 30, 'Level 3', { fill: '#ffffff', align: 'center', fontSize: 27 });
        this.level4Text.anchor.set(0.5);
        this.level4Text.fixedToCamera = true;  
        
        // Text HP BOSS
        this.bossHP = this.game.add.text(620, 550, 'Boss: '+this.boss.HP+'%', {font: "25px Arial", fill: "#ffffff"});
        this.bossHP.fixedToCamera = true;

    }

    Level4State.prototype.bossPlayerCollision = function(boss, player) {
        gameManager.globals.lives === 0;
        this.player.decreaseLives.apply(this.player);
    }

    Level4State.prototype.bossBulletCollision = function(player, bullet) {
        if (gameManager.globals.bossBulletCollision) {
            bullet.kill();

        // game over
        if(gameManager.globals.lives === 1) {
            this.bossSound.stop();
        }

        this.player.decreaseLives.apply(this.player);
        }
    }

    Level4State.prototype.playerBulletCollision = function(player, bullet) {
        bullet.kill();
        this.boss.HP -= 2;
        this.bossHP.setText('Boss: '+ this.boss.HP +'%');

        if(this.boss.HP <= 0) {
            this.bossSound.stop();
            gameManager.globals.isLevel4 = false;
            this.game.time.events.add(2000, function() {
                this.game.state.start('win');
            }, this);
        }

        if(this.boss.state === 'normal' && this.boss.HP <= this.boss.limitHPToTransform) {
            this.boss.transform.apply(this.boss);
        }
    }

    Level4State.prototype.update = function() {
        if (gameManager.globals.qtdeCapas > 0) {
            gameManager.globals.haveCapas = true;
        }
        // player and boss collisions
        this.game.physics.arcade.collide(this.player.sprite, this.floor, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform1, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform2, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.boss.sprite, this.floor);
        this.game.physics.arcade.collide(this.boss.sprite, this.player.sprite, this.C, null, this);
        
        // Player pegando capa
        this.game.physics.arcade.overlap(this.player.sprite, this.capasToCollectLevel3, this.player.capasToCollectCollision, null, this.player);
        
        // bullet colliders
        this.game.physics.arcade.overlap(this.player.sprite, this.boss.bullets, this.bossBulletCollision, null, this);
        this.game.physics.arcade.overlap(this.boss.sprite, this.player.bullets, this.playerBulletCollision, null, this);

        // handle player inputs
        this.player.handleInputs();
        this.player.checkGravity.apply(this.player); 

        // move boss
        this.boss.move.apply(this.boss);
    }

    gameManager.addState('level4', Level4State);

})();