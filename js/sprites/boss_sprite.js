/**
 * @author Paulo Matos
 */
(function () {
    'use strict';

    var Boss = function () {
        this.sprite = null; 

        this.imageName = 'boss_image';
        this.imageUrl = 'assets/img/padre-padre-vermelho2-64px.png';
        this.imageDemonName = 'boss_demon_image';
        this.imageDemonUrl = 'assets/img/DEMON-sprite-128px.png';
        
        this.imageBullet = 'crucifixo_image';
        this.imageBulletUrl = 'assets/img/crucifixo2.png';
        this.imageBulletFire = 'fire_image';
        this.imageBulletFireUrl = 'assets/img/fire_bullet.png';
        this.limitHPToTransform = 98;

        this.initialPositionX = 600;
        this.initialPositionY = 500;
        this.width = 100;
        this.height = 100;
        this.gravity = 750;
        this.velocity = 5;
        this.jumpHeight = -450;
        this.stateContext = null;
        this.isGoing = 'left';
        this.HP = 100;
        
        gameManager.globals.bossBulletCollision = true;

        // bullets
        this.bullets;
        this.bulletTime = 0;
        this.bullet;

        // state (normal or demon)
        this.state = 'normal';
    }

    Boss.prototype.preload = function () {
        this.game.load.spritesheet(this.imageName, this.imageUrl, 64, 64);
        this.game.load.spritesheet(this.imageDemonName, this.imageDemonUrl, 128, 128);
        this.game.load.image(this.imageBullet, this.imageBulletUrl);
        this.game.load.image(this.imageBulletFire, this.imageBulletFireUrl);
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
        this.currentImageBullet = this.imageBullet;

        // reset
        this.HP = 100;
        this.state = 'normal';
        this.sprite.body.width = 64;
        this.sprite.body.height = 100;
        this.jumpHeight = -450;

        // create normal animation
        this.sprite.animations.add('normal', [0, 1, 2], 5, true);
        this.sprite.animations.add('normal_shooting', [3], 30, true);
        this.sprite.animations.play('normal');

        // create demon animation
        this.sprite.animations.add('demon', [0, 1, 2, 3, 4], 5, true);
        

        // create bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.game.time.events.loop(Phaser.Timer.SECOND * 3, function () {
            self.sprite.body.velocity.y = self.jumpHeight;
        }, this);

        this.game.time.events.loop(Phaser.Timer.SECOND, function () {
            if(self.state === 'normal') {
                self.sprite.animations.play('normal_shooting');
            }

            self.fire();

            setTimeout(function () {
                if(self.state === 'normal') {
                    self.sprite.animations.play('normal');
                }
                else if(self.state === 'demon'){
                    self.sprite.animations.play('demon');
                }
            }, 200)
        }, this);

    }

    Boss.prototype.transform = function () {
        this.state = 'demon';
        this.sprite.body.velocity.y = -700;
        this.sprite.body.width = 128;
        this.sprite.body.height = 200;
        this.jumpHeight = -700;
        this.currentImageBullet = this.imageBulletFire;
        this.sprite.loadTexture(this.imageDemonName);
        this.sprite.animations.play('demon');
    }

    Boss.prototype.move = function () {
        
        if(this.state === 'normal') {
            var min = 450;
            var max = 700;
        }
        else if(this.state === 'demon') {
            var min = 450;
            var max = 650;
        }

        if(this.isGoing === 'left' && this.sprite.body.x > min) {
            this.sprite.body.x -= 1;
        }
        else {
            this.isGoing = 'right';
        }

        if(this.isGoing === 'right' && this.sprite.body.x < max) {
            this.sprite.body.x += 1;
        }
        else {
            this.isGoing = 'left';
        }
    }

    Boss.prototype.fire = function () {
        if (this.game.time.now > this.bulletTime) {
            this.bullet = this.bullets.create(0, 0, this.currentImageBullet);
            if (this.bullet) {

                if(this.state === 'normal') {
                    var y = this.sprite.y;
                }
                else if(this.state === 'demon') {
                    var y = this.sprite.y + 10;
                }

                this.bullet.reset(this.sprite.x, y);
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
