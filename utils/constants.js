export const COLORS = {
    PRIMARY: 0x4CAF50,
    PRIMARY_DARK: 0x388E3C,
    ACCENT: 0xFFC107,
    DANGER: 0xF44336,
    HEALTHY: 0x8BC34A,
    UNHEALTHY: 0xFF5722,
    SKY: 0x87CEEB,
    WHITE: 0xFFFFFF,
    BLACK: 0x000000
};

export const GRID_SIZE = 40;

export const LEVELS = [
    // Level 1: Basics
    [
        "....................",
        "....................",
        "....................",
        ".........8..........",
        ".......11111........",
        "....................",
        "....3.....4.....5...",
        "..111...111...111...",
        "....................",
        "2.........6.........",
        "11111111111111111111",
    ],
    // Level 2: Jumping and dodging
    [
        "....................",
        "................8...",
        "..............1111..",
        ".......5............",
        ".....1111...........",
        ".............7......",
        "..3.......1111......",
        "1111................",
        ".......4......6.....",
        "2.....111...11111...",
        "1111................",
    ],
    // Level 3: Precision
    [
        "........8...........",
        ".......111..........",
        "....................",
        "..5......3......4...",
        ".111....111....111..",
        "....................",
        ".....6.......7......",
        "...11111...11111....",
        "....................",
        "2...................",
        "11111....11111...111",
    ],
    // Level 4: The Climb
    [
        "................8...",
        "..............111...",
        ".........4..........",
        ".......111..........",
        "...5.......6........",
        "..111...............",
        ".......7......3.....",
        ".....1111...........",
        ".............6......",
        "2...................",
        "11111111111111111111",
    ],
    // Level 5: Final Challenge
    [
        ".........8..........",
        ".......11111........",
        "....................",
        "...3.....6.....4....",
        "..111...111...111...",
        "....................",
        "....7.........7.....",
        ".......11111........",
        "....................",
        "2....3...5...4......",
        "11111111111111111111",
    ]
];

export const ASSETS = {
    PLAYER: 'player',
    PLATFORM: 'platform',
    APPLE: 'apple',
    BANANA: 'banana',
    CARROT: 'carrot',
    BURGER: 'burger',
    SODA: 'soda',
    EXIT: 'exit',
    PARTICLE: 'particle'
};

export const TEXT = {
    HEALTHY: ["Great choice!", "Healthy!", "Yummy!", "Super food!", "Keep it up!"],
    UNHEALTHY: ["Too much sugar!", "Ouch!", "Try fruit!", "Energy crash!", "Not so healthy!"]
};

export const QUIZ_QUESTIONS = [
    {
        question: "Which one is healthier?",
        options: [
            { text: "A: Apple 🍎", isCorrect: true },
            { text: "B: Candy 🍭", isCorrect: false }
        ]
    },
    {
        question: "What is better for energy?",
        options: [
            { text: "A: Soda 🥤", isCorrect: false },
            { text: "B: Banana 🍌", isCorrect: true }
        ]
    },
    {
        question: "Choose the best snack:",
        options: [
            { text: "A: Carrot 🥕", isCorrect: true },
            { text: "B: Chips 🍟", isCorrect: false }
        ]
    },
    {
        question: "Which drink is best for you?",
        options: [
            { text: "A: Water 💧", isCorrect: true },
            { text: "B: Cola 🥤", isCorrect: false }
        ]
    }
];
