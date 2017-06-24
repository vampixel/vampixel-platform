(function () {
    'use strict'; 

    var MenuState = function() {
    };

    MenuState.prototype.preload = function() {
        this.onMenu = true;
        
        // Images
        this.game.load.image('background', 'assets/img/menu.png');
        this.game.load.image('startButton', 'assets/img/startButton.png');
        this.game.load.image('chooseLevelButton', 'assets/img/chooseLevelButton.png');
        this.game.load.image('controlsButton', 'assets/img/controlsButton.png');
        this.game.load.image('creditsButton', 'assets/img/creditButton.png');
        this.game.load.image('bgInicial', 'assets/img/gameOver.jpg');
        
        // Sprite Sheet
        this.game.load.spritesheet('telaTransicao', 'assets/spritesheets/telaTransicaoBoca800x600.png', 800, 600, 14);
        this.game.load.spritesheet('telaLoading', 'assets/spritesheets/Loading-16x110.png', 110, 16, 16);
        
        // Sounds
        this.game.load.audio('menuSound', 'assets/sounds/ui/gameSoundMenu.ogg');
        this.game.load.audio('clickSound', 'assets/sounds/ui/click.ogg');
    }   
    
    MenuState.prototype.create = function() {
        // player lives
        gameManager.globals.lives = 3;
        gameManager.globals.isLevelChamine = false;
        //gameManager.globals.isLevel1 = false;
        gameManager.globals.isLevel2 = false;
        gameManager.globals.isLevel3 = false;
        gameManager.globals.isLevel4 = false;
        gameManager.globals.isWin = false;
        gameManager.globals.isLose = false;
        gameManager.globals.InputsEnable = true;
        gameManager.globals.InputsPlayer = true;
        
        this.onMenu = true;
        
        this.game.add.tileSprite(0, 0, 800, 600, 'background');
        this.bgLoading = this.game.add.tileSprite(0, 0, 800, 600, 'bgInicial');
        
        this.telaTransicaoMenu = this.game.add.sprite(400, 300, 'telaTransicao');
        this.telaTransicaoMenu.anchor.set(0.5, 0.5);
        this.telaTransicaoMenu.animations.add('transicaoBefore', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
        
        this.telaTransicao = this.game.add.sprite(700, 580, 'telaLoading');
        this.telaTransicao.anchor.set(0.5, 0.5);
        this.telaTransicao.animations.add('loading', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 10, true);
        this.telaTransicao.animations.play('loading');
        
        this.clickSound = this.game.add.audio('clickSound');
    
        this.menuSound = this.game.add.audio('menuSound');
        this.menuSound.loop = true;      
        this.menuSound.play(); 
        
        var startButton = this.game.add.button(150, 450, 'startButton', startButtonClicked, this);
        startButton.anchor.set(0.5);
        startButton.alpha = 0;
        
        var chooseLevelButton = this.game.add.button(400, 450, 'chooseLevelButton', chooseLevelButton, this);
        chooseLevelButton.anchor.set(0.5);
        chooseLevelButton.alpha = 0;
        
        var controlsButton = this.game.add.button(640, 450, 'controlsButton', controlsButton, this);
        controlsButton.anchor.set(0.5);
        controlsButton.alpha = 0;
        
        var creditsButton = this.game.add.button(710, 40, 'creditsButton', creditsButton, this);
        creditsButton.anchor.set(0.5);
        creditsButton.alpha = 0;
        
        this.game.time.events.add(4000, function() {
            startButton.alpha = 1;
            chooseLevelButton.alpha = 1;
            controlsButton.alpha = 1;
            creditsButton.alpha = 1;
            this.bgLoading.alpha = 0;
            this.telaTransicao.destroy();
        }, this);
        
        
        function startButtonClicked() {
            startButton.alpha = 0;
            chooseLevelButton.alpha = 0;
            controlsButton.alpha = 0;
            creditsButton.alpha = 0;
            this.clickSound.play();
            this.menuSound.stop();
            //gameManager.globals.isLevelChamine = true;
            gameManager.globals.isLevel1 = true;
            //this.game.state.start('levelChamine');
            //this.game.state.start('level1');
            this.telaTransicaoMenu.animations.play('transicaoBefore');
            this.game.time.events.add(1000, function() {
                this.telaTransicaoMenu.animations.stop('transicaoBefore');
            }, this);
            this.game.time.events.add(3000, function() {
                this.game.state.start('transicao');
            }, this);
        }
        
        function chooseLevelButton() {
            this.clickSound.play();
            this.game.state.start('level'+ prompt("Digite a fase"));
            this.menuSound.stop();
        }
        
        function controlsButton() {
            startButton.alpha = 0;
            chooseLevelButton.alpha = 0;
            controlsButton.alpha = 0;
            creditsButton.alpha = 0;
            this.clickSound.play();
            this.menuSound.stop();
            this.telaTransicaoMenu.animations.play('transicaoBefore');
            this.game.time.events.add(1000, function() {
                this.telaTransicaoMenu.animations.stop('transicaoBefore');
            }, this);
            this.game.time.events.add(3000, function() {
                this.game.state.start('menuInstructions');
            }, this);
        }
        
        function creditsButton() {
            startButton.alpha = 0;
            chooseLevelButton.alpha = 0;
            controlsButton.alpha = 0;
            creditsButton.alpha = 0;
            this.clickSound.play();
            this.menuSound.stop();
            this.telaTransicaoMenu.animations.play('transicaoBefore');
            this.game.time.events.add(1000, function() {
                this.telaTransicaoMenu.animations.stop('transicaoBefore');
            }, this);
            this.game.time.events.add(3000, function() {
                this.game.state.start('menuCredits');
            }, this); 
        }
    }
    
    
    MenuState.prototype.update = function() {
    }  
    
    gameManager.addState('menu', MenuState);

})();