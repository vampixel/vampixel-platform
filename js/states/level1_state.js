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
        this.game.load.spritesheet('interrogacao', 'assets/img/interrogacao.png', 32, 32, 1);
        
        
        // Pré carregamento de imagens
        // Imagem do TileSet da Fase do Bosque
        this.game.load.image('tiledBosque', 'assets/spritesheets/tilesetBosque.png');
        this.game.load.image('tiledBosque1', 'assets/spritesheets/tilesetBosqueBackground.png');
        this.game.load.image('tutorialTiro', 'assets/img/instrucoes-tiro.png');
        this.game.load.image('tutorialPulo', 'assets/img/instrucoes-pulo.png');
        this.game.load.image('tutorialInvisivel', 'assets/img/instrucoes-invisivel.png');
        this.game.load.image('tutorialLobo', 'assets/img/instrucoes-correr.png');
        
        // Pré carregamento do TileMap Construído
        this.game.load.tilemap('level1Bosque','assets/maps/level_1_bosque.json', null, Phaser.Tilemap.TILED_JSON);
        
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
        this.level1Bosque.addTilesetImage('tilesetBosque','tiledBosque');
        this.level1Bosque.addTilesetImage('tilesetBosqueBackground','tiledBosque1');
        
        this.bgLayer = this.level1Bosque.createLayer('bg');  
        this.bgMountainsLayer = this.level1Bosque.createLayer('bgMountains');
        this.bgTreeBehindLayer = this.level1Bosque.createLayer('bgTreeBehind');
        this.bgTreeLayer = this.level1Bosque.createLayer('bgTree');
        this.enemyBackTriggerLayer = this.level1Bosque.createLayer('enemy_back_trigger');
        this.wallMargins = this.level1Bosque.createLayer('wallMargins');
        this.waterLayer = this.level1Bosque.createLayer('water');
        this.FloorLayer = this.level1Bosque.createLayer('floor');
        this.FloorLayer.resizeWorld();
        
        // Setando os Frames do TileSet que devem ter colisão 
        this.level1Bosque.setCollisionByExclusion([], true, this.FloorLayer);
        this.level1Bosque.setCollision([121, 122, 123, 124, 125], true, this.waterLayer);
        this.level1Bosque.setCollisionByExclusion([], true, this.enemyBackTriggerLayer);
        this.level1Bosque.setCollisionByExclusion([], true, this.wallMargins);
        
        // setup initial player properties and camera follow
        this.player.setup(this);
        this.player.sprite.x = 100;
        this.player.sprite.y = 400;
        this.game.camera.follow(this.player.sprite);
        
        // Texto do level
        this.level1BosqueText = this.game.add.text(570, 32, 'Bosque', { fill: '#ffffff', align: 'center', fontSize: 30 });
        this.level1BosqueText.anchor.set(0.5);
        this.level1BosqueText.fixedToCamera = true;
        
        // Tutorial Tiro
        this.tutorialTiro = this.game.add.sprite(150, 310, 'tutorialTiro'); 
        this.tutorialTiro.anchor.set(0.5);
        this.tutorialTiro.alpha = 0;
        
        // Tutorial Pulo Duplo
        this.tutorialPuloDuplo = this.game.add.sprite(610, 430, 'tutorialPulo'); 
        this.tutorialPuloDuplo.anchor.set(0.5);
        this.tutorialPuloDuplo.alpha = 0;
        
        // Tutorial Capa
        this.tutorialCapa = this.game.add.sprite(1150, 380, 'tutorialInvisivel'); 
        this.tutorialCapa.anchor.set(0.5);
        this.tutorialCapa.alpha = 0;
        
        /* // Tutorial Life
        this.tutorialLife = this.game.add.sprite(2465, 180, 'tutorial'); 
        this.tutorialLife.anchor.set(0.5);
        this.tutorialLife.alpha = 0; */
        
        // Tutorial Lobo
        this.tutorialLobo = this.game.add.sprite(3744, 200, 'tutorialLobo'); 
        this.tutorialLobo.anchor.set(0.5);
        this.tutorialLobo.alpha = 0;
        
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
        
        // teletransport
        this.teletransport = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'teletransport', 'items', 5, true, false, this.teletransport);
        // Para cada objeto do grupo, vamos executar uma função
        this.teletransport.forEach(function(transport){
            // body.immovable = true indica que o objeto não é afetado por forças externas
            transport.body.immovable = true;
            transport.animations.add('spin', [4, 5, 6, 7, 7, 6, 5, 4], 10, true);
            transport.animations.play('spin');
        });
        
        // interrogação Tiro
        this.interrogacaoTiro = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'interrogacaoTiro', 'interrogacao', 0, true, false, this.interrogacaoTiro);
        this.interrogacaoTiro.forEach(function(interTiro) {
            interTiro.anchor.setTo(0.5);
            interTiro.body.immovable = true;
        });
        
        // interrogação PuloDuplo
        this.interrogacaoPuloDuplo = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'interrogacaoPuloDuplo', 'interrogacao', 0, true, false, this.interrogacaoPuloDuplo);
        this.interrogacaoPuloDuplo.forEach(function(interPuloDuplo) {
            interPuloDuplo.anchor.setTo(0.5);
            interPuloDuplo.body.immovable = true;
        });
        
        // interrogação Capa
        this.interrogacaoCapa = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'interrogacaoCapa', 'interrogacao', 0, true, false, this.interrogacaoCapa);
        this.interrogacaoCapa.forEach(function(interCapa) {
            interCapa.anchor.setTo(0.5);
            interCapa.body.immovable = true;
        });
        
        /* // interrogação Life
        this.interrogacaoLife = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'interrogacaoLife', 'interrogacao', 0, true, false, this.interrogacaoLife);
        this.interrogacaoLife.forEach(function(interLife) {
            interLife.anchor.setTo(0.5);
            interLife.body.immovable = true;
        }); */
        
        // interrogação Lobo
        this.interrogacaoLobo = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('items', 'interrogacaoLobo', 'interrogacao', 0, true, false, this.interrogacaoLobo);
        this.interrogacaoLobo.forEach(function(interLobo) {
            interLobo.anchor.setTo(0.5);
            interLobo.body.immovable = true;
        });
        
        //Inimigo Rato
        this.ratos = this.game.add.physicsGroup();
        this.level1Bosque.createFromObjects('enemies', 'ratos', 'rato', 0, true, false, this.ratos);
        this.ratos.forEach(function(rato){
            rato.anchor.setTo(0, 0);
            rato.body.immovable = true;
            rato.animations.add('walk', [1,2,3], 6, true);
            rato.animations.play('walk');
            rato.body.velocity.x = 100;
            rato.body.bounce.x = 1;
        }); 
    }
    
    Level1BosqueState.prototype.update = function () { 
        this.player.handleInputs();
        this.player.checkGravity.apply(this.player); 
        
        if (gameManager.globals.qtdeCapas > 0) {
            gameManager.globals.haveCapas = true;
        }
        
        // Collider do Player com os Ratos
        this.game.physics.arcade.overlap(this.player.sprite, this.ratos, this.ratosCollision, null, this);
        
        // Rato morrendo ao ser atingido pelos morcegos do player
        this.game.physics.arcade.overlap(this.ratos, this.player.bullets, this.playerBulletCollision, null, this);
        
        // Player pegando sangue "vida"
        this.game.physics.arcade.overlap(this.player.sprite, this.livesToCollect, this.player.livesToCollectCollision, null, this.player); 
        
        // Player pegando capa
        this.game.physics.arcade.overlap(this.player.sprite, this.capasToCollectLevel1, this.player.capasToCollectCollision, null, this.player);
        
        // Player Pegando interrogação do Tiro
        this.game.physics.arcade.overlap(this.player.sprite, this.interrogacaoTiro, this.InterrogacaoTiroCollision, null, this);
        // Player Pegando interrogação do Pulo Duplo
        this.game.physics.arcade.overlap(this.player.sprite, this.interrogacaoPuloDuplo, this.InterrogacaoPuloDCollision, null, this);
        // Player Pegando interrogação da Capa
        this.game.physics.arcade.overlap(this.player.sprite, this.interrogacaoCapa, this.InterrogacaoCapaCollision, null, this);
        // Player Pegando interrogação da Vida
        //this.game.physics.arcade.overlap(this.player.sprite, this.interrogacaoLife, this.InterrogacaoLifeCollision, null, this);
        // Player Pegando interrogação do Lobo
        this.game.physics.arcade.overlap(this.player.sprite, this.interrogacaoLobo, this.InterrogacaoLoboCollision, null, this);
        
        // Player Coletando Diamante para ir para outro Level
        this.game.physics.arcade.overlap(this.player.sprite, this.teletransport, this.goLevel2, null, this); 
        
        this.game.physics.arcade.collide(this.player.sprite, this.FloorLayer, this.player.groundCollision, null, this.player);
        if (this.game.physics.arcade.collide(this.player.sprite, this.waterLayer)) {
            this.player.sprite.body.moves = false;
            this.player.gameover();
        }
        
        // Inimigos e Player com as paredes
        this.game.physics.arcade.collide(this.ratos, this.enemyBackTriggerLayer);
        this.game.physics.arcade.collide(this.player.sprite, this.wallMargins);
        
        this.ratos.forEach(function(rato){
            if(rato.body.velocity.x != 0) {
                // Math.sign apenas retorna o sinal do parâmetro: positivo retorna 1, negativo -1
                rato.scale.x = 1 * Math.sign(rato.body.velocity.x);
            }
        });       
    }
    
    Level1BosqueState.prototype.ratosCollision = function (player, rato) {
         if (gameManager.globals.isColliderRatos){
            rato.kill();
            this.player.decreaseLives.apply(this.player);
         }
     }
    
    Level1BosqueState.prototype.playerBulletCollision = function (rato, bullet) {
        bullet.kill();
        rato.kill();
        this.player.increaseScoreRatos.apply(this.player);
     }              
     
    // Tutorial
    Level1BosqueState.prototype.InterrogacaoTiroCollision = function (player, interrogacaoTiro) {
        interrogacaoTiro.kill();
        this.tutorialTiro.alpha = 1;
        gameManager.globals.InputsPlayer = false;
        this.player.sprite.body.moves = false;
        this.game.time.events.add(4000, function() {
            this.tutorialTiro.alpha = 0;
            gameManager.globals.InputsPlayer = true;
            this.player.sprite.body.moves = true;
        }, this);
    }
    Level1BosqueState.prototype.InterrogacaoPuloDCollision = function (player, interrogacaoPuloDuplo) { 
        interrogacaoPuloDuplo.kill();
        this.tutorialPuloDuplo.alpha = 1;
        gameManager.globals.InputsPlayer = false;
        this.player.sprite.body.moves = false;
        this.game.time.events.add(4000, function() {
            this.tutorialPuloDuplo.alpha = 0;
            gameManager.globals.InputsPlayer = true;
            this.player.sprite.body.moves = true;
        }, this);
    }
    Level1BosqueState.prototype.InterrogacaoCapaCollision = function (player, interrogacaoCapa) {  
        interrogacaoCapa.kill();
        this.tutorialCapa.alpha = 1;
        gameManager.globals.InputsPlayer = false;
        this.player.sprite.body.moves = false;
        this.game.time.events.add(4000, function() {
            this.tutorialCapa.alpha = 0;
            gameManager.globals.InputsPlayer = true;
            this.player.sprite.body.moves = true;
        }, this);
    }
    /* Level1BosqueState.prototype.InterrogacaoLifeCollision = function (player, interrogacaoLife) { 
        interrogacaoLife.kill();
        this.tutorialLife.alpha = 1;
        gameManager.globals.InputsPlayer = false;
        this.player.sprite.body.moves = false;
        this.game.time.events.add(4000, function() {
            this.tutorialLife.alpha = 0;
            gameManager.globals.InputsPlayer = true;
            this.player.sprite.body.moves = true;
        }, this);
    } */
    Level1BosqueState.prototype.InterrogacaoLoboCollision = function (player, interrogacaoLobo) { 
        interrogacaoLobo.kill();
        this.tutorialLobo.alpha = 1;
        gameManager.globals.InputsPlayer = false;
        this.player.sprite.body.moves = false;
        //this.player.sprite.animations.stop('wolfRun');
        this.game.time.events.add(4000, function() {
            this.tutorialLobo.alpha = 0;
            gameManager.globals.InputsPlayer = true;
            this.player.sprite.body.moves = true;
        }, this);
    }
    
    Level1BosqueState.prototype.goLevel2 = function (transport) {
        transport.kill();
        gameManager.globals.environmentSoundLevel1.stop();
        gameManager.globals.isLevel1 = false
        gameManager.globals.isLevel2 = true;
        this.game.state.start('transicao'); 
    }
         
    gameManager.addState('level1', Level1BosqueState);
    
})();