import { getSaveData } from '../utils/youtubePlayables.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        const { width, height } = this.scale;
        const victory = data.victory;
        const bestScore = Math.max(getSaveData().bestScore, data.score);

        this.add.image(width / 2, height / 2, 'garden-bg').setDisplaySize(width, height).setAlpha(0.62);
        this.add.rectangle(0, 0, width, height, 0x061a24, 0.64).setOrigin(0);

        const panel = this.add.rectangle(width / 2, height / 2, 590, 440, 0x0b2632, 0.94);
        panel.setStrokeStyle(3, victory ? 0x8ee48f : 0xff8a78, 0.8);

        const badgeColor = victory ? 0x55b96a : 0xd95d50;
        this.add.circle(width / 2, 135, 44, badgeColor);
        this.add.text(width / 2, 135, victory ? '✓' : '↻', {
            fontSize: '48px', fontWeight: 'bold', fill: '#FFFFFF'
        }).setOrigin(0.5);

        this.add.text(width / 2, 212, victory ? 'MISSION COMPLETE' : 'MISSION PAUSED', {
            fontSize: '43px',
            fontWeight: 'bold',
            fill: '#FFFFFF',
            stroke: '#061A24',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(width / 2, 264,
            victory ? 'All five levels complete — every healthy food found.' : 'Recharge and give the garden another run.', {
                fontSize: '18px',
                fill: '#CFE6DE',
                align: 'center',
                wordWrap: { width: 500 }
            }).setOrigin(0.5);

        this.add.text(width / 2 - 120, 326, `SCORE\n${data.score}`, {
            fontSize: '18px', fill: '#BCE8C2', align: 'center', fontWeight: 'bold'
        }).setOrigin(0.5);
        this.add.text(width / 2 + 120, 326, `PERSONAL BEST\n${bestScore}`, {
            fontSize: '18px', fill: '#FFD166', align: 'center', fontWeight: 'bold'
        }).setOrigin(0.5);

        const button = this.add.rectangle(width / 2, 430, 310, 68, badgeColor)
            .setInteractive({ useHandCursor: true });
        button.setStrokeStyle(2, 0xffffff, 0.3);
        const buttonText = this.add.text(width / 2, 430, 'PLAY ANOTHER MISSION', {
            fontSize: '21px', fill: '#FFFFFF', fontWeight: 'bold'
        }).setOrigin(0.5);

        button.on('pointerover', () => this.tweens.add({ targets: [button, buttonText], scale: 1.04, duration: 100 }));
        button.on('pointerout', () => this.tweens.add({ targets: [button, buttonText], scale: 1, duration: 100 }));
        button.on('pointerdown', () => this.scene.start('MenuScene'));
    }
}
