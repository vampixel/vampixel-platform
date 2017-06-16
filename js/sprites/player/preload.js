(function () {
    'use strict';

    var playerPreload = function () {
        //Load Imagens
        // Player
        this.game.load.spritesheet(this.imageName, this.imageUrl, 64, 64);
        // Player Dead
        this.game.load.spritesheet(this.imageDeadName, this.imageDeadUrl, 64, 64);
        // wolf
        this.game.load.spritesheet(this.imageWolfName, this.imageWolfUrl, 64, 64);
        //Player Jump
        this.game.load.spritesheet(this.imageJumpName, this.imageJumpUrl, 64, 64);
        //Player Bat Fly
        this.game.load.spritesheet(this.imageBatFlyName, this.imageBatFlyUrl, 64, 64);
        // Bullet Bat
        this.game.load.spritesheet(this.imageNameBatShot, this.imageUrlBatShot, 16, 16);
        // load
        this.game.load.spritesheet(this.imageChargerHud, this.imageUrlChargerHud, 64, 64);
        
        //Player blood
        this.game.load.image(this.imagePlayerBloodName, this.imageUrlPlayerBlood);
        
        // Lives
        this.game.load.image(this.imageNameLives, this.imageUrlLives);
        // hud
        this.game.load.image(this.imageSelectHud, this.imageUrlSelectHud);
        this.game.load.image(this.imageBatHud, this.imageUrlBatHud);
        this.game.load.image(this.imageCapHud, this.imageUrlCapHud);
        
        //Load Sounds
        this.game.load.audio(this.soundNameDead, this.soundUrlDead);
        this.game.load.audio(this.soundNameShot, this.soundUrlShot);
        this.game.load.audio(this.soundNameJump, this.soundUrlJump); 
        this.game.load.audio(this.soundNamePickupBlood, this.soundUrlPickupBlood);
        this.game.load.audio(this.soundNamePlayerDeath, this.soundUrlPlayerDeath);
        this.game.load.audio(this.soundNameModItens, this.soundUrlModItens);
        this.game.load.audio(this.soundNamePickupCapa, this.soundUrlPickupCapa);
    }

    gameManager.addModule('playerPreload', playerPreload);

})();
