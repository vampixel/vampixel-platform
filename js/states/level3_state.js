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
        this.game.load.spritesheet('blood', 'assets/img/blood.png', 42, 42, 1);
        this.game.load.spritesheet('capa_hud', 'assets/spritesheets/capa_hud.png', 64, 64, 1);
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
        this.player.sprite.x = 300;
        this.player.sprite.y = 1505;
        this.game.camera.follow(this.player.sprite);

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
    }

    Level3State.prototype.handleCollisions = function() {
        this.game.physics.arcade.collide(this.player.sprite, this.floorLayer, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.wallLayer, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.overlap(this.player.sprite, this.capasToCollectLevel2, this.player.capasToCollectCollision, null, this.player); 
        this.game.physics.arcade.overlap(this.player.sprite, this.livesToCollect, this.player.livesToCollectCollision, null, this.player); 
    }

    Level3State.prototype.playerUpdate = function() {
        this.player.handleInputs();
        this.player.checkGravity.apply(this.player); 
    }

    Level3State.prototype.diamondCollect = function(player, diamond){
        diamond.kill();
        gameManager.globals.environmentSoundLevel2.stop();
        gameManager.globals.isLevel2 = false;
        gameManager.globals.isLevel3 = true;
        this.game.state.start('transicao');
    }

    Level3State.prototype.render = function() {
        // this.game.debug.inputInfo(32, 32);
        // this.game.debug.spriteInfo(this.player.sprite, 32, 32);
        // this.game.debug.body(this.player.sprite);
    }

    gameManager.addState('level3', Level3State);

})();