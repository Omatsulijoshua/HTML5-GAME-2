import { generateGraphics } from '../utils/helpers.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Hide standard loader after a bit
        this.load.on('complete', () => {
            const loader = document.getElementById('loading-screen');
            if (loader) loader.style.opacity = '0';
            setTimeout(() => {
                if (loader) loader.style.display = 'none';
                this.scene.start('MenuScene');
            }, 500);
        });

        // Generate our high-quality dynamic assets
        generateGraphics(this);

        // Define sounds (placeholders or silent)
        // In a real project, we would load .mp3/.wav here
        // this.load.audio('jump', 'assets/audio/jump.mp3');
    }
}
