(function () {
    'use strict'; 

    var Level3State = function() {
        // load sprites here
        this.player = gameManager.getSprite('player');
 
    };
    
    Level3State.prototype.preload = function() {
        // player
        this.player.preload();
        
        //Tile maps
        this.game.load.tilemap('Level3','assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('mapTiles', 'assets/spritesheets/tiles.png');
        
        this.game.load.audio('soundBoss', 'Assets/sounds/boss.ogg');
    }

    Level3State.prototype.create = function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.soundBoss = this.game.add.audio('soundBoss');
        this.soundBoss.loop = true;
        this.soundBoss.play();
    
        //Tile maps
        this.Level3 = this.game.add.tilemap('Level3');
        this.Level3.addTilesetImage('tiles','mapTiles');
        
        this.bgLayer = this.Level3.createLayer('Bg');
        this.lavaLayer = this.Level3.createLayer('Lava');
        this.wallsLayer = this.Level3.createLayer('Walls');
        this.wallsLayer.resizeWorld();
        
        //Tile maps - collision
        this.Level3.setCollisionByExclusion([8,9,19,11,16,17,18,19], true, this.wallsLayer);
        this.Level3.setCollision([5,6,13], true, this.lavaLayer);
        
        // setup initial player properties
        this.player.setup(this);
        
        //  Movimentacao de camera
        
        
    }
    
    Level3State.prototype.update = function() {
        this.game.physics.arcade.collide(this.player.sprite, this.wallsLayer, this.player.groundCollision, null, this.player);
        this.player.handleInputs();
        //this.menuSound.stop();
    } 

    
    gameManager.addState('level3', Level3State);

})();