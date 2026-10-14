import { QUIZ_QUESTIONS } from '../utils/constants.js';

export default class QuizScene extends Phaser.Scene {
    constructor() {
        super('QuizScene');
    }

    create(data) {
        const { width, height } = this.scale;
        this.callback = data.callback;
        this.answerHandled = false;

        // Select random question
        const quiz = Phaser.Utils.Array.GetRandom(QUIZ_QUESTIONS);
        this.explanation = quiz.explanation;

        // Dim background
        const dimmer = this.add.rectangle(0, 0, width, height, 0x04151f, 0)
            .setOrigin(0)
            .setInteractive();
        this.tweens.add({ targets: dimmer, alpha: 0.82, duration: 350 });
        
        // Modal Panel Container
        this.container = this.add.container(width / 2, height + 300);

        const panel = this.add.rectangle(0, 0, 500, 370, 0x0c2b36).setOrigin(0.5);
        panel.setStrokeStyle(3, 0x8ee48f);
        
        const title = this.add.text(0, -120, 'HEALTHY QUIZ!', {
            fontSize: '32px',
            fill: '#8EE48F',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const questionTxt = this.add.text(0, -50, quiz.question, {
            fontSize: '24px',
            fill: '#F5FFF7',
            align: 'center',
            wordWrap: { width: 430 }
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

        this.input.keyboard.once('keyup-ESC', () => this.handleAnswer(false));
    }

    createOption(x, y, text, isCorrect) {
        const btn = this.add.rectangle(x, y, 390, 60, 0x173f47).setInteractive({ useHandCursor: true });
        btn.setStrokeStyle(2, 0x4f7778);
        const txt = this.add.text(x, y, text, { fontSize: '20px', fill: '#F5FFF7' }).setOrigin(0.5);

        this.container.add([btn, txt]);

        btn.on('pointerover', () => {
            btn.setFillStyle(0x245b5a);
            btn.setStrokeStyle(2, 0x8ee48f);
        });
        btn.on('pointerout', () => {
            btn.setFillStyle(0x173f47);
            btn.setStrokeStyle(2, 0x4f7778);
        });
        btn.on('pointerdown', () => {
            this.handleAnswer(isCorrect);
        });
    }

    handleAnswer(correct) {
        if (this.answerHandled) return;
        this.answerHandled = true;
        const { width, height } = this.scale;
        
        // Disable all inputs in container
        this.container.iterate(child => {
            if (child.setInteractive) child.disableInteractive();
        });

        const feedback = this.add.text(width / 2, height / 2 - 25, correct ? 'CORRECT! +50' : 'NOT THIS TIME', {
            fontSize: '44px',
            fill: correct ? '#4CAF50' : '#F44336',
            fontWeight: 'bold',
            stroke: '#FFF',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(100);

        feedback.setScale(0);

        const fact = this.add.text(width / 2, height / 2 + 45, this.explanation, {
            fontSize: '19px',
            fill: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 520 },
            backgroundColor: '#0b2632',
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5).setDepth(100).setAlpha(0);

        this.tweens.add({
            targets: feedback,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.tweens.add({
                    targets: [this.container, feedback, fact],
                        y: height + 500,
                        duration: 500,
                        ease: 'Power2.easeIn',
                        onComplete: () => {
                            this.callback(correct);
                            this.scene.stop();
                        }
                    });
                });
            },
            onStart: () => this.tweens.add({ targets: fact, alpha: 1, duration: 250 })
        });
    }
}
