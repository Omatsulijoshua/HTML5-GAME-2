export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create(data) {
        this.scoreText = this.add.text(20, 20, `Score: ${data.score}`, {
            fontSize: '24px',
            fill: '#FFF',
            fontWeight: 'bold',
            stroke: '#000',
            strokeThickness: 2
        });

        this.healthText = this.add.text(20, 50, `Health: ${'❤️'.repeat(data.health)}`, {
            fontSize: '24px',
            fill: '#FFF'
        });

        this.levelText = this.add.text(this.scale.width - 20, 20, `Level: ${data.level}`, {
            fontSize: '24px',
            fill: '#FFF'
        }).setOrigin(1, 0);

        // Listen for events from GameScene
        const gameScene = this.scene.get('GameScene');
        gameScene.events.on('updateScore', (score) => {
            this.scoreText.setText(`Score: ${score}`);
        });

        gameScene.events.on('updateHealth', (health) => {
            this.healthText.setText(`Health: ${'❤️'.repeat(Math.max(0, health))}`);
        });
    }
}
