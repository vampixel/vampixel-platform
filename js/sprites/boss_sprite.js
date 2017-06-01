/**
 * @author Paulo Matos
 */
(function () {
    'use strict';

    var Boss = function () {
        this.sprite = null; 

        this.imageName = 'boss_image';
        this.imageUrl = 'assets/img/padre-padre-vermelho2-64px.png';
        this.imageBullet = 'crucifixo_image';
        this.imageBulletUrl = 'assets/img/crucifixo2.png';
        this.initialPositionX = 600;
        this.initialPositionY = 500;
        this.width = 100;
        this.height = 100;
        this.gravity = 750;
        this.velocity = 5;
        this.jumpHeight = -450;
        this.stateContext = null;
        this.isGoing = 'left';

        // bullets
        this.bullets;
        this.bulletTime = 0;
        this.bullet;

        // state (normal or demon)
        this.state = 'normal';
    }

    Boss.prototype.preload = function () {
        this.game.load.spritesheet(this.imageName, this.imageUrl, 64, 64);
        this.game.load.image(this.imageBullet, this.imageBulletUrl);
    }
    
    Boss.prototype.setup = function (stateContext) {   
        var self = this;
        this.sprite = this.game.add.sprite(this.initialPositionX, this.initialPositionY, this.imageName);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.anchor.set(0.5);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.width = this.width; 
        this.sprite.height = this.height; 
        this.stateContext = stateContext;
        this.sprite.scale.x = -1;
        this.sprite.body.gravity.y = this.gravity;

        // create normal animation
        this.sprite.animations.add('normal', [0, 1, 2], 5, true);
        this.sprite.animations.add('normal_shooting', [3], 30, true);
        this.sprite.animations.play('normal');

        // create bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true; 
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 40; i++){
            var b = this.bullets.create(0, 0, this.imageBullet);
            b.name = 'imageBullet' + i;
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(this.resetBullet, this);
        }

        setInterval(function () {
            self.sprite.body.velocity.y = self.jumpHeight;
        }, 3000);

        setInterval(function () {
            self.sprite.animations.play('normal_shooting');
            self.fire();

            setTimeout(function () {
                if(self.state === 'normal') {
                    self.sprite.animations.play('normal');
                }
            }, 200)
        }, 1000);

    }

    Boss.prototype.move = function () {
        if(this.isGoing === 'left' && this.sprite.body.x > 450) {
            this.sprite.body.x -= 1;
        }
        else {
            this.isGoing = 'right';
        }

        if(this.isGoing === 'right' && this.sprite.body.x < 700) {
            this.sprite.body.x += 1;
        }
        else {
            this.isGoing = 'left';
        }
        
    }


     Boss.prototype.fire = function () {
        if (this.game.time.now > this.bulletTime) {
            this.bullet = this.bullets.getFirstExists(false);
            if (this.bullet) {
                this.bullet.reset(this.sprite.x, this.sprite.y);
                if (this.sprite.scale.x == 1) {
                    this.bullet.body.velocity.x = 300;
                    this.bulletTime = this.game.time.now + 150;
                } else {
                    this.bullet.body.velocity.x = -300;
                    this.bulletTime = this.game.time.now + 150;
                }
            }
        }
    }

    Boss.prototype.resetBullet = function(bullet) {
        bullet.kill();
    }
    
    // required
    gameManager.addSprite('boss', Boss);

})();
