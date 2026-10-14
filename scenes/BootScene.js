import { generateGraphics } from '../utils/helpers.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        const loadingStatus = document.getElementById('loading-status');

        this.load.on('progress', (progress) => {
            if (loadingStatus) loadingStatus.textContent = `Loading ${Math.round(progress * 100)}%`;
        });

        this.load.on('complete', () => {
            generateGraphics(this);
            this.createFoodTextures();
            const loader = document.getElementById('loading-screen');
            if (loader) loader.style.opacity = '0';
            this.time.delayedCall(500, () => {
                if (loader) loader.style.display = 'none';
                this.scene.start('MenuScene');
            });
        });

        this.load.image('garden-bg', './assets/images/garden-valley.png');
        this.load.image('player', './assets/images/hero.png');
        this.load.image('food-atlas', './assets/images/food-atlas.png');
    }

    createFoodTextures() {
        const source = this.textures.get('food-atlas').getSourceImage();
        const frameWidth = source.width / 5;
        const keys = ['apple', 'banana', 'carrot', 'burger', 'soda'];

        keys.forEach((key, index) => {
            const texture = this.textures.createCanvas(key, 256, 256);
            const context = texture.getContext();
            context.clearRect(0, 0, 256, 256);
            context.drawImage(
                source,
                index * frameWidth,
                0,
                frameWidth,
                source.height,
                0,
                0,
                256,
                256
            );
            texture.refresh();
        });
    }
}
