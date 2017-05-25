(function () {
    'use strict'; 

    var Level1State = function(Level1) {
        // load sprites here
        this.player = gameManager.getSprite('player');
 
    };
    
    Level1State.prototype.preload = function() {
        // player
        this.player.preload();
        
        //Tile maps
        this.game.load.tilemap('Level1','assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('mapTiles', 'assets/spritesheets/tiles.png');
        this.game.load.audio('environmentSound', 'assets/sounds/environment.ogg');
    }

    Level1State.prototype.create = function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.environmentSound = this.game.add.audio('environmentSound');
        this.environmentSound.loop = true;
        this.environmentSound.play();
    
        //Tile maps
        this.Level1 = this.game.add.tilemap('Level1');
        this.Level1.addTilesetImage('tiles','mapTiles');
        
        this.bgLayer = this.Level1.createLayer('Bg');
        this.lavaLayer = this.Level1.createLayer('Lava');
        this.wallsLayer = this.Level1.createLayer('Walls');
        this.wallsLayer.resizeWorld();
        
        //Tile maps - collision
        this.Level1.setCollisionByExclusion([8,9,19,11,16,17,18,19], true, this.wallsLayer);
        this.Level1.setCollision([5,6,13], true, this.lavaLayer);
        
        // setup initial player properties
        this.player.setup(this);
//        this.player.sprite.x = 170;
//        this.player.sprite.y = 70;
        this.player.sprite.x = 828;
        this.player.sprite.y = 70;
        
        //Movimentacao de camera
        this.game.camera.follow(this.player.sprite);
        
    }
    
    Level1State.prototype.update = function() {
        this.game.physics.arcade.collide(this.player.sprite, this.wallsLayer, this.player.groundCollision, null, this.player);
        this.player.handleInputs();
        //this.menuSound.stop();
    } 

    
    gameManager.addState('level1', Level1State);

})();