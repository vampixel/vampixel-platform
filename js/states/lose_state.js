(function () {
    'use strict'; 

    var LoseState = function() {
    };

    LoseState.prototype.create = function() {
        var self = this;
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'GAME OVER', { fill: '#ffffff', align: 'center' });
        text.anchor.set(0.5);
        
        setTimeout(function () {
            self.game.state.start('menu');
        }, 2000);
    }

    gameManager.addState('lose', LoseState);

})();