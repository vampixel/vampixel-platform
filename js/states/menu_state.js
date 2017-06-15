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
        this.game.load.image('instructionButton', 'assets/img/controlsButton.png');
        this.game.load.image('creditsButton', 'assets/img/creditButton.png');
        
        // Sounds
        this.game.load.audio('menuSound', 'assets/sounds/ui/gameSoundMenu.ogg');
        this.game.load.audio('clickSound', 'assets/sounds/ui/click.ogg');
    }   
    
    MenuState.prototype.create = function() {
        // player lives
        gameManager.globals.lives = 3;
        gameManager.globals.isLevel1 = false;
        gameManager.globals.isLevel2 = false;
        gameManager.globals.isLevel3 = false;
        
        this.game.add.tileSprite(0, 0, 800, 600, 'background');
        
        this.clickSound = this.game.add.audio('clickSound');
    
        this.menuSound = this.game.add.audio('menuSound');
        this.menuSound.loop = true;
        this.menuSound.play();
        
        this.onMenu = true;
        
        var startButton = this.game.add.button(150, 450, 'startButton', startButtonClicked, this);
        startButton.anchor.set(0.5);
        
        var chooseLevelButton = this.game.add.button(400, 450, 'chooseLevelButton', chooseLevelButton, this);
        chooseLevelButton.anchor.set(0.5);
        
        var instructionButton = this.game.add.button(640, 450, 'instructionButton', instructionButton, this);
        instructionButton.anchor.set(0.5);
        
        var creditsButton = this.game.add.button(710, 40, 'creditsButton', creditsButton, this);
        creditsButton.anchor.set(0.5);

        function startButtonClicked() {
            this.clickSound.play();
            this.menuSound.stop();
            gameManager.globals.isLevel1 = true;
            this.game.state.start('transicao');
        }
        
        function chooseLevelButton() {
            this.clickSound.play();
            this.game.state.start('level'+ prompt("Digite a fase"));
            this.menuSound.stop();
        }

        function instructionButton() {
            this.clickSound.play();
            this.menuSound.stop();
            this.game.state.start('menuInstructions');
        }
        
        function creditsButton() {
            this.clickSound.play();
            this.menuSound.stop();
            this.game.state.start('menuCredits');
        }
    }
    
    MenuState.prototype.update = function() {
    }  
    
    gameManager.addState('menu', MenuState);

})();