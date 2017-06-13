(function () {
    'use strict'; 

    var Level2State = function() {
        this.player = gameManager.getSprite('player');
        
        this.bullets;
        this.bulletTime = 0;
        this.bullet;
        
        //BatShot
        this.imageNameBatShot = 'batShot_image';
        this.imageUrlBatShot = 'assets/img/red_square_10x10.png';
        this.imageBatShot = null;
    };

    Level2State.prototype.preload = function() {
        // player
        this.player.preload();
        
        // Para carregar um sprite, basta informar uma chave e dizer qual é o arquivo
        this.game.load.image('mapTiles', 'assets/spritesheets/tiled-fases.png');
        this.game.load.image('crucifixo_image', 'assets/img/crucifixo2.png');
        this.game.load.image(this.imageNameBatShot, this.imageUrlBatShot);

        // Para carregar um spritesheet, é necessário saber a altura e largura de cada sprite, e o número de sprites no arquivo
        this.game.load.spritesheet('items', 'assets/spritesheets/items.png', 32, 32, 16);
        this.game.load.spritesheet('freira', 'assets/spritesheets/FREIRA-SPRITE.png', 64, 64, 4);
        this.game.load.spritesheet('arqueiro', 'assets/spritesheets/ARQUEIRO-SPRITE.png', 64, 64, 3);
        this.game.load.spritesheet('blood', 'assets/img/blood.png', 42, 42, 1);
        
        // Para carregar um arquivo do Tiled, o mesmo precisa estar no formato JSON
        this.game.load.tilemap('level2', 'assets/maps/level21.json', null, Phaser.Tilemap.TILED_JSON);

        // Para carregar os sons, basta informar a chave e dizer qual é o arquivo
        this.game.load.audio('environmentSound', 'assets/sounds/levels/gumbelElSiniestroYLaVelz.ogg');
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
        this.level2.addTilesetImage('tiled-fases', 'mapTiles');
        
        // 3 - Criar os layers do mapa
        // A ordem nesse caso é importante, então os layers que ficarão no "fundo" deverão ser
        // criados primeiro, e os que ficarão na "frente" por último;
        
        this.bgLayer = this.level2.createLayer('BG');
        this.itemLayer = this.level2.createLayer('Item');
        this.floor = this.level2.createLayer('Floor');
        this.wallsLayer = this.level2.createLayer('Wall');
        
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
        this.level2.setCollisionByExclusion([11, 12, 17, 19, 20], true, this.floor);
        
        // Para o caso oposto: poucos tiles colidindo, então é mais fácil informar diretamente quais sã0
        //this.level1.setCollision([5, 6, 13], true, this.lavaLayer);
        
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
        
        // Inicializando jogador
        // setup initial player properties        
        this.player.setup(this);
        this.player.sprite.x = 85;
        this.player.sprite.y = 844;
        this.game.camera.follow(this.player.sprite);

        // Life
        this.livesToCollect = this.game.add.physicsGroup();
        this.level2.createFromObjects('Items', 'life', 'blood', 0, true, false, this.livesToCollect);
        this.livesToCollect.forEach(function(addlifeLevel2) {
            addlifeLevel2.anchor.setTo(0.5);
            addlifeLevel2.body.immovable = true;
        });
        
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
        
        // Grupo de Arqueiros        
        this.arqs = this.game.add.physicsGroup();
        this.level2.createFromObjects('Enemies', 'arq', 'arqueiro', 8, true, false, this.arqs);
        this.arqs.forEach(function(arq){
            arq.anchor.setTo(0, 0);
            arq.body.immovable = true;
            arq.animations.add('fly', [1,2,3], 6, true);
            arq.animations.play('fly');
            // Velocidade inicial do inimigo
            arq.body.velocity.x = 100;
            // bounce.x=1 indica que, se o objeto tocar num objeto no eixo x, a força deverá
            // ficar no sentido contrário; em outras palavras, o objeto é perfeitamente elástico
            arq.body.bounce.x = 1;
        });
        
        // Grupo de Freiras        
        this.nuns = this.game.add.physicsGroup();
        this.level2.createFromObjects('Enemies', 'nun', 'freira', 8, true, false, this.nuns);
        this.nuns.forEach(function(nun){
            nun.anchor.setTo(0, 0);
            nun.body.immovable = true;
            nun.animations.add('fly', [1,2,3,4], 6, true);
            nun.animations.play('fly');
            // Velocidade inicial do inimigo
            nun.body.velocity.x = 100;
            // bounce.x=1 indica que, se o objeto tocar num objeto no eixo x, a força deverá
            // ficar no sentido contrário; em outras palavras, o objeto é perfeitamente elástico
            nun.body.bounce.x = 1;
        });

        // Criando assets de som com this.game.add.audio()
        // O parâmetro é o nome do asset definido no preload()
        //this.jumpSound = this.game.add.audio('jumpSound');
        
        // Música de fundo - criada da mesma forma, mas com o parâmetro loop = true, para ficar repetindo
        this.music = this.game.add.audio('environmentSound');
        this.music.loop = true;
        this.music.play();

        // Texto do level
        this.level2Text = this.game.add.text(400, 105, 'Level 2', { fill: '#ffffff', align: 'center', fontSize: 30 });
        this.level2Text.anchor.set(0.5);
        this.level2Text.fixedToCamera = true;  
       
        // Estado do jogo - Variáveis para guardar quaisquer informações pertinentes para as condições de 
        // vitória/derrota, ações do jogador, etc
        // this.totalDiamonds = this.diamonds.length;
        // this.collectedDiamonds = 0;
        // this.score = 0;
        
        // Bullets dos Arqueiros
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true; 
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 40; i++){
            var b = this.bullets.create(0, 0, this.imageNameBatShot);
            b.name = 'imageNameBatShot' + i;
            b.exists = false;
            b.visible = true;
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(this.resetBullet, this);
        }
        
        this.game.time.events.loop(Phaser.Timer.SECOND, function () {
            var self = this;
            this.arqs.forEach(function(arq){
                self.fire(arq);
            })
        }, this);
    }

    Level2State.prototype.update = function() {
        // Detecção de colisões
        // Todas as colisões entre os objetos do jogo são avaliadas com arcade.collide() ou 
        // arcade.overlap(). O Phaser irá automaticamente calcular a colisão dos objetos
        // Inicialmente, adicionando colisões do player com as paredes da fase, que é um layer:
        this.game.physics.arcade.collide(this.player.sprite, this.floor, this.player.groundCollision, null, this.player);
    
        // Colisão com os diamantes - devem ser coletados
        this.game.physics.arcade.overlap(this.player.sprite, this.diamonds, this.diamondCollect, null, this);
        
        // Colisão do Player com os Inimigos
        this.game.physics.arcade.overlap(this.player.sprite, this.nuns, this.enemiesCollision, null, this);
        this.game.physics.arcade.overlap(this.player.sprite, this.arqs, this.enemiesCollision, null, this);
        
        // Colisão dos Inimigos com as balas do player    
        this.game.physics.arcade.overlap(this.nuns, this.player.bullets, this.playerBulletCollision, null, this);
        this.game.physics.arcade.overlap(this.arqs, this.player.bullets, this.playerBulletCollision, null, this);
        
        // Player pegando coração "vida"
        this.game.physics.arcade.overlap(this.player.sprite, this.livesToCollect, this.player.livesToCollectCollision, null, this.player); 

        // Colisão dos Arqueiros e freias com as paredes
        this.game.physics.arcade.collide(this.arqs, this.wallsLayer);
        this.game.physics.arcade.collide(this.nuns, this.wallsLayer);
        
        // Movimentação do player
        this.player.handleInputs();
        this.player.checkGravity.apply(this.player); 
         
        // Para cada morcego, verificar em que sentido ele está indo
        // Se a velocidade for positiva, a escala no eixo X será 1, caso
        // contrário -1
        this.arqs.forEach(function(arq){
           if(arq.body.velocity.x != 0) {
               // Math.sign apenas retorna o sinal do parâmetro: positivo retorna 1, negativo -1
               arq.scale.x = 1 * Math.sign(arq.body.velocity.x);
           }
        });
        
        this.nuns.forEach(function(nun){
           if(nun.body.velocity.x != 0) {
               // Math.sign apenas retorna o sinal do parâmetro: positivo retorna 1, negativo -1
               nun.scale.x = 1 * Math.sign(nun.body.velocity.x);
           }
        });
    }
    
    Level2State.prototype.enemiesCollision = function(player, enemie) {
        enemie.kill();
        this.player.decreaseLives.apply(this.player);
    }
    
    Level2State.prototype.LiveCollisionLevel2 = function(player, addlifeLevel2){
        addlifeLevel2.kill();
        this.player.addLives.apply(this.player); 
    }
    
    Level2State.prototype.playerBulletCollision = function(enemies, bullet) {
        bullet.kill();
        enemies.kill();
        this.player.increaseScoreEnemies.apply();
    }
    
    // Tratamento da colisão entre o jogador e os diamantes
    // As funções para esse fim sempre recebem os dois objetos que colidiram,
    // e então podemos manipular tais objetos
    Level2State.prototype.diamondCollect = function(player, diamond){
        diamond.kill();
        this.music.stop();
        gameManager.globals.isLevel2 = false;
        gameManager.globals.isLevel3 = true;
        this.game.state.start('level3');
    }
    
    //Shot Bats
    Level2State.prototype.fire = function (arq) {        
        if (this.game.time.now > this.bulletTime) {
            this.bullet = this.bullets.getFirstExists(false);
            if (this.bullet) {
                this.bullet.reset(arq.x, arq.y);
                if (arq.scale.x == 1) {
                    this.bullet.body.velocity.x = 300;
                    this.bulletTime = this.game.time.now + 150;
                } else {
                    this.bullet.body.velocity.x = -300;
                    this.bulletTime = this.game.time.now + 150;
                }
            }
        }
    }
    
    Level2State.prototype.resetBullet = function(bullet) {
        bullet.kill();
    }
    
    gameManager.addState('level2', Level2State);

})();