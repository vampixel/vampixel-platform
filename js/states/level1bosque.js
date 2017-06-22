(function () {
    'use strict';
    
    var Level1BosqueState = function () {
        this.player = gameManager.getSprite('player');
    }
    
    Level1BosqueState.prototype.preload = function () {
        // Pré carregamento do Player
        this.player.preload();
        
        // Pré carregamento dos SpriteSheet
        this.game.load.spritesheet('rato', 'assets/spritesheets/rato-sprite.png', 64, 64, 3);
        this.game.load.spritesheet('blood', 'assets/img/blood.png', 42, 42, 1);
        this.game.load.spritesheet('items', 'assets/spritesheets/items.png', 32, 32, 16)
        this.game.load.spritesheet('capa_hud', 'assets/spritesheets/capa_hud.png', 64, 64, 1);
        
        // Pré carregamento de imagens
        // Imagem do TileSet da Fase do Bosque
        this.game.load.image('tiledBosque', 'assets/spritesheets/tile-bosque-camada-1.png');
        this.game.load.image('tiledBosque1', 'assets/spritesheets/tile-bosque-background.png');
        
        // Pré carregamento do TileMap Construído
        this.game.load.tilemap('level1Bosque','assets/maps/level1bosque.json', null, Phaser.Tilemap.TILED_JSON);
        
        // Pré carregamento dos Áudios do Level
        this.game.load.audio('environmentSoundLevel1', 'assets/sounds/levels/environment.ogg');
    }
    
    Level1BosqueState.prototype.create = function () {
        // Criando a Física do Jogo
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Criando e rodando o Áudio d o Level
        gameManager.globals.environmentSoundLevel1 = this.game.add.audio('environmentSoundLevel1');
        gameManager.globals.environmentSoundLevel1.loop = true;
        gameManager.globals.environmentSoundLevel1.play();
        
        // Criando o TileMap e suas Camadas
        this.level1Bosque = this.game.add.tilemap('level1Bosque');
        this.level1Bosque.addTilesetImage('tile-bosque-camada-1','tiledBosque');
        this.level1Bosque.addTilesetImage('tile-bosque-background','tiledBosque1');
        
        this.bgLayer = this.level1Bosque.createLayer('bg');  
        this.bgMountainsLayer = this.level1Bosque.createLayer('bgMountains');
        this.bgTreeBehindLayer = this.level1Bosque.createLayer('bgTreeBehind');
        this.bgTreeLayer = this.level1Bosque.createLayer('bgTree');
        this.FloorLayer = this.level1Bosque.createLayer('floor');
        this.FloorLayer.resizeWorld();
        
        // Setando os Frames do TileSet que devem ter colisão 
        this.level1Bosque.setCollisionByExclusion([], true, this.FloorLayer);
        this.level1Bosque.setCollisionByExclusion([], true, this.bgTreeLayer);
        //this.level1Bosque.setCollisionByExclusion([], true, this.bgFloorLayer);
        
        // setup initial player properties and camera follow
        this.player.setup(this);
        this.player.sprite.x = 100;
        this.player.sprite.y = 400;
        this.game.camera.follow(this.player.sprite);
        
        // Texto do level
        this.level1BosqueText = this.game.add.text(570, 32, 'Bosque', { fill: '#ffffff', align: 'center', fontSize: 30 });
        this.level1BosqueText.anchor.set(0.5);
        this.level1BosqueText.fixedToCamera = true;
        
         // Life
        this.livesToCollect = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'life', 'blood', 0, true, false, this.livesToCollect);
        this.livesToCollect.forEach(function(addlifelevel1bosque) {
            addlifelevel1bosque.anchor.setTo(0.5);
            addlifelevel1bosque.body.immovable = true;
        });
        
        // Capas Level 1 Bosque
        this.capasToCollectLevel1 = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'capa', 'capa_hud', 0, true, false, this.capasToCollectLevel1);
        this.capasToCollectLevel1.forEach(function(addCapalevel1Bosque) {
            addCapalevel1Bosque.anchor.setTo(0.5);
            addCapalevel1Bosque.body.immovable = true;
        });
        
        //Inimigo Rato
        this.ratos = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('enemies', 'rato', 'rato', 0, true, false, this.ratos);
        this.ratos.forEach(function(rato){
            rato.anchor.setTo(0, 0);
            rato.body.immovable = true;
            //rato.animations.add('walk', [1,2,3], 6, true);
            //rato.animations.play('walk');
            //rato.body.velocity.x = 100;
            //rato.body.bounce.x = 1;
        });
        
        // Diamante
        this.diamonds = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'diamond', 'items', 5, true, false, this.diamonds);
        // Para cada objeto do grupo, vamos executar uma função
        this.diamonds.forEach(function(diamond){
            // body.immovable = true indica que o objeto não é afetado por forças externas
            diamond.body.immovable = true;
            // Adicionando animações; o parâmetro true indica que a animação é em loop
            diamond.animations.add('spin', [4, 5, 6, 7, 6, 5], 6, true);
            diamond.animations.play('spin');
        });
    }
    
    Level1BosqueState.prototype.update = function () {
        this.player.handleInputs();
        this.player.checkGravity.apply(this.player); 
        
        if (gameManager.globals.qtdeCapas > 0) {
            gameManager.globals.haveCapas = true;
        }

        // Collider do Player com a Água
        //this.game.physics.arcade.overlap(this.player.sprite, this.waterLayer, this.isDead, null, this);
        
        // Collider do Player com os Ratos
        this.game.physics.arcade.overlap(this.player.sprite, this.ratos, this.ratosCollision, null, this);
        
        // Rato morrendo ao ser atingido pelos morcegos do player
        this.game.physics.arcade.overlap(this.ratos, this.player.bullets, this.playerBulletCollision, null, this);
        
        // Player pegando sangue "vida"
        this.game.physics.arcade.overlap(this.player.sprite, this.livesToCollect, this.player.livesToCollectCollision, null, this.player); 
        
        // Player pegando capa
        this.game.physics.arcade.overlap(this.player.sprite, this.capasToCollectLevel1, this.player.capasToCollectCollision, null, this.player); 
        
        // Inimigos e Player com as paredes e chão
        //this.game.physics.arcade.collide(this.ratos, this.FloorLayer);
        this.game.physics.arcade.collide(this.player.sprite, this.FloorLayer, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.bgTreeLayer, this.player.groundCollision, null, this.player);
        
        // Player Coletando Diamante para ir para outro Level
        this.game.physics.arcade.overlap(this.player.sprite, this.diamonds, this.goLevel2, null, this); 
    }
    
     Level1BosqueState.prototype.ratosCollision = function (player, rato) {
         if (gameManager.globals.isColliderRatos){
            rato.kill();
            this.player.decreaseLives.apply(this.player);
         }
     }
     
     Level1BosqueState.prototype.isDead = function (player) {
        this.player.gameover(this.player);
     }
    
     Level1BosqueState.prototype.playerBulletCollision = function (ratos, bullet) {
        bullet.kill();
        ratos.kill();
        this.player.increaseScoreRatos.apply(this.player);
     }     
     
    Level1BosqueState.prototype.goLevel2 = function () {
        gameManager.globals.environmentSoundLevel1.stop();
        gameManager.globals.isLevel1 = false
        gameManager.globals.isLevel2 = true;
        this.game.state.start('transicao'); 
    }
         
    gameManager.addState('level1Bosque', Level1BosqueState);
    
})();