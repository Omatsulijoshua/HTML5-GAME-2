import { COLORS } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);
        
        // Add some floating healthy foods as decoration
        for(let i=0; i<10; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const items = ['apple', 'banana', 'carrot'];
            const item = this.add.image(x, y, items[Phaser.Math.Between(0, 2)]).setAlpha(0.2);
            this.tweens.add({
                targets: item,
                y: y - 50,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Title
        const title = this.add.text(width / 2, height / 3, 'HEALTHY EATING\nMISSION', {
            fontSize: '64px',
            fontWeight: 'bold',
            fill: '#4CAF50',
            align: 'center',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setStroke('#000', 8);

        // Subtitle
        this.add.text(width / 2, height / 3 + 100, 'Eat Green. Feel Great.', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Start Button
        const btnBg = this.add.rectangle(width / 2, height * 0.7, 240, 70, 0x4CAF50).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(width / 2, height * 0.7, 'START GAME', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        btnBg.on('pointerover', () => {
            btnBg.setFillStyle(0x66BB6A);
            this.tweens.add({ targets: [btnBg, btnText], scale: 1.1, duration: 100 });
        });

        btnBg.on('pointerout', () => {
            btnBg.setFillStyle(0x4CAF50);
            this.tweens.add({ targets: [btnBg, btnText], scale: 1.0, duration: 100 });
        });

        btnBg.on('pointerdown', () => {
            this.scene.start('GameScene', { level: 0, score: 0, health: 3 });
        });

        // Instructions
        this.add.text(width / 2, height - 40, 'Use ARROWS or WASD to Move | Jump to collect fruit!', {
            fontSize: '16px',
            fill: '#AAAAAA'
        }).setOrigin(0.5);
    }
}
