import { QUIZ_QUESTIONS } from '../utils/constants.js';

export default class QuizScene extends Phaser.Scene {
    constructor() {
        super('QuizScene');
    }

    create(data) {
        const { width, height } = this.scale;
        this.callback = data.callback;

        // Select random question
        const quiz = Phaser.Utils.Array.GetRandom(QUIZ_QUESTIONS);

        // Dim background
        this.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0)
            .setInteractive()
            .tween = this.tweens.add({
                targets: this.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0),
                alpha: 0.7,
                duration: 500
            });
        
        // Modal Panel Container
        this.container = this.add.container(width / 2, height + 300);

        const panel = this.add.rectangle(0, 0, 450, 350, 0xFFFFFF).setOrigin(0.5);
        panel.setStrokeStyle(4, 0x4CAF50);
        
        const title = this.add.text(0, -120, 'HEALTHY QUIZ!', {
            fontSize: '32px',
            fill: '#4CAF50',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const questionTxt = this.add.text(0, -50, quiz.question, {
            fontSize: '24px',
            fill: '#333',
            align: 'center',
            wordWrap: { width: 400 }
        }).setOrigin(0.5);

        this.container.add([panel, title, questionTxt]);

        // Options
        quiz.options.forEach((opt, index) => {
            const y = 50 + (index * 80);
            this.createOption(0, y, opt.text, opt.isCorrect);
        });

        // Entrance animation
        this.tweens.add({
            targets: this.container,
            y: height / 2,
            duration: 800,
            ease: 'Back.easeOut'
        });
    }

    createOption(x, y, text, isCorrect) {
        const btn = this.add.rectangle(x, y, 350, 60, 0xF5F5F5).setInteractive({ useHandCursor: true });
        btn.setStrokeStyle(2, 0xDDDDDD);
        const txt = this.add.text(x, y, text, { fontSize: '20px', fill: '#333' }).setOrigin(0.5);

        this.container.add([btn, txt]);

        btn.on('pointerover', () => {
            btn.setFillStyle(0xE8F5E9);
            btn.setStrokeStyle(2, 0x4CAF50);
        });
        btn.on('pointerout', () => {
            btn.setFillStyle(0xF5F5F5);
            btn.setStrokeStyle(2, 0xDDDDDD);
        });
        btn.on('pointerdown', () => {
            this.handleAnswer(isCorrect);
        });
    }

    handleAnswer(correct) {
        const { width, height } = this.scale;
        
        // Disable all inputs in container
        this.container.iterate(child => {
            if (child.setInteractive) child.disableInteractive();
        });

        const feedback = this.add.text(width / 2, height / 2, correct ? 'CORRECT! +50 pts' : 'WRONG! No bonus', {
            fontSize: '48px',
            fill: correct ? '#4CAF50' : '#F44336',
            fontWeight: 'bold',
            stroke: '#FFF',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(100);

        feedback.setScale(0);

        this.tweens.add({
            targets: feedback,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.tweens.add({
                        targets: [this.container, feedback],
                        y: height + 500,
                        duration: 500,
                        ease: 'Power2.easeIn',
                        onComplete: () => {
                            this.callback(correct);
                            this.scene.stop();
                        }
                    });
                });
            }
        });
    }
}
