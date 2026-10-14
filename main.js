import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import QuizScene from './scenes/QuizScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import {
    configureSystemIntegration,
    initializeSaveData,
    notifyFirstFrameReady
} from './utils/youtubePlayables.js';

// The DOM loading screen is already present because this module loads at the
// end of <body>. Do not wait for a non-zero viewport: YouTube may initialize the
// game in a hidden, zero-sized WebView before revealing it.
notifyFirstFrameReady();
await initializeSaveData();

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false // Set to true to see physics bodies
        }
    },
    scene: [BootScene, MenuScene, GameScene, UIScene, QuizScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: false,
    antialias: true
};

const game = new Phaser.Game(config);

configureSystemIntegration(game);

let resizeFrame;
const resizeGame = () => {
    if (window.innerWidth <= 0 || window.innerHeight <= 0) return;
    const container = document.getElementById('game-container');
    container.style.width = `${window.innerWidth}px`;
    container.style.height = `${window.innerHeight}px`;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => game.scale.refresh());
};

window.addEventListener('resize', resizeGame);
resizeGame();
