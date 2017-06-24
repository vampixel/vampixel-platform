(function () {
    'use strict'; 

    var TransicaoState = function() {
    };

    TransicaoState.prototype.preload = function() {
        this.game.load.image('bg', 'assets/img/gameOver.png');
        this.game.load.spritesheet('telaLoading', 'assets/spritesheets/Loadin.png', 110, 16, 16);
    }
    
    TransicaoState.prototype.create = function() {
        var self = this;
        
        this.bg = this.game.add.image(0, 0, 'bg');    
        
        this.telaTransicao = this.game.add.sprite(600, 550, 'telaLoading');
        this.telaTransicao.anchor.set(0.5, 0.5);
        this.telaTransicao.animations.add('loading', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 16, true);
        this.telaTransicao.animations.play('loading'); 
        
        setTimeout(function () {
            self.game.state.start('menu');
        }, 3000);
    }

    gameManager.addState('transicao', TransicaoState);

})();