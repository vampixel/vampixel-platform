(function () {
    'use strict'; 

    var WinState = function() {
    };
    
     WinState.prototype.preload = function() {
        // Sounds
        this.game.load.audio('win', 'assets/sounds/ui/win.ogg');
        this.game.load.audio('clickSound', 'assets/sounds/ui/click.ogg');
    }   

    WinState.prototype.create = function() {
        // Sounds
        this.clickSound = this.game.add.audio('clickSound');
        this.menuSound = this.game.add.audio('menuSound');
        this.menuSound.play();
        
        var game = this.game;
        var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'You win!!!', { fill: '#ffffff', align: 'center' });
        text.anchor.set(0.5);

        setTimeout(function () {
            gameManager.globals.isWin = true;
            game.state.start('transicao');
        }, 6500);
    }

    gameManager.addState('win', WinState);

})();