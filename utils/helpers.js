import { ASSETS } from './constants.js';

export const generateGraphics = (scene) => {
    // Mossy stone platform tile.
    const platGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    platGraphics.fillStyle(0x173f47);
    platGraphics.fillRoundedRect(0, 4, 40, 36, 5);
    platGraphics.fillStyle(0x245b5a);
    platGraphics.fillRoundedRect(2, 7, 36, 30, 4);
    platGraphics.fillStyle(0x69c36d);
    platGraphics.fillRoundedRect(0, 0, 40, 12, 5);
    platGraphics.fillStyle(0xa9e66e);
    platGraphics.fillRoundedRect(3, 1, 34, 4, 3);
    platGraphics.lineStyle(1, 0x173f47, 0.6);
    platGraphics.lineBetween(20, 13, 20, 37);
    platGraphics.lineBetween(4, 25, 36, 25);
    platGraphics.generateTexture(ASSETS.PLATFORM, 40, 40);

    // Glowing garden gate.
    const exitGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    exitGraphics.fillStyle(0x102f3a);
    exitGraphics.fillRoundedRect(0, 0, 40, 60, 18);
    exitGraphics.fillStyle(0x2b6570);
    exitGraphics.fillRoundedRect(5, 5, 30, 52, 14);
    exitGraphics.lineStyle(3, 0xffd166, 0.9);
    exitGraphics.strokeRoundedRect(7, 7, 26, 48, 12);
    exitGraphics.fillStyle(0xffd166);
    exitGraphics.fillCircle(28, 31, 3);
    exitGraphics.generateTexture(ASSETS.EXIT, 40, 60);

    // Particle.
    const partGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    partGraphics.fillStyle(0xFFFFFF);
    partGraphics.fillCircle(4, 4, 4);
    partGraphics.generateTexture(ASSETS.PARTICLE, 8, 8);

    // Clouds.
    const cloudGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    cloudGraphics.fillStyle(0xFFFFFF, 0.8);
    cloudGraphics.fillCircle(20, 20, 15);
    cloudGraphics.fillCircle(40, 20, 20);
    cloudGraphics.fillCircle(60, 20, 15);
    cloudGraphics.generateTexture('cloud', 80, 40);

};
