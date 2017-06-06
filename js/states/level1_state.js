(function () {
    'use strict'; 

    var Level1State = function(Level1) {
        // load sprites here
        this.player = gameManager.getSprite('player');
 
    };
    
    Level1State.prototype.preload = function() {
        // player
        this.player.preload();
        this.game.load.spritesheet('rato', 'assets/spritesheets/rato-sprite.png', 64, 64, 3);
        this.game.load.image('tiledFases', 'assets/spritesheets/tiled-fases.png');
        this.game.load.spritesheet('items', 'Assets/spritesheets/items.png', 32, 32, 16);
        this.game.load.spritesheet('enemies', 'Assets/spritesheets/enemies.png', 32, 32, 12);
        this.game.load.audio('environmentSound', 'assets/sounds/environment.ogg');
        
        //Tile maps
        this.game.load.tilemap('Level1','assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    }

    Level1State.prototype.create = function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.environmentSound = this.game.add.audio('environmentSound');
        this.environmentSound.loop = true;
        this.environmentSound.play();
    
        //Tile maps
        this.Level1 = this.game.add.tilemap('Level1');
        this.Level1.addTilesetImage('tiled-fases','tiledFases');
        
        this.bgLayer = this.Level1.createLayer('Bg');
        this.fireLayer = this.Level1.createLayer('Fire');
        this.wallsLayer = this.Level1.createLayer('Walls');
        this.wallsLayer.resizeWorld();
        
        //Tile maps - collision
        //this.Level1.setCollisionByExclusion([19,20,21,22,23,24], true, this.wallsLayer);
        this.Level1.setCollisionByExclusion([], true, this.wallsLayer);
        this.Level1.setCollisionByExclusion([], true, this.fireLayer);
        
        // setup initial player properties
        this.player.setup(this);
        this.player.sprite.x = this.game.world.centerX;
        this.player.sprite.y = 70;
        
        //Movimentacao de camera
        this.game.camera.follow(this.player.sprite);
        
        // texto do level
        this.level1Text = this.game.add.text(this.game.world.centerX, 105, 'Level 1', { fill: '#ffffff', align: 'center', fontSize: 30 });
        this.level1Text.anchor.set(0.5);
        this.level1Text.fixedToCamera = true;  
        
        //Ratos
        this.ratos = this.game.add.physicsGroup();
        this.Level1.createFromObjects('Enemies', 'rato', 'rato', 8, true, false, this.ratos);
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
        this.Level1.createFromObjects('Enemies', 'fireBullet', 'items', 5, true, false, this.fireBullets);
        
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
        this.Level1.createFromObjects('Items', 'diamond', 'items', 5, true, false, this.diamonds);
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
        
        this.Level1.createFromObjects('Enemies', 'bat', 'enemies', 8, true, false, this.bats);
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
        
        //Fire effect with phaser particles
        var emitter;
        var pSize = this.game.world.width / 12.5;
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
        emitter.width = 11 * pSize;
        emitter.particleClass = FireParticle;
        
        // Magic happens here, bleding the colors of each particle
        // generates the bright light effect
        emitter.blendMode = PIXI.blendModes.ADD;
        emitter.makeParticles();
        emitter.minParticleSpeed.set(-15, -160);
        emitter.maxParticleSpeed.set(15, -200);
        emitter.setRotation(0, 0);
        // Make the flames taller than they are wide to simulate the
        // effect of flame tongues
        emitter.setScale(3, 1, 4, 3, 12000, Phaser.Easing.Quintic.Out);
        emitter.gravity = -20;
        emitter.start(false, 3000, 50);
    }
    
    function FireParticle(game, x, y) {
        Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('flame'));
    }
    
    FireParticle.prototype = Object.create(Phaser.Particle.prototype);
    FireParticle.prototype.constructor = FireParticle;
    
    
    Level1State.prototype.update = function() {
        this.game.physics.arcade.collide(this.player.sprite, this.fireLayer, this.fireDeath, null, this);
        
        this.game.physics.arcade.overlap(this.player.sprite, this.bats, this.batCollision, null, this);
        this.game.physics.arcade.collide(this.player.sprite, this.wallsLayer, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.overlap(this.player.sprite, this.diamonds, this.diamondCollect, null, this);        
        this.game.physics.arcade.overlap(this.player.sprite, this.fireBullets, this.fireBullet, null, this);        
        this.game.physics.arcade.overlap(this.player.sprite, this.ratos, this.ratosCollision, null, this);        
        this.game.physics.arcade.collide(this.bats, this.wallsLayer);
        this.game.physics.arcade.collide(this.ratos, this.wallsLayer);
        this.game.physics.arcade.collide(this.fireBullets, this.wallsLayer, this.fireBulletCollideWall, null, this);
        
        this.game.physics.arcade.overlap(this.ratos, this.player.bullets, this.playerBulletCollision, null, this);
        
        this.player.handleInputs(); 
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
        
    Level1State.prototype.playerBulletCollision = function(ratos, bullet) {
        bullet.kill();
        ratos.kill();
        this.player.increaseScoreRatos.apply();
    }

    Level1State.prototype.diamondCollect = function(player, diamond){
        diamond.kill();
        this.game.state.start('level2');  
    } 
    
    Level1State.prototype.fireBulletCollideWall = function(fireBullet){
        fireBullet.kill();
    }
    
    Level1State.prototype.fireBullet = function(player, fireBullet){
        fireBullet.kill();
        this.player.decreaseLives.apply(this.player); 
    }
    
    Level1State.prototype.batCollision = function(player, bat){
       bat.kill();
       this.player.decreaseLives.apply(this.player);
    }
    Level1State.prototype.ratosCollision = function(player, rato){
       rato.kill();
       this.player.decreaseLives.apply(this.player);
    }
    
    Level1State.prototype.fireDeath = function(player, fire){
        this.player.decreaseLives.apply(this.player);
    }

    gameManager.addState('level1', Level1State);

})();
