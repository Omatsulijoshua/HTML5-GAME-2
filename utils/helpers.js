import { COLORS, ASSETS } from './constants.js';

export const generateGraphics = (scene) => {
    // 1. Player (Cute rounded character with shading)
    const playerGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    // Body
    playerGraphics.fillStyle(0xFFFFFF);
    playerGraphics.fillRoundedRect(0, 0, 32, 48, 8);
    // Shading
    playerGraphics.fillStyle(0xEEEEEE);
    playerGraphics.fillRect(0, 40, 32, 8);
    // Eyes
    playerGraphics.fillStyle(0x000000);
    playerGraphics.fillCircle(10, 15, 3);
    playerGraphics.fillCircle(22, 15, 3);
    // Blush
    playerGraphics.fillStyle(0xFFB6C1, 0.5);
    playerGraphics.fillCircle(6, 20, 4);
    playerGraphics.fillCircle(26, 20, 4);
    // Smile
    playerGraphics.lineStyle(2, 0x000000);
    playerGraphics.beginPath();
    playerGraphics.arc(16, 25, 8, 0, Math.PI, false);
    playerGraphics.strokePath();
    playerGraphics.generateTexture(ASSETS.PLAYER, 32, 48);

    // 2. Platform (Sleek modern style with gradient-like look)
    const platGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    platGraphics.fillStyle(COLORS.PRIMARY_DARK);
    platGraphics.fillRoundedRect(0, 0, 40, 40, 4);
    platGraphics.fillStyle(COLORS.PRIMARY);
    platGraphics.fillRoundedRect(2, 2, 36, 18, 2); // Top highlight
    platGraphics.generateTexture(ASSETS.PLATFORM, 40, 40);

    // 3. Apple
    const appleGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    appleGraphics.fillStyle(0xFF4444);
    appleGraphics.fillCircle(16, 18, 12);
    appleGraphics.fillStyle(0xFF6666); // Highlight
    appleGraphics.fillCircle(12, 14, 4);
    appleGraphics.fillStyle(0x44AA44);
    appleGraphics.fillRect(14, 2, 4, 8); // Stem
    appleGraphics.generateTexture(ASSETS.APPLE, 32, 32);

    // 4. Banana
    const bananaGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    bananaGraphics.fillStyle(0xFFDD44);
    bananaGraphics.beginPath();
    bananaGraphics.arc(16, 16, 12, 0.2, 3.0);
    bananaGraphics.fillPath();
    bananaGraphics.fillStyle(0x884422); // Tip
    bananaGraphics.fillCircle(26, 20, 2);
    bananaGraphics.generateTexture(ASSETS.BANANA, 32, 32);

    // 5. Carrot
    const carrotGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    carrotGraphics.fillStyle(0xFF8822);
    carrotGraphics.beginPath();
    carrotGraphics.moveTo(8, 8);
    carrotGraphics.lineTo(24, 8);
    carrotGraphics.lineTo(16, 28);
    carrotGraphics.closePath();
    carrotGraphics.fillPath();
    carrotGraphics.fillStyle(0x44AA44);
    carrotGraphics.fillRect(14, 2, 4, 6); // Green top
    carrotGraphics.generateTexture(ASSETS.CARROT, 32, 32);

    // 6. Burger (Unhealthy)
    const burgerGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    burgerGraphics.fillStyle(0xFFAA44); // Bun
    burgerGraphics.fillRoundedRect(4, 18, 24, 8, 4);
    burgerGraphics.fillRoundedRect(4, 4, 24, 8, 4);
    burgerGraphics.fillStyle(0x884422); // Meat
    burgerGraphics.fillRect(4, 12, 24, 6);
    burgerGraphics.fillStyle(0xFFFF00); // Cheese
    burgerGraphics.fillRect(4, 11, 24, 2);
    burgerGraphics.generateTexture(ASSETS.BURGER, 32, 32);

    // 7. Soda (Unhealthy)
    const sodaGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    sodaGraphics.fillStyle(0x4444FF);
    sodaGraphics.fillRect(8, 8, 16, 20);
    sodaGraphics.fillStyle(0xCCCCCC);
    sodaGraphics.fillRect(8, 4, 16, 4); // Cap
    sodaGraphics.fillStyle(0xFFFFFF, 0.3); // Reflection
    sodaGraphics.fillRect(10, 10, 4, 16);
    sodaGraphics.generateTexture(ASSETS.SODA, 32, 32);

    // 8. Exit Door
    const exitGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    exitGraphics.fillStyle(0x884422);
    exitGraphics.fillRect(0, 0, 40, 60);
    exitGraphics.lineStyle(2, 0x552211);
    exitGraphics.strokeRect(0, 0, 40, 60);
    exitGraphics.fillStyle(0xFFCC44);
    exitGraphics.fillCircle(30, 30, 4); // Knob
    exitGraphics.generateTexture(ASSETS.EXIT, 40, 60);

    // 9. Particle
    const partGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    partGraphics.fillStyle(0xFFFFFF);
    partGraphics.fillCircle(4, 4, 4);
    partGraphics.generateTexture(ASSETS.PARTICLE, 8, 8);

    // 10. Clouds
    const cloudGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    cloudGraphics.fillStyle(0xFFFFFF, 0.8);
    cloudGraphics.fillCircle(20, 20, 15);
    cloudGraphics.fillCircle(40, 20, 20);
    cloudGraphics.fillCircle(60, 20, 15);
    cloudGraphics.generateTexture('cloud', 80, 40);

    // 11. Mountains
    const mountGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    mountGraphics.fillStyle(0x6495ED, 0.5); // Cornflower Blue
    mountGraphics.beginPath();
    mountGraphics.moveTo(0, 100);
    mountGraphics.lineTo(100, 0);
    mountGraphics.lineTo(200, 100);
    mountGraphics.closePath();
    mountGraphics.fillPath();
    mountGraphics.generateTexture('mountain', 200, 100);
};
