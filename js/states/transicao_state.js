(function () {
    'use strict'; 

    var TransicaoState = function() {
    };

    TransicaoState.prototype.preload = function() {
        this.game.load.image('bg', 'assets/img/bgRed.jpg');
        this.game.load.spritesheet('telaTransicao', 'assets/spritesheets/telaTransicaoBoca800x600.png', 800, 600, 14);
        
    }
    
    TransicaoState.prototype.create = function() {
        var self = this;
        
        this.bg = this.game.add.image(0, 0, 'bg');    
        
        this.telaTransicao = this.game.add.sprite(400, 300, 'telaTransicao');
        this.telaTransicao.anchor.set(0.5, 0.5);
        this.telaTransicao.animations.add('transicao', [7, 8, 9, 10, 11, 10, 9, 8, 7], 8, true);
        this.telaTransicao.animations.play('transicao'); 
        
        if (gameManager.globals.isLevel1) {
            setTimeout(function () {
                self.game.state.start('level1');
            }, 2000);
        } else if (gameManager.globals.isLevel2) {
            setTimeout(function () {
                self.game.state.start('level2');
            }, 2000);
        } else if (gameManager.globals.isLevel3) {
            setTimeout(function () {
                self.game.state.start('level3');
            }, 2000);
        } else if (gameManager.globals.isWin) {
            setTimeout(function () {
                self.game.state.start('menu');
            }, 2000);
        } else if (gameManager.globals.isLose) {
            setTimeout(function () {
                self.game.state.start('menu');
            }, 2000);
        }
    }

    gameManager.addState('transicao', TransicaoState);

})();