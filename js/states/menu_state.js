(function () {
    'use strict'; 

    var MenuState = function() {
    };

    MenuState.prototype.preload = function() {
        this.onMenu = true;
        this.game.load.image('background', 'assets/img/menu.png');
        this.game.load.image('start', 'assets/img/start.png');
        this.game.load.image('chooseLevelButton', 'assets/img/chooseLevelButton.png');
        this.game.load.audio('environment', 'assets/sounds/environment.ogg');
        this.game.load.audio('clickSound', 'assets/sounds/click.ogg');
    }   
    
    MenuState.prototype.create = function() {
        
        this.game.add.tileSprite(0, 0, 800, 600, 'background');
        
        this.clickSound = this.game.add.audio('clickSound');
        
        this.onMenu = true;
        
        //var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 150, 'Vampixel', { fill: '#ffffff', align: 'center', fontSize: 80 });
        //text.anchor.set(0.5);

        var startButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 150, 'start', startButtonClicked, this);
        startButton.anchor.set(0.5);
        
        var chooseLevelButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 230, 'chooseLevelButton', chooseLevelButton, this);
        chooseLevelButton.anchor.set(0.5);

        function startButtonClicked() {
            this.clickSound.play();
            this.game.state.start('level1');
        }
        
        function chooseLevelButton() {
            this.clickSound.play();
            this.game.state.start('level'+ prompt("Digite a fase"));
        }
    }
    
    MenuState.prototype.update = function() {
    }  
    
    gameManager.addState('menu', MenuState);

})();