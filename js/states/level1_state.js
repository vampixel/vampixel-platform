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
        this.game.load.image('mapTiles', 'assets/spritesheets/tiled-fases.png');
        this.game.load.audio('environmentSound', 'assets/sounds/environment.ogg');

    }

    Level1State.prototype.create = function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.environmentSound = this.game.add.audio('environmentSound');
        this.environmentSound.loop = true;
        this.environmentSound.play();
    
        //Tile maps
        this.Level1 = this.game.add.tilemap('Level1');
        this.Level1.addTilesetImage('tiled-fases','mapTiles');
        
        this.bgLayer = this.Level1.createLayer('Bg');
        this.lavaLayer = this.Level1.createLayer('Lava');
        this.wallsLayer = this.Level1.createLayer('Walls');
        this.wallsLayer.resizeWorld();
        
        //Tile maps - collision
        this.Level1.setCollisionByExclusion([19,20,21,22,23,24,11,16,17,18,19], true, this.wallsLayer);
        this.Level1.setCollision([5,6,13], true, this.lavaLayer);
        
        // setup initial player properties
        this.player.setup(this);
        this.player.sprite.x = 628;
        this.player.sprite.y = 70;
        
        //Movimentacao de camera
        this.game.camera.follow(this.player.sprite);
        
        //Fire effect with phaser particles
        var emitter;
        var pSize = this.game.world.width / 22.5;
        var bmpd = this.game.add.bitmapData(pSize, pSize);
        // Create a radial gradient, yellow-ish on the inside, orange
        // on the outside. Use it to draw a circle that will be used
        // by the FireParticle class.
        var grd = bmpd.ctx.createRadialGradient(
        pSize / 2, pSize /2, 2,
        pSize / 2, pSize / 2, pSize * 0.5);
        grd.addColorStop(0, 'rgba(193, 170, 30, 0.6)');
        grd.addColorStop(1, 'rgba(255, 100, 30, 0.1)');
        bmpd.ctx.fillStyle = grd;
        
        bmpd.ctx.arc(pSize / 2, pSize / 2 , pSize / 2, 0, Math.PI * 2);
        bmpd.ctx.fill();
        
        this.game.cache.addBitmapData('flame', bmpd);
        
        // Generate 100 particles
        emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.height, 100);
        emitter.width = 3 * pSize;
        emitter.particleClass = FireParticle;
        
        // Magic happens here, bleding the colors of each particle
        // generates the bright light effect
        emitter.blendMode = PIXI.blendModes.ADD;
        emitter.makeParticles();
        emitter.minParticleSpeed.set(-15, -80);
        emitter.maxParticleSpeed.set(15, -100);
        emitter.setRotation(0, 0);
        // Make the flames taller than they are wide to simulate the
        // effect of flame tongues
        emitter.setScale(3, 1, 4, 3, 12000, Phaser.Easing.Quintic.Out);
        emitter.gravity = -5;
        emitter.start(false, 3000, 50);
    }
    
    function FireParticle(game, x, y) {
        Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('flame'));
    }
    
    FireParticle.prototype = Object.create(Phaser.Particle.prototype);
    FireParticle.prototype.constructor = FireParticle;
    
    Level1State.prototype.update = function() {
        this.game.physics.arcade.collide(this.player.sprite, this.wallsLayer, this.player.groundCollision, null, this.player);
        this.player.handleInputs();
        //this.menuSound.stop();
    } 

    
    gameManager.addState('level1', Level1State);

})();