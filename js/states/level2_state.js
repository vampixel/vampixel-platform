(function () {
    'use strict'; 

    var Level2State = function(level2) {
        // load sprites here
        this.player              = gameManager.getSprite('player');
 
    };
    
    Level2State.prototype.preload = function() {
        // player
        this.player.preload();
        
        //Tile maps
        this.game.load.tilemap('level2','assets/maps/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('mapTiles', 'assets/spritesheets/tiles.png');
    }

    Level2State.prototype.create = function() {
       this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
        //Tile maps
        this.level2 = this.game.add.tilemap('level2');
        this.level2.addTilesetImage('tiles','mapTiles');
        
        this.bgLayer = this.level2.createLayer('Bg');
        this.lavaLayer = this.level2.createLayer('Lava');
        this.wallsLayer = this.level2.createLayer('Walls');
        this.wallsLayer.resizeWorld();
        
        //Tile maps - collision
        this.level2.setCollisionByExclusion([8,9,19,11,16,17,18,19], true, this.wallsLayer);
        this.level2.setCollision([5,6,13], true, this.lavaLayer);
        
        // setup initial player properties
        this.player.setup(this);
        
        //Movimentacao de camera
        //this.level2.camera.follow(this.player);
    }

    gameManager.addState('level2', Level2State);

})();