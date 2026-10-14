import { LEVELS, ASSETS, GRID_SIZE, TEXT } from '../utils/constants.js';
import {
    finishRun,
    saveProgress,
    sendScore,
    updateRunState
} from '../utils/youtubePlayables.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.currentLevel = data.level ?? 0;
        this.score = data.score ?? 0;
        this.health = data.health ?? 3;
        this.healthyCount = 0;
        this.collectedHealthy = 0;
        this.combo = 0;
        this.isGameOver = false;
        this.isTransitioning = false;
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0).setScrollFactor(0);
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
        this.scene.stop('UIScene');
        this.scene.launch('UIScene', {
            score: this.score,
            health: this.health,
            level: this.currentLevel + 1,
            fruit: this.collectedHealthy,
            fruitTotal: this.healthyCount
        });
        updateRunState({
            currentLevel: this.currentLevel,
            score: this.score,
            health: this.health,
            completed: false
        });

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
        this.showLevelBanner();
    }

    createParallax() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'garden-bg')
            .setDisplaySize(width, height)
            .setScrollFactor(0)
            .setAlpha(0.88);
        this.add.rectangle(0, 0, width, height, 0x08202a, 0.12)
            .setOrigin(0)
            .setScrollFactor(0);

        this.clouds = this.add.group();
        for (let i = 0; i < 3; i++) {
            const cloud = this.add.image(Phaser.Math.Between(0, width), Phaser.Math.Between(50, 200), 'cloud')
                .setScrollFactor(0.4)
                .setAlpha(0.28)
                .setScale(Phaser.Math.FloatBetween(0.8, 1.4));
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
                        this.player = this.physics.add.sprite(posX, posY - 24, ASSETS.PLAYER);
                        this.player.setDisplaySize(38, 58);
                        this.playerBaseScaleX = this.player.scaleX;
                        this.playerBaseScaleY = this.player.scaleY;
                        this.player.setCollideWorldBounds(true);
                        this.player.setDragX(1000);
                        this.player.setDepth(5);
                        break;
                    case '3': // Apple
                    case '4': // Banana
                    case '5': // Carrot
                        const type = char === '3' ? ASSETS.APPLE : (char === '4' ? ASSETS.BANANA : ASSETS.CARROT);
                        const item = this.healthyItems.create(posX, posY, type);
                        item.setDisplaySize(40, 40);
                        item.body.setCircle(96, 32, 32);
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
                        uItem.setDisplaySize(char === '6' ? 50 : 42, 42);
                        uItem.body.setCircle(94, 34, 34);
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
            this.player.setScale(this.playerBaseScaleX, this.playerBaseScaleY);
            this.player.setAngle(0);
        }

        if ((this.cursors.up.isDown || this.wasd.W.isDown || this.doJump) && this.player.body.touching.down) {
            this.player.setVelocityY(jumpForce);
            this.doJump = false;
            this.animateSquash(0.8, 1.2); // Stretch when jumping
        }

        if (!this.player.body.touching.down) this.wasTouchingDown = false;

        if (this.player.y > this.scale.height - 78) {
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
            alpha: { from: 0.82, to: 1 },
            duration: 140,
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
        this.combo = Math.min(this.combo + 1, 5);
        const points = 10 + (this.combo - 1) * 5;
        this.score += points;
        this.collectedHealthy++;
        updateRunState({ score: this.score, health: this.health });
        
        this.events.emit('updateScore', this.score);
        this.events.emit('updateFruit', this.collectedHealthy, this.healthyCount);
        this.events.emit('updateCombo', this.combo);
        this.showFeedback(item.x, item.y, `${Phaser.Utils.Array.GetRandom(TEXT.HEALTHY)} +${points}`, 0x4CAF50);
        
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
        this.combo = 0;
        updateRunState({ score: this.score, health: Math.max(1, this.health) });
        this.events.emit('updateHealth', this.health);
        this.events.emit('updateCombo', this.combo);
        this.showFeedback(player.x, player.y, Phaser.Utils.Array.GetRandom(TEXT.UNHEALTHY), 0xF44336);
        this.cameras.main.shake(180, 0.008);

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

    async reachExit() {
        if (this.isTransitioning || this.collectedHealthy < this.healthyCount) return;
        this.isTransitioning = true;

        if (this.collectedHealthy >= this.healthyCount) {
            if (this.currentLevel < LEVELS.length - 1) {
                await saveProgress({
                    currentLevel: this.currentLevel + 1,
                    score: this.score,
                    health: this.health,
                    completed: false
                });
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
                    updateRunState({ score: this.score, health: this.health });
                    this.events.emit('updateScore', this.score);
                }
                this.physics.resume();
                this.scene.resume('GameScene');
            }
        });
    }

    createMobileControls() {
        const { width, height } = this.scale;
        const btnSize = 96;
        const margin = 90;

        const leftBtn = this.add.circle(margin, height - margin, btnSize/2, 0x0b2632, 0.76).setInteractive().setScrollFactor(0).setDepth(20);
        const rightBtn = this.add.circle(margin + btnSize + 20, height - margin, btnSize/2, 0x0b2632, 0.76).setInteractive().setScrollFactor(0).setDepth(20);
        const jumpBtn = this.add.circle(width - margin, height - margin, btnSize/2, 0x55b96a, 0.82).setInteractive().setScrollFactor(0).setDepth(20);

        [leftBtn, rightBtn, jumpBtn].forEach((button) => button.setStrokeStyle(3, 0xffffff, 0.4));

        this.add.text(margin, height - margin, '‹', { fontSize: '52px', fill: '#FFF', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(21);
        this.add.text(margin + btnSize + 20, height - margin, '›', { fontSize: '52px', fill: '#FFF', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(21);
        this.add.text(width - margin, height - margin, 'JUMP', { fontSize: '18px', fill: '#FFF', fontWeight: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(21);

        leftBtn.on('pointerdown', () => this.moveLeft = true);
        leftBtn.on('pointerup', () => this.moveLeft = false);
        leftBtn.on('pointerout', () => this.moveLeft = false);

        rightBtn.on('pointerdown', () => this.moveRight = true);
        rightBtn.on('pointerup', () => this.moveRight = false);
        rightBtn.on('pointerout', () => this.moveRight = false);

        jumpBtn.on('pointerdown', () => this.doJump = true);
    }

    showLevelBanner() {
        const banner = this.add.container(this.scale.width / 2, 115).setDepth(30).setScrollFactor(0);
        const bg = this.add.rectangle(0, 0, 310, 72, 0x0b2632, 0.9);
        bg.setStrokeStyle(2, 0x8ee48f, 0.7);
        const level = this.add.text(0, -10, `LEVEL ${this.currentLevel + 1}`, {
            fontSize: '25px', fontWeight: 'bold', fill: '#FFFFFF'
        }).setOrigin(0.5);
        const goal = this.add.text(0, 19, `Collect all ${this.healthyCount} healthy foods`, {
            fontSize: '15px', fill: '#BCE8C2'
        }).setOrigin(0.5);
        banner.add([bg, level, goal]);
        banner.setAlpha(0).setScale(0.9);
        this.tweens.add({
            targets: banner,
            alpha: 1,
            scale: 1,
            duration: 300,
            hold: 1100,
            yoyo: true,
            onComplete: () => banner.destroy()
        });
    }

    gameOver(victory) {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.physics.pause();
        this.player.setTint(victory ? 0x00FF00 : 0xFF0000);
        this.scene.stop('UIScene');

        void finishRun(this.score);
        void sendScore(this.score);

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { victory, score: this.score });
        });
    }
}
