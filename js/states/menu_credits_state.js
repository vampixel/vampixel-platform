(function () {
    'use strict'; 

    var MenuCredits = function() {
    };

    MenuCredits.prototype.preload = function() {
        //this.game.load.image('background', 'assets/spritesheets/tela-instrucoes.png');
        this.game.load.image('back', 'assets/img/voltarButton.png');
        this.game.load.audio('clickSound', 'assets/sounds/ui/click.ogg');
        this.game.load.audio('menuCreditsSound', 'assets/sounds/ui/mystery.wav');
    }   
    
    MenuCredits.prototype.create = function() {
        //this.game.add.tileSprite(0, 0, 800, 600, 'background');
        
        this.clickSound = this.game.add.audio('clickSound');
        
        this.menuCreditsSound = this.game.add.audio('menuCreditsSound');
        this.menuCreditsSound.loop = true;
        this.menuCreditsSound.play();
        
        var voltarButton = this.game.add.button(710, 560, 'back', voltarButtonClicked, this);
        voltarButton.anchor.set(0.5);

        var textCredits = this.game.add.text(30, 30, 
        'Universidade do Estado do Amazonas\n\nPós-Graduação em Desenvolvimento de Jogos Eletrônicos\n\nAlunos: \n- Irlan Gomes\n- Paulo Matos\n\nOrientador: Prof. Msc. Rodrigo Braga',
        { fill: '#ffffff' });
        //text.anchor.set(0.5);        
        
        function voltarButtonClicked() {
            this.clickSound.play();
            this.menuCreditsSound.stop();
            this.game.state.start('menu');
        }
    }
    
   MenuCredits.prototype.update = function() {
   }  
    
   gameManager.addState('menuCredits', MenuCredits);

})();