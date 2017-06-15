(function () {
    'use strict'; 

    var TransicaoState = function() {
    };

    TransicaoState.prototype.preload = function() {
        this.game.load.image('bg', 'assets/img/bgWhite.jpg');
        this.game.load.spritesheet('telaTransicao', 'assets/spritesheets/telaTransicaoBoca400x300.png', 400, 300, 14);
        
    }
    
    TransicaoState.prototype.create = function() {
        var self = this;
        
        this.bg = this.game.add.image(0, 0, 'bg');    
        
        this.telaTransicaoLevel1to2 = this.game.add.sprite(400, 300, 'telaTransicao');
        this.telaTransicaoLevel1to2.anchor.set(0.5, 0.5);
        this.telaTransicaoLevel1to2.animations.add('transicao', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 15, true);
        this.telaTransicaoLevel1to2.animations.play('transicao');
        
        var text = this.game.add.text(710, 580, 'LOADING...', { fill: 'Black' });
        text.anchor.set(0.5);
        
        if (gameManager.globals.isLevel1) {
            setTimeout(function () {
                self.game.state.start('level1');
            }, 5000);
        } else if (gameManager.globals.isLevel2) {
            setTimeout(function () {
                self.game.state.start('level2');
            }, 5000);
        } else if (gameManager.globals.isLevel3) {
            setTimeout(function () {
                self.game.state.start('level3');
            }, 5000);
        }
    }

    gameManager.addState('transicao', TransicaoState);

})();