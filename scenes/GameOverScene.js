export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        const { width, height } = this.scale;
        const victory = data.victory;

        // Background
        this.add.rectangle(0, 0, width, height, victory ? 0x4CAF50 : 0xF44336).setOrigin(0);

        // Result Text
        this.add.text(width / 2, height / 3, victory ? 'MISSION COMPLETE!' : 'GAME OVER', {
            fontSize: '64px',
            fontWeight: 'bold',
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Score
        this.add.text(width / 2, height / 2, `Final Score: ${data.score}`, {
            fontSize: '32px',
            fill: '#FFF'
        }).setOrigin(0.5);

        // Subtext
        this.add.text(width / 2, height / 2 + 60, victory ? 'You are a healthy eating expert!' : 'Don\'t give up! Eat more fruit next time.', {
            fontSize: '20px',
            fill: '#FFF',
            wordWrap: { width: 600 },
            align: 'center'
        }).setOrigin(0.5);

        // Restart Button
        const btnBg = this.add.rectangle(width / 2, height * 0.75, 240, 70, 0xFFFFFF).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(width / 2, height * 0.75, 'PLAY AGAIN', {
            fontSize: '32px',
            fill: victory ? '#4CAF50' : '#F44336',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        btnBg.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        btnBg.on('pointerover', () => btnBg.setAlpha(0.8));
        btnBg.on('pointerout', () => btnBg.setAlpha(1));
    }
}
