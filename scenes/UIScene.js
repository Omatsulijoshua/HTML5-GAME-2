export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create(data) {
        this.add.rectangle(18, 16, 258, 92, 0x071d29, 0.84)
            .setOrigin(0)
            .setStrokeStyle(2, 0xffffff, 0.16);
        this.add.rectangle(this.scale.width - 168, 16, 150, 58, 0x071d29, 0.84)
            .setOrigin(0)
            .setStrokeStyle(2, 0xffffff, 0.16);

        this.scoreText = this.add.text(34, 29, `SCORE  ${data.score}`, {
            fontSize: '22px',
            fill: '#FFFFFF',
            fontWeight: 'bold'
        });
        this.healthText = this.add.text(34, 62, `ENERGY  ${'●'.repeat(data.health)}${'○'.repeat(3 - data.health)}`, {
            fontSize: '18px',
            fill: '#FF7B6B',
            fontWeight: 'bold'
        });
        this.fruitText = this.add.text(165, 63, `FRUIT  ${data.fruit}/${data.fruitTotal}`, {
            fontSize: '16px',
            fill: '#BCE8C2',
            fontWeight: 'bold'
        });
        this.levelText = this.add.text(this.scale.width - 93, 45, `LEVEL ${data.level}`, {
            fontSize: '20px',
            fill: '#FFD166',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.comboText = this.add.text(this.scale.width / 2, 32, '', {
            fontSize: '19px',
            fill: '#FFD166',
            fontWeight: 'bold',
            stroke: '#071D29',
            strokeThickness: 4
        }).setOrigin(0.5);

        const gameScene = this.scene.get('GameScene');
        const updateScore = (score) => this.scoreText.setText(`SCORE  ${score}`);
        const updateHealth = (health) => {
            const safeHealth = Phaser.Math.Clamp(health, 0, 3);
            this.healthText.setText(`ENERGY  ${'●'.repeat(safeHealth)}${'○'.repeat(3 - safeHealth)}`);
        };
        const updateFruit = (fruit, total) => this.fruitText.setText(`FRUIT  ${fruit}/${total}`);
        const updateCombo = (combo) => {
            this.comboText.setText(combo >= 2 ? `FRESH STREAK ×${combo}` : '');
            if (combo >= 2) {
                this.comboText.setScale(1.18);
                this.tweens.add({ targets: this.comboText, scale: 1, duration: 180 });
            }
        };

        gameScene.events.on('updateScore', updateScore);
        gameScene.events.on('updateHealth', updateHealth);
        gameScene.events.on('updateFruit', updateFruit);
        gameScene.events.on('updateCombo', updateCombo);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            gameScene.events.off('updateScore', updateScore);
            gameScene.events.off('updateHealth', updateHealth);
            gameScene.events.off('updateFruit', updateFruit);
            gameScene.events.off('updateCombo', updateCombo);
        });
    }
}
