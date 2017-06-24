(function () {
    'use strict';

    var playerConstructor = function () {
        //SpriteSheet Player
        this.imageName = 'player_image';
        this.imageUrl = 'assets/spritesheets/walk-idle-transform-64x64.png';
        
        //SrpriteSheet Player Dead
        this.imageDeadName = 'player_dead_image';
        this.imageDeadUrl = 'assets/spritesheets/Personagem-Morrendo-64x64.png';
        
        //SpriteSheet Player Jump
        this.imageJumpName = 'player_jump_image';
        this.imageJumpUrl = 'assets/spritesheets/JUMP3-64x64.png';
        
        //SpriteSheet Player Bat Fly
        this.imageBatFlyName = 'player_batfly_image';
        this.imageBatFlyUrl = 'assets/spritesheets/Morcego-64x64.png';

        //SpriteSheet Wolf
        this.imageWolfName = 'player_wolf_image';
        this.imageWolfUrl = 'assets/spritesheets/lobo-64x64-idle-run-jump-stop.png';
        
        //BatShot
        this.imageNameBatShot = 'batShot_image';
        this.imageUrlBatShot = 'assets/spritesheets/Sprites-morcego-bala-16x16.png';
        
        //Lives Blood
        this.imageNameLives = 'lives_image';
        this.imageUrlLives = 'assets/img/blood.png';
        
        //Player Blood
        this.imagePlayerBloodName = 'player_blood';
        this.imageUrlPlayerBlood = 'assets/img/red_square_10x10.png';
        
        //Select Item Hud
        this.imageSelectHud = 'select_hud_image';
        this.imageUrlSelectHud = 'assets/spritesheets/select-item.png';
        
        //Bat Hud
        this.imageBatHud = 'bat_hud_image';
        this.imageUrlBatHud = 'assets/spritesheets/bat_hud.png';
        
        //Capa Hud
        this.imageCapHud = 'capa_hud_image';
        this.imageUrlCapHud = 'assets/spritesheets/capa_hud.png';
        
        //Charger Hud
        this.imageChargerHud = 'charger_hud_image';
        this.imageUrlChargerHud = 'assets/spritesheets/timer-64x64.png';
        
        gameManager.globals.score = 0;
        gameManager.globals.scoreText = '';
        gameManager.globals.qtdeCapas = 0;
        gameManager.globals.haveCapas = false;
        gameManager.globals.isColliderRatos = true;
        gameManager.globals.isColliderSticks = true;
        gameManager.globals.isColliderEnemies = true;
        gameManager.globals.enemyScore = 1000;
        gameManager.globals.enemy01Type = 50;
        gameManager.globals.enemy02Type = 100;
                
        this.isWolf = false;
        this.currentAnimationName = '';
        this.normalSpeed = 150;
        this.wolfSpeed = 300;
        this.cloackDuration = 10000;
        this.normalGravity = 750;
        this.fallingGravity = 50;
        this.jumpVelocity = -450;
        this.isJumping = false;
        this.isDoubleJumping = false;
        this.initialPositionX = 50;
        this.initialPositionY = this.game.height - 500;
        this.isInvisible = false;
        this.isDead = false;
        this.bullets;
        this.bulletTime = 0;
        this.bullet;
        this.nextScore = gameManager.globals.enemyScore;
        this.applyEmitter = false;
        
        //Sound Dead
        this.soundNameDead = 'deadSound';
        this.soundUrlDead = 'assets/sounds/player/die1.ogg';
        this.soundDead = null;
        
        // Sound ShotBats
        this.soundNameShot = 'shotSound';
        this.soundUrlShot = 'assets/sounds/player/longRangeHitBat2.ogg';
        this.soundShot = null;
        
        // Sound Jump
        this.soundNameJump = 'jumpSound';
        this.soundUrlJump = 'assets/sounds/player/jump1.ogg';
        this.soundJump = null;
        
        // Sound Pickup
        this.soundNamePickupBlood = 'pickupSound';
        this.soundUrlPickupBlood = 'assets/sounds/player/sipBlood.ogg';
        this.soundPickup = null;
        
        // Sound Player Death
        this.soundNamePlayerDeath = 'playerDeathSound';
        this.soundUrlPlayerDeath = 'assets/sounds/player/playerDeath.ogg';
        
        // Modificando Itens
        this.soundNameModItens = 'soundModItens';
        this.soundUrlModItens = 'assets/sounds/ui/click.ogg';
        
        // Sounds Pickup Capa
        this.soundNamePickupCapa = 'pickupSoundCapa' 
        this.soundUrlPickupCapa = 'assets/sounds/player/coletandoCapa.ogg';
        
        this.stateContext = null;
        
    }

    gameManager.addModule('playerConstructor', playerConstructor);

})();
