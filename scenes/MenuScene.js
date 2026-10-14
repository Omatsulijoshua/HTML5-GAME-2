import {
    getSaveData,
    notifyGameReady,
    startNewRun
} from '../utils/youtubePlayables.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.scale;
        const savedGame = getSaveData();
        const canContinue = !savedGame.completed && (savedGame.currentLevel > 0 || savedGame.score > 0);

        this.add.image(width / 2, height / 2, 'garden-bg')
            .setDisplaySize(width, height)
            .setAlpha(0.72);
        this.add.rectangle(0, 0, width, height, 0x071d29, 0.5).setOrigin(0);

        ['apple', 'banana', 'carrot'].forEach((key, index) => {
            const item = this.add.image(84 + index * 74, 70 + (index % 2) * 18, key)
                .setDisplaySize(54, 54)
                .setAlpha(0.9);
            this.tweens.add({
                targets: item,
                y: item.y - 10,
                angle: index % 2 ? 4 : -4,
                duration: 1400 + index * 180,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        const panel = this.add.rectangle(55, 100, 455, 430, 0x0b2632, 0.88).setOrigin(0);
        panel.setStrokeStyle(2, 0x8bdc8f, 0.45);

        this.add.text(88, 132, 'HEALTHY EATING', {
            fontSize: '47px',
            fontWeight: '900',
            fill: '#f6fff7',
            fontFamily: 'Arial Black, Arial',
            stroke: '#08202a',
            strokeThickness: 7
        });
        this.add.text(88, 187, 'MISSION', {
            fontSize: '47px',
            fontWeight: '900',
            fill: '#8ee48f',
            fontFamily: 'Arial Black, Arial',
            stroke: '#08202a',
            strokeThickness: 7
        });
        this.add.text(91, 252, 'Collect smart. Move fast. Feel great.', {
            fontSize: '19px',
            fill: '#d5e9e2'
        });
        this.add.text(91, 292, '5 LEVELS  •  QUICK QUIZZES  •  HIGH SCORES', {
            fontSize: '13px',
            fontWeight: 'bold',
            fill: '#ffd166'
        });

        const startY = canContinue ? 356 : 380;
        const button = this.createButton(
            91,
            startY,
            365,
            68,
            canContinue ? `CONTINUE · LEVEL ${savedGame.currentLevel + 1}` : 'START MISSION',
            0x55b96a
        );
        button.on('pointerdown', async () => {
            button.disableInteractive();
            const run = canContinue ? savedGame : await startNewRun();
            this.startGame(run);
        });

        if (canContinue) {
            const newGame = this.add.text(273, 444, 'Start a new mission', {
                fontSize: '17px',
                fill: '#d7e8e2'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            newGame.on('pointerover', () => newGame.setColor('#ffffff'));
            newGame.on('pointerout', () => newGame.setColor('#d7e8e2'));
            newGame.on('pointerdown', async () => {
                newGame.disableInteractive();
                this.startGame(await startNewRun());
            });
        }

        if (savedGame.bestScore > 0) {
            this.add.text(91, 490, `PERSONAL BEST  ${savedGame.bestScore}`, {
                fontSize: '16px',
                fontWeight: 'bold',
                fill: '#ffd166'
            });
        }

        const hero = this.add.image(657, 330, 'player').setDisplaySize(245, 368);
        this.tweens.add({
            targets: hero,
            y: 320,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.rectangle(width / 2, height - 27, width, 54, 0x071923, 0.9);
        this.add.text(width / 2, height - 27, 'MOVE  ← → / A D     •     JUMP  ↑ / W     •     TOUCH CONTROLS INCLUDED', {
            fontSize: '14px',
            fontWeight: 'bold',
            fill: '#c9ded7'
        }).setOrigin(0.5);

        this.game.events.once('postrender', notifyGameReady);
    }

    createButton(x, y, width, height, label, color) {
        const button = this.add.rectangle(x, y, width, height, color)
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });
        button.setStrokeStyle(2, 0xffffff, 0.3);
        const text = this.add.text(x + width / 2, y + height / 2, label, {
            fontSize: '23px',
            fontWeight: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setFillStyle(0x69ca79);
            this.tweens.add({ targets: [button, text], scale: 1.025, duration: 100 });
        });
        button.on('pointerout', () => {
            button.setFillStyle(color);
            this.tweens.add({ targets: [button, text], scale: 1, duration: 100 });
        });
        return button;
    }

    startGame(run) {
        this.scene.start('GameScene', {
            level: run.currentLevel,
            score: run.score,
            health: run.health
        });
    }
}
