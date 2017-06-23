(function () {
    'use strict'; 

    var MenuInstructions = function() {
    };

    MenuInstructions.prototype.preload = function() {
        this.game.load.image('background', 'assets/spritesheets/tela-instrucoes.png');
        this.game.load.image('back', 'assets/img/voltarButton.png');
        this.game.load.audio('clickSound', 'assets/sounds/ui/click.ogg');
        this.game.load.audio('menuInstructionSound', 'assets/sounds/ui/mystery.wav');
    }   
    
    MenuInstructions.prototype.create = function() {
        this.game.add.tileSprite(0, 0, 800, 600, 'background');
        this.clickSound = this.game.add.audio('clickSound');
        
        this.environmentSound = this.game.add.audio('menuInstructionSound');
        this.environmentSound.loop = true;
        this.environmentSound.play();

        var voltarButton = this.game.add.button(700, 100, 'back', voltarButtonClicked, this);
        voltarButton.anchor.set(0.5);
        
        function voltarButtonClicked() {
            this.clickSound.play();
            this.environmentSound.stop();
            this.game.state.start('menu');
        }
    }
    
    MenuInstructions.prototype.update = function() {
    }  
    
    gameManager.addState('menuInstructions', MenuInstructions);

})();