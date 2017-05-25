(function () {
    'use strict'; 

    var Level2State = function() {
         this.player = gameManager.getSprite('player');
    };


    Level2State.prototype.preload = function() {
        // Para carregar um sprite, basta informar uma chave e dizer qual é o arquivo
        this.game.load.image('mapTiles', 'Assets/spritesheets/tiles.png');

        // Para carregar um spritesheet, é necessário saber a altura e largura de cada sprite, e o número de sprites no arquivo
        // No caso do player.png, os sprites são de 32x32 pixels, e há 8 sprites no arquivo
        // this.game.load.spritesheet('player', 'Assets/spritesheets/player.png', 32, 32, 8);
        this.game.load.spritesheet('items', 'Assets/spritesheets/items.png', 32, 32, 16);
        this.game.load.spritesheet('enemies', 'Assets/spritesheets/enemies.png', 32, 32, 12);
        
        // Para carregar um arquivo do Tiled, o mesmo precisa estar no formato JSON
        this.game.load.tilemap('level2', 'assets/maps/level2.json', null, Phaser.Tilemap.TILED_JSON);

        // Para carregar os sons, basta informar a chave e dizer qual é o arquivo
        //this.game.load.audio('jumpSound', 'Assets/sounds/jump.wav');
        //this.game.load.audio('pickupSound', 'Assets/sounds/pickup.wav');
        //this.game.load.audio('playerDeath', 'Assets/sounds/hurt3.ogg');
        this.game.load.audio('enemyDeath', 'Assets/sounds/hit2.ogg');
        this.game.load.audio('music', 'Assets/sounds/mystery.wav');

        // player
        this.player.preload();
    }

    Level2State.prototype.create = function() {

        // Inicializando sistema de física
        // o sistema Arcade é o mais simples de todos, mas também é o mais eficiente em termos de processamento.
        // https://photonstorm.github.io/phaser-ce/Phaser.Physics.Arcade.html
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Para carregar o mapa do Tiled para o Phaser, 3 estágios são necessários:
        // 1 - Criar um objeto com o arquivo do Tiled carregado no preload()
        this.level2 = this.game.add.tilemap('level2');
        // 2 - Adicionar as imagens correspondentes aos tilesets do Tiled dentro do Phaser
        // "tiles" é o nome do tileset dentro do Tiled
        // "mapTiles" é o nome da imagem com os tiles, carregada no preload()
        this.level2.addTilesetImage('tiles', 'mapTiles');
        
        // 3 - Criar os layers do mapa
        // A ordem nesse caso é importante, então os layers que ficarão no "fundo" deverão ser
        // criados primeiro, e os que ficarão na "frente" por último;
        this.bgLayer = this.level2.createLayer('Floor');
        //this.lavaLayer = this.level1.createLayer('Lava');
        this.wallsLayer = this.level2.createLayer('BG');
        // Mais informações sobre tilemaps:
        // https://photonstorm.github.io/phaser-ce/#toc14

        // Redimensionando o tamanho do "mundo" do jogo
        this.wallsLayer.resizeWorld();
        
        // Para que possamos detectar colisões dos objetos com os layers do mapa, primeiro precisamos
        // informar quais tiles deverão efetivamente ter um colisor, para cada layer.
        // Esta contagem é feita olhando o tileset no Tiled, sendo que o tile mais à esquerda da
        // primeira linha do tileset terá valor 1, o próximo na linha valor 2, e assim por diante,
        // continuando a contagem na próxima linha, até o último tile da última linha.
        
        // Neste caso, ao invés de dizermos quais tiles devem colidir, estamos dizendo quais tiles não
        // devem colidir, pois há mais tiles que colidem do que tiles sem colisão.
        // Os parâmetros são a lista dos tiles, "true" indicando que a colisão deve ser ativada,
        // e o nome do layer.
        this.level2.setCollisionByExclusion([9, 10, 11, 12, 17, 18, 19, 20], true, this.wallsLayer);
        
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
        this.level2.createFromObjects('Items', 'diamond', 'items', 5, true, false, this.diamonds);
        // Para cada objeto do grupo, vamos executar uma função
        this.diamonds.forEach(function(diamond){
            // body.immovable = true indica que o objeto não é afetado por forças externas
            diamond.body.immovable = true;
            // Adicionando animações; o parâmetro true indica que a animação é em loop
            diamond.animations.add('spin', [4, 5, 6, 7, 6, 5], 6, true);
            diamond.animations.play('spin');
        });
        
        this.bats = this.game.add.physicsGroup();
        this.level2.createFromObjects('Enemies', 'bat', 'enemies', 8, true, false, this.bats);
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

        // Criando assets de som com this.game.add.audio()
        // O parâmetro é o nome do asset definido no preload()
        
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

    Level2State.prototype.update = function() {
        //this.menuSound.stop();
        // Detecção de colisões
        // Todas as colisões entre os objetos do jogo são avaliadas com arcade.collide() ou 
        // arcade.overlap(). O Phaser irá automaticamente calcular a colisão dos objetos
        // Inicialmente, adicionando colisões do player com as paredes da fase, que é um layer:
        this.game.physics.arcade.collide(this.player.sprite, this.wallsLayer, this.player.groundCollision, null, this.player);
        
        // Colisão com os morcegos - depende de como foi a colisão, veremos abaixo
        this.game.physics.arcade.overlap(this.player.sprite, this.bats, this.batCollision, null, this);

        // Adicionando colisão entre os morcegos e as paredes
        this.game.physics.arcade.collide(this.bats, this.wallsLayer);
        
        // Movimentação do player
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
        
    }
    
    // Tratamento da colisão entre o jogador e os diamantes
    Level2State.prototype.batCollision = function(player, bat){
        // Se o jogador colidir por baixo e o morcego por cima, isso indica que o jogador pulou
        // em cima do morcego, nesse caso vamos "matar" o morcego
        if(player.body.touching.down && bat.body.touching.up){
            this.enemyDeathSound.play(); // tocando som de morte do morcego
            this.player.body.velocity.y = -200; // adicionando um pequeno impulso vertical ao jogador
            this.score += 100; // atualizando score
            this.scoreText.text = "Score: " + this.score;
            bat.kill();
        }
        else this.lose(); // caso contrário, ir para condição de derrota
    }

    // Condição de derrota: guarde o score e siga para o próximo estado
    Level2State.prototype.gameover = function(){
        alert("game over");
    }


    gameManager.addState('level2', Level2State);

})();