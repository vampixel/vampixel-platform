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

        this.game.load.audio('environmentSoundBoss', 'assets/sounds/boss.ogg');

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
	    this.platform3 = this.game.add.sprite(110, 410, 'platform');
        this.game.physics.arcade.enable(this.platform1);
        this.game.physics.arcade.enable(this.platform2);
        this.game.physics.arcade.enable(this.platform3);
        this.platform1.body.immovable = true;
        this.platform2.body.immovable = true;
        this.platform3.body.immovable = true;
        this.platform1.body.checkCollision.down = false;
        this.platform2.body.checkCollision.down = false;
        this.platform3.body.checkCollision.down = false;

        // Mais informações sobre tilemaps:
        // https://photonstorm.github.io/phaser-ce/#toc14

        // Redimensionando o tamanho do "mundo" do jogo
        this.bgLayer.resizeWorld();
        
        this.level3.setCollisionByExclusion([], true, this.items);
        this.level3.setCollisionByExclusion([], true, this.floor);
            
        // Inicializando jogador
        this.player.setup(this);
        this.boss.setup(this);
        this.game.camera.follow(this.player.sprite);

        // Música de fundo - criada da mesma forma, mas com o parâmetro loop = true
        this.bossSound = this.game.add.audio('environmentSoundBoss');
        this.bossSound.loop = true;
        // this.bossSound.play();
        
        // HUD de score
        // A linha abaixo adiciona um texto na tela, e a próxima faz com o que o texto fique
        // fixo na câmera, dessa forma não vai se deslocar quando a câmera mudar
        this.scoreText = this.game.add.text(500, 50, "Score: 0", {font: "25px Arial", fill: "#ffffff"});
        this.scoreText.fixedToCamera = true;
        
        this.score = 0;

    }

    Level3State.prototype.update = function() {
        // player and boss collisions
        this.game.physics.arcade.collide(this.player.sprite, this.floor, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.boss.sprite, this.floor);
        this.game.physics.arcade.collide(this.player.sprite, this.platform1, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform2, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform3, this.player.groundCollision, null, this.player);        
        
        // handle player inputs
        this.player.handleInputs();

        // move boss
        this.boss.move.apply(this.boss);
    }

    // Condição de derrota: guarde o score e siga para o próximo estado
    Level3State.prototype.gameover = function(){
        //player.kill();
        this.game.state.start('lose');
    }
    
    gameManager.addState('level3', Level3State);

})();