(function () {
    'use strict'; 

    var LoseState = function() {
    };

    LoseState.prototype.preload = function() {
        //this.game.load.image('background', 'assets/img/gameOver.jpg');
    }
    
    LoseState.prototype.create = function() {
        var self = this;
        
        //this.bg = this.game.add.image(800, 600, 'background');    
        //game.add.tileSprite(0, 0, 800, 600, 'background');
        
        var text = this.game.add.text(400, 300, 'GAME OVER', { fill: '#ffffff', align: 'center' });
        text.anchor.set(0.5);
        
        var scoreTextGameOver = this.game.add.text(400, 200, gameManager.globals.score, { fill: '#ffffff', align: 'center' });
        scoreTextGameOver.anchor.set(0.5);
        
        setTimeout(function () {
            self.game.state.start('menu');
        }, 5000);
    }

    gameManager.addState('lose', LoseState);

})();