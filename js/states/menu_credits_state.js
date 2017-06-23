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
        'Tela de Creditos\n Universidade do Estado do Amazonas\n Pos-Graduacao em Desenvolvimento de Jogos Eletronicos\n Equipe: MarmotaLab\n - Fernando Dantas\n - Paulo Matos\n - Jeferson Barros\n - Irlan Gomes\n - Josue Aguiar\n - Renan Zuany\n - Claudio Sampaio\n Orientadora: Professora Dra. Cristina Araujo \n Assets Externos:\n -\n -\n', 
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