(function () {
    'use strict'; 

    var TransicaoState = function() {
    };

    TransicaoState.prototype.preload = function() {
        this.game.load.image('bg', 'assets/img/menu.png');
        this.game.load.spritesheet('telaLoading', 'assets/spritesheets/Loading-16x110.png', 110, 16, 16);
        
        this.game.load.spritesheet('telaTransicao', 'assets/spritesheets/telaTransicaoBoca800x600.png', 800, 600, 14);
        
    }
    
    TransicaoState.prototype.create = function() {
        var self = this;
        
        this.bg = this.game.add.image(0, 0, 'bg');    
        
        this.telaTransicao = this.game.add.sprite(400, 300, 'telaTransicao');
        this.telaTransicao.anchor.set(0.5, 0.5);
        this.telaTransicao.animations.add('transicao', [7, 8, 9, 10, 11, 12, 13, 12, 11, 10, 9, 8, 7], 10, true);
        this.telaTransicao.animations.play('transicao'); 
        
        this.telaTransicao = this.game.add.sprite(700, 580, 'telaLoading');
        this.telaTransicao.anchor.set(0.5, 0.5);
        this.telaTransicao.animations.add('loading', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 10, true);
        this.telaTransicao.animations.play('loading');
        
        if (gameManager.globals.isLevel1) {
            setTimeout(function () {
                self.game.state.start('level1');
            }, 2500);
        } else if (gameManager.globals.isLevel2) {
            setTimeout(function () {
                self.game.state.start('level2');
            }, 2500);
        } else if (gameManager.globals.isLevel3) {
            setTimeout(function () {
                self.game.state.start('level3');
            }, 2500);
        } else if (gameManager.globals.isLevel4) {
            setTimeout(function () {
                self.game.state.start('level4');
            }, 2500);
        } else if (gameManager.globals.isWin) {
            setTimeout(function () {
                self.game.state.start('menu');
            }, 2500);
        } else if (gameManager.globals.isLose) {
            setTimeout(function () {
                self.game.state.start('menu');
            }, 2500);
        }
    }

    gameManager.addState('transicao', TransicaoState);

})();