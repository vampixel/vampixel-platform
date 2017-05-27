(function () {
    'use strict'; 

    var Level3State = function() {
         this.player = gameManager.getSprite('player');
    };


    Level3State.prototype.preload = function() {
        // Para carregar um sprite, basta informar uma chave e dizer qual é o arquivo
        this.game.load.image('mapTiles', 'assets/spritesheets/tiled-fases.png');
        this.game.load.image('platform', 'assets/spritesheets/platform.png');

        // Para carregar um spritesheet, é necessário saber a altura e largura de cada sprite, e o número de sprites no arquivo
        // No caso do player.png, os sprites são de 32x32 pixels, e há 8 sprites no arquivo
        // this.game.load.spritesheet('player', 'assets/spritesheets/player.png', 32, 32, 8);
        // this.game.load.spritesheet('items', 'assets/spritesheets/items.png', 32, 32, 16);
        // this.game.load.spritesheet('enemies', 'assets/spritesheets/enemies.png', 32, 32, 12);
        
        // Para carregar um arquivo do Tiled, o mesmo precisa estar no formato JSON
        this.game.load.tilemap('level3', 'assets/maps/level3.json', null, Phaser.Tilemap.TILED_JSON);

        // Para carregar os sons, basta informar a chave e dizer qual é o arquivo
        //this.game.load.audio('jumpSound', 'assets/sounds/jump.wav');
        //this.game.load.audio('pickupSound', 'assets/sounds/pickup.wav');
        //this.game.load.audio('playerDeath', 'assets/sounds/hurt3.ogg');
        this.game.load.audio('enemyDeath', 'assets/sounds/hit2.ogg');
        this.game.load.audio('music', 'assets/sounds/mystery.wav');

        // player
        this.player.preload();
    }

    Level3State.prototype.create = function() {

        // Inicializando sistema de física
        // o sistema Arcade é o mais simples de todos, mas também é o mais eficiente em termos de processamento.
        // https://photonstorm.github.io/phaser-ce/Phaser.Physics.Arcade.html
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Para carregar o mapa do Tiled para o Phaser, 3 estágios são necessários:
        // 1 - Criar um objeto com o arquivo do Tiled carregado no preload()
        this.level3 = this.game.add.tilemap('level3');
        // 2 - Adicionar as imagens correspondentes aos tilesets do Tiled dentro do Phaser
        // "tiles" é o nome do tileset dentro do Tiled
        // "mapTiles" é o nome da imagem com os tiles, carregada no preload()
        this.level3.addTilesetImage('tiled-fases', 'mapTiles');
        
        // 3 - Criar os layers do mapa
        // A ordem nesse caso é importante, então os layers que ficarão no "fundo" deverão ser
        // criados primeiro, e os que ficarão na "frente" por último;
        this.bgLayer = this.level3.createLayer('BG');
        this.items = this.level3.createLayer('Items');
        this.floor = this.level3.createLayer('Floor');


	    this.platform1 = this.game.add.sprite(110, 220, 'platform');
	    this.platform2 = this.game.add.sprite(280, 330, 'platform');
	    this.platform3 = this.game.add.sprite(110, 420, 'platform');
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
        
        // Para que possamos detectar colisões dos objetos com os layers do mapa, primeiro precisamos
        // informar quais tiles deverão efetivamente ter um colisor, para cada layer.
        // Esta contagem é feita olhando o tileset no Tiled, sendo que o tile mais à esquerda da
        // primeira linha do tileset terá valor 1, o próximo na linha valor 2, e assim por diante,
        // continuando a contagem na próxima linha, até o último tile da última linha.
        
        // Neste caso, ao invés de dizermos quais tiles devem colidir, estamos dizendo quais tiles não
        // devem colidir, pois há mais tiles que colidem do que tiles sem colisão.
        // Os parâmetros são a lista dos tiles, "true" indicando que a colisão deve ser ativada,
        // e o nome do layer.
        this.level3.setCollisionByExclusion([], true, this.items);
        this.level3.setCollisionByExclusion([], true, this.floor);
        
        // Para o layer de lava é o caso oposto: poucos tiles colidem, então é mais fácil 
        // informar diretamente quais são.
        //this.level1.setCollision([5, 6, 13], true, this.lavaLayer);
            
        // Inicializando jogador
        this.player.setup(this);
        this.game.camera.follow(this.player.sprite);
        
        // Adicionando objetos do Tiled, utilizando grupos
        // Um grupo é como se fosse um array de sprites, mas com várias facilidades adicionais, 
        // como por exemplo alterar atributos e facilitar detectar colisões com objetos do grupo
        // Especificamente, estamos criando physicsGroups, que já armazenam objetos com física ativada
        // https://photonstorm.github.io/phaser-ce/Phaser.GameObjectFactory.html#physicsGroup
        
        // Criando objetos que foram criados em um layer de objetos do Tiled
        // Parâmetros do createFromObjects():
        // nome do layer do Tiled de onde vamos criar os objetos
        // nome dos objetos do Tiled que serão criados
        // nome do spritesheet carregado no preload() com os objetos
        // frame do spritesheet, basta setar para um dos frames do objeto em questão
        // true, false - estes dois parâmetros podem ficar com estes valores
        // grupo - qual grupo do Phaser devemos adicionar esses objetos
        
        // Grupo de diamantes
        this.diamonds = this.game.add.physicsGroup();
        // this.level3.createFromObjects('Items', 'diamond', 'items', 5, true, false, this.diamonds);
        // Para cada objeto do grupo, vamos executar uma função
        this.diamonds.forEach(function(diamond){
            // body.immovable = true indica que o objeto não é afetado por forças externas
            diamond.body.immovable = true;
            // Adicionando animações; o parâmetro true indica que a animação é em loop
            diamond.animations.add('spin', [4, 5, 6, 7, 6, 5], 6, true);
            diamond.animations.play('spin');
        });
        
        this.bats = this.game.add.physicsGroup();
        
        
        //this.jumpSound = this.game.add.audio('jumpSound');
        //this.pickupSound = this.game.add.audio('pickupSound');
        //this.playerDeathSound = this.game.add.audio('playerDeath');
        this.enemyDeathSound = this.game.add.audio('enemyDeath');
        
        // Música de fundo - criada da mesma forma, mas com o parâmetro loop = true
        this.music = this.game.add.audio('music');
        this.music.loop = true;
        // Já iniciamos a música aqui mesmo pra ficar tocando ao fundo
        this.music.play();
        
        // HUD de score
        // A linha abaixo adiciona um texto na tela, e a próxima faz com o que o texto fique
        // fixo na câmera, dessa forma não vai se deslocar quando a câmera mudar
        this.scoreText = this.game.add.text(500, 50, "Score: 0", 
                                {font: "25px Arial", fill: "#ffffff"});
        this.scoreText.fixedToCamera = true;
        
        // Estado do jogo - Variáveis para guardar quaisquer informações pertinentes para as condições de 
        // vitória/derrota, ações do jogador, etc
        this.totalDiamonds = this.diamonds.length;
        this.collectedDiamonds = 0;
        this.score = 0;

    }

    Level3State.prototype.update = function() {
        //this.menuSound.stop();
        // Detecção de colisões
        // Todas as colisões entre os objetos do jogo são avaliadas com arcade.collide() ou 
        // arcade.overlap(). O Phaser irá automaticamente calcular a colisão dos objetos
        // Inicialmente, adicionando colisões do player com as paredes da fase, que é um layer:
        //this.game.physics.arcade.collide(this.player.sprite, this.wallsLayer, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.floor, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform1, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform2, this.player.groundCollision, null, this.player);
        this.game.physics.arcade.collide(this.player.sprite, this.platform3, this.player.groundCollision, null, this.player);        
        
        
        // Colisão com os morcegos - depende de como foi a colisão, veremos abaixo
        this.game.physics.arcade.overlap(this.player.sprite, this.bats, this.gameover, null, this);

        
        // Movimentação do player
        this.player.handleInputs();
       
    }

    // Condição de derrota: guarde o score e siga para o próximo estado
    Level3State.prototype.gameover = function(){
        //player.kill();
        this.game.state.start('lose');
    }
    
    gameManager.addState('level3', Level3State);

})();