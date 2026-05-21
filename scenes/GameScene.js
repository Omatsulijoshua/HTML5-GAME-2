import { LEVELS, ASSETS, GRID_SIZE, TEXT } from '../utils/constants.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.currentLevel = data.level || 0;
        this.score = data.score || 0;
        this.health = data.health || 3;
        this.healthyCount = 0;
        this.collectedHealthy = 0;
        this.isGameOver = false;
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0).setScrollFactor(0);
        
        // Parallax Layers
        this.createParallax();

        // Physics Groups
        this.platforms = this.physics.add.staticGroup();
        this.healthyItems = this.physics.add.group();
        this.unhealthyItems = this.physics.add.group();
        this.exitDoor = this.physics.add.staticGroup();

        // Particles
        this.createParticles();

        // Build Level
        this.buildLevel();

        // UI Scene
        this.scene.launch('UIScene', { score: this.score, health: this.health, level: this.currentLevel + 1 });

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');

        // Collisions
        this.physics.add.collider(this.player, this.platforms, this.onPlatformCollide, null, this);
        this.physics.add.overlap(this.player, this.healthyItems, this.collectHealthy, null, this);
        this.physics.add.overlap(this.player, this.unhealthyItems, this.hitUnhealthy, null, this);
        this.physics.add.overlap(this.player, this.exitDoor, this.reachExit, null, this);

        // Mobile Controls
        this.createMobileControls();

        // Camera
        this.cameras.main.setBounds(0, 0, width, height); 
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    createParallax() {
        const { width, height } = this.scale;
        
        // Mountains (slower)
        for (let i = 0; i < 3; i++) {
            this.add.image(i * 400, height - 100, 'mountain').setOrigin(0.5, 1).setScrollFactor(0.2).setAlpha(0.6);
        }

        // Clouds (faster)
        this.clouds = this.add.group();
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.image(Phaser.Math.Between(0, width), Phaser.Math.Between(50, 200), 'cloud')
                .setScrollFactor(0.4)
                .setAlpha(0.7);
            this.clouds.add(cloud);
        }
    }

    createParticles() {
        this.collectEmitter = this.add.particles(0, 0, ASSETS.PARTICLE, {
            speed: { min: 100, max: 200 },
            scale: { start: 1, end: 0 },
            lifespan: 600,
            gravityY: 200,
            emitting: false
        });

        this.hitEmitter = this.add.particles(0, 0, ASSETS.PARTICLE, {
            speed: { min: 150, max: 300 },
            scale: { start: 1.5, end: 0 },
            lifespan: 800,
            tint: 0xFF0000,
            emitting: false
        });
    }

    buildLevel() {
        const levelData = LEVELS[this.currentLevel];
        
        levelData.forEach((row, y) => {
            [...row].forEach((char, x) => {
                const posX = x * GRID_SIZE + GRID_SIZE/2;
                const posY = y * GRID_SIZE + GRID_SIZE/2;

                switch(char) {
                    case '1': // Platform
                        this.platforms.create(posX, posY, ASSETS.PLATFORM);
                        break;
                    case '2': // Player Start
                        this.player = this.physics.add.sprite(posX, posY, ASSETS.PLAYER);
                        this.player.setCollideWorldBounds(true);
                        this.player.setDragX(1000);
                        this.player.body.setGravityY(1000);
                        break;
                    case '3': // Apple
                    case '4': // Banana
                    case '5': // Carrot
                        const type = char === '3' ? ASSETS.APPLE : (char === '4' ? ASSETS.BANANA : ASSETS.CARROT);
                        const item = this.healthyItems.create(posX, posY, type);
                        item.body.allowGravity = false;
                        this.healthyCount++;
                        this.tweens.add({
                            targets: item,
                            y: posY - 8,
                            duration: 1500,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });
                        break;
                    case '6': // Burger
                    case '7': // Soda
                        const uType = char === '6' ? ASSETS.BURGER : ASSETS.SODA;
                        const uItem = this.unhealthyItems.create(posX, posY, uType);
                        uItem.body.allowGravity = false;
                        if (char === '6') {
                            this.tweens.add({
                                targets: uItem,
                                x: posX + 60,
                                duration: 2500,
                                yoyo: true,
                                repeat: -1,
                                ease: 'Sine.easeInOut'
                            });
                        }
                        break;
                    case '8': // Exit
                        this.door = this.exitDoor.create(posX, posY - 10, ASSETS.EXIT);
                        this.door.setAlpha(0.3);
                        break;
                }
            });
        });
    }

    update() {
        if (this.isGameOver) return;

        const moveSpeed = 300;
        const jumpForce = -600;

        if (this.cursors.left.isDown || this.wasd.A.isDown || this.moveLeft) {
            this.player.setVelocityX(-moveSpeed);
            this.player.setFlipX(true);
            this.animateWobble();
        } else if (this.cursors.right.isDown || this.wasd.D.isDown || this.moveRight) {
            this.player.setVelocityX(moveSpeed);
            this.player.setFlipX(false);
            this.animateWobble();
        } else {
            this.player.setScale(1); // Reset scale when idle
        }

        if ((this.cursors.up.isDown || this.wasd.W.isDown || this.doJump) && this.player.body.touching.down) {
            this.player.setVelocityY(jumpForce);
            this.doJump = false;
            this.animateSquash(0.8, 1.2); // Stretch when jumping
        }

        if (this.player.y > this.scale.height - 20) {
            this.gameOver(false);
        }

        // Slow cloud movement
        this.clouds.children.iterate(cloud => {
            cloud.x -= 0.2;
            if (cloud.x < -100) cloud.x = this.scale.width + 100;
        });
    }

    animateWobble() {
        if (!this.wobbleTween || !this.wobbleTween.isPlaying()) {
            this.wobbleTween = this.tweens.add({
                targets: this.player,
                angle: { from: -5, to: 5 },
                duration: 150,
                yoyo: true,
                repeat: 0
            });
        }
    }

    animateSquash(sx, sy) {
        this.tweens.add({
            targets: this.player,
            scaleX: sx,
            scaleY: sy,
            duration: 100,
            yoyo: true,
            ease: 'Cubic.easeOut'
        });
    }

    onPlatformCollide() {
        if (this.player.body.velocity.y === 0 && !this.wasTouchingDown) {
            this.animateSquash(1.2, 0.8); // Squash when landing
        }
        this.wasTouchingDown = this.player.body.touching.down;
    }

    collectHealthy(player, item) {
        this.collectEmitter.emitAt(item.x, item.y, 15);
        item.destroy();
        this.score += 10;
        this.collectedHealthy++;
        
        this.events.emit('updateScore', this.score);
        this.showFeedback(item.x, item.y, Phaser.Utils.Array.GetRandom(TEXT.HEALTHY), 0x4CAF50);
        
        if (this.collectedHealthy >= this.healthyCount) {
            this.door.setAlpha(1);
            this.showFeedback(this.door.x, this.door.y, "Exit Open!", 0xFFC107);
            this.tweens.add({
                targets: this.door,
                scale: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        if (this.collectedHealthy === 2 || this.collectedHealthy === 5) {
            this.showQuiz();
        }
    }

    hitUnhealthy(player, item) {
        if (this.player.alpha < 1) return;

        this.hitEmitter.emitAt(player.x, player.y, 20);
        this.health--;
        this.events.emit('updateHealth', this.health);
        this.showFeedback(player.x, player.y, Phaser.Utils.Array.GetRandom(TEXT.UNHEALTHY), 0xF44336);

        if (this.health <= 0) {
            this.gameOver(false);
        } else {
            this.tweens.add({
                targets: this.player,
                alpha: 0.5,
                duration: 100,
                yoyo: true,
                repeat: 5
            });
        }
    }

    reachExit() {
        if (this.collectedHealthy >= this.healthyCount) {
            if (this.currentLevel < LEVELS.length - 1) {
                this.scene.start('GameScene', { 
                    level: this.currentLevel + 1, 
                    score: this.score, 
                    health: this.health 
                });
            } else {
                this.gameOver(true);
            }
        }
    }

    showFeedback(x, y, text, color) {
        const fb = this.add.text(x, y - 20, text, {
            fontSize: '24px',
            fill: Phaser.Display.Color.IntegerToColor(color).rgba,
            fontWeight: 'bold',
            stroke: '#FFF',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(10);

        this.tweens.add({
            targets: fb,
            y: y - 100,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            onComplete: () => fb.destroy()
        });
    }

    showQuiz() {
        this.physics.pause();
        this.scene.pause();
        this.scene.launch('QuizScene', { 
            callback: (correct) => {
                if (correct) {
                    this.score += 50;
                    this.events.emit('updateScore', this.score);
                }
                this.physics.resume();
                this.scene.resume('GameScene');
            }
        });
    }

    createMobileControls() {
        const { width, height } = this.scale;
        const btnSize = 70;
        const margin = 100;

        const leftBtn = this.add.circle(margin, height - margin, btnSize/2, 0xFFFFFF, 0.4).setInteractive().setScrollFactor(0);
        const rightBtn = this.add.circle(margin + btnSize + 30, height - margin, btnSize/2, 0xFFFFFF, 0.4).setInteractive().setScrollFactor(0);
        const jumpBtn = this.add.circle(width - margin, height - margin, btnSize/2, 0xFFFFFF, 0.4).setInteractive().setScrollFactor(0);

        this.add.text(margin, height - margin, '<', { fontSize: '40px', fill: '#000' }).setOrigin(0.5).setScrollFactor(0);
        this.add.text(margin + btnSize + 30, height - margin, '>', { fontSize: '40px', fill: '#000' }).setOrigin(0.5).setScrollFactor(0);
        this.add.text(width - margin, height - margin, '^', { fontSize: '40px', fill: '#000' }).setOrigin(0.5).setScrollFactor(0);

        leftBtn.on('pointerdown', () => this.moveLeft = true);
        leftBtn.on('pointerup', () => this.moveLeft = false);
        leftBtn.on('pointerout', () => this.moveLeft = false);

        rightBtn.on('pointerdown', () => this.moveRight = true);
        rightBtn.on('pointerup', () => this.moveRight = false);
        rightBtn.on('pointerout', () => this.moveRight = false);

        jumpBtn.on('pointerdown', () => this.doJump = true);
    }

    gameOver(victory) {
        this.isGameOver = true;
        this.physics.pause();
        this.player.setTint(victory ? 0x00FF00 : 0xFF0000);
        
        setTimeout(() => {
            this.scene.start('GameOverScene', { victory, score: this.score });
        }, 1000);
    }
}
