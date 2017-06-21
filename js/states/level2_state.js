(function () {
    'use strict'; 

    var Level2State = function() {
        this.player = gameManager.getSprite('player');
    };

    Level2State.prototype.preload = function() {
        // player
        this.player.preload();
        
        this.game.load.image('tileMapImage', 'assets/spritesheets/Tiles-Castelo-32x32.png');
        this.game.load.tilemap('level2Map', 'assets/maps/level_2_castle.json', null, Phaser.Tilemap.TILED_JSON);
    }

    Level2State.prototype.create = function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.level2Map = this.game.add.tilemap('level2Map');
        this.level2Map.addTilesetImage('Tiles-Castelo-32x32', 'tileMapImage');

        // wall layer setup
        this.bgLayer = this.level2Map.createLayer('bg');
        this.level2Map.setCollisionByExclusion([], true, this.bgLayer);
        
        this.wallLayer = this.level2Map.createLayer('wall');
        this.level2Map.setCollisionByExclusion([], true, this.wallLayer);

        // floor layer setup
        this.floorLayer = this.level2Map.createLayer('floor');
        this.level2Map.setCollisionByExclusion([], true, this.floorLayer);
        this.floorLayer.resizeWorld();

        // setup initial player properties        
        this.player.setup(this);
        this.player.sprite.x = 300;
        this.player.sprite.y = 870;
        this.game.camera.follow(this.player.sprite);
    }
    
    Level2State.prototype.update = function() {
        this.handleCollisions();
        this.playerUpdate();        
    }

    Level2State.prototype.handleCollisions = function() {
        this.game.physics.arcade.collide(this.player.sprite, this.floorLayer, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.wallLayer, this.player.groundCollision, null, this.player);
    }

    Level2State.prototype.playerUpdate = function() {
        this.player.handleInputs();
        this.player.checkGravity.apply(this.player); 
    }

    Level2State.prototype.render = function() {
        // this.game.debug.inputInfo(32, 32);
        // this.game.debug.spriteInfo(this.player.sprite, 32, 32);
    }

    gameManager.addState('level2', Level2State);

})();