(function () {
    'use strict'; 

    var Level3State = function() {
         this.player = gameManager.getSprite('player');
         this.boss = gameManager.getSprite('boss');
    };


    Level3State.prototype.preload = function() {
        // Para carregar um sprite, basta informar uma chave e dizer qual é o arquivo
        this.game.load.image('mapTiles', 'assets/spritesheets/tiled-fases.png');
        this.game.load.image('platform', 'assets/spritesheets/platform.png');

        this.game.load.tilemap('level3', 'assets/maps/level3.json', null, Phaser.Tilemap.TILED_JSON);

        this.game.load.audio('environmentSoundBoss', 'assets/sounds/levels/VLAD8BitBull.ogg');

        // player preload
        this.player.preload();

        // boss preload
        this.boss.preload();
    }

    Level3State.prototype.create = function() {

        // start physic system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // tilemap
        this.level3 = this.game.add.tilemap('level3');

        // tileset
        this.level3.addTilesetImage('tiled-fases', 'mapTiles');
        
        // layers
        this.bgLayer = this.level3.createLayer('BG');
        this.items = this.level3.createLayer('Items');
        this.floor = this.level3.createLayer('Floor');

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
        
        this.level3.setCollisionByExclusion([], true, this.items);
        this.level3.setCollisionByExclusion([], true, this.floor);
            
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
        
        // Texto do level
        this.level3Text = this.game.add.text(this.game.world.centerX + 180, 30, 'Level 3', { fill: '#ffffff', align: 'center', fontSize: 27 });
        this.level3Text.anchor.set(0.5);
        this.level3Text.fixedToCamera = true;  
        
        // Text HP BOSS
        this.bossHP = this.game.add.text(620, 550, 'Boss: '+this.boss.HP+'%', {font: "25px Arial", fill: "#ffffff"});
        this.bossHP.fixedToCamera = true;

    }

    Level3State.prototype.bossPlayerCollision = function(boss, player) {
        gameManager.globals.lives === 0;
        this.player.decreaseLives.apply(this.player);
    }

    Level3State.prototype.bossBulletCollision = function(player, bullet) {
        if (gameManager.globals.bossBulletCollision) {
            bullet.kill();

        // game over
        if(gameManager.globals.lives === 1) {
            this.bossSound.stop();
        }

        this.player.decreaseLives.apply(this.player);
        }
    }

    Level3State.prototype.playerBulletCollision = function(player, bullet) {
        bullet.kill();
        this.boss.HP -= 2;
        this.bossHP.setText('Boss: '+ this.boss.HP +'%');

        if(this.boss.HP <= 0) {
            this.game.state.start('win');
            this.bossSound.stop();
        }

        if(this.boss.state === 'normal' && this.boss.HP <= this.boss.limitHPToTransform) {
            this.boss.transform.apply(this.boss);
        }
    }

    Level3State.prototype.update = function() {
        // player and boss collisions
        this.game.physics.arcade.collide(this.player.sprite, this.floor, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform1, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform2, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.boss.sprite, this.floor);
        this.game.physics.arcade.collide(this.boss.sprite, this.player.sprite, this.C, null, this);
        
        // bullet colliders
        this.game.physics.arcade.overlap(this.player.sprite, this.boss.bullets, this.bossBulletCollision, null, this);
        this.game.physics.arcade.overlap(this.boss.sprite, this.player.bullets, this.playerBulletCollision, null, this);

        // handle player inputs
        this.player.handleInputs();
        this.player.checkGravity.apply(this.player); 

        // move boss
        this.boss.move.apply(this.boss);
    }

    gameManager.addState('level3', Level3State);

})();