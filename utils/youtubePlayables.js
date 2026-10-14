const SAVE_KEY = 'healthy-eating-mission-save';

const DEFAULT_SAVE = Object.freeze({
    version: 1,
    currentLevel: 0,
    score: 0,
    health: 3,
    bestScore: 0,
    completed: false
});

let saveState = { ...DEFAULT_SAVE };
let initializationPromise;
let saveQueue = Promise.resolve();
let firstFrameSent = false;
let gameReadySent = false;

const youtubeApi = () => globalThis.ytgame;
const inPlayables = () => Boolean(youtubeApi()?.IN_PLAYABLES_ENV);

const asSafeInteger = (value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const number = Number(value);
    return Number.isSafeInteger(number) ? Phaser.Math.Clamp(number, min, max) : fallback;
};

const normalizeSave = (candidate = {}) => ({
    version: 1,
    currentLevel: asSafeInteger(candidate.currentLevel, 0, 0, 4),
    score: asSafeInteger(candidate.score, 0),
    health: asSafeInteger(candidate.health, 3, 1, 3),
    bestScore: asSafeInteger(candidate.bestScore, 0),
    completed: Boolean(candidate.completed)
});

const reportSdkFailure = (label, error) => {
    console.warn(`[YouTube Playables] ${label}`, error);
    try {
        youtubeApi()?.health?.logWarning?.();
    } catch {
        // Logging is best-effort and must never interrupt the game.
    }
};

export const notifyFirstFrameReady = () => {
    if (firstFrameSent) return;
    try {
        youtubeApi()?.game?.firstFrameReady?.();
        firstFrameSent = true;
    } catch (error) {
        reportSdkFailure('Unable to send firstFrameReady.', error);
    }
};

export const notifyGameReady = () => {
    if (gameReadySent) return;
    try {
        youtubeApi()?.game?.gameReady?.();
        gameReadySent = true;
    } catch (error) {
        reportSdkFailure('Unable to send gameReady.', error);
    }
};

export const initializeSaveData = async () => {
    if (initializationPromise) return initializationPromise;

    initializationPromise = (async () => {
        try {
            const raw = inPlayables()
                ? await youtubeApi().game.loadData()
                : globalThis.localStorage?.getItem(SAVE_KEY);

            if (raw) saveState = normalizeSave(JSON.parse(raw));
        } catch (error) {
            reportSdkFailure('Save data could not be loaded; starting with safe defaults.', error);
            saveState = { ...DEFAULT_SAVE };
        }
        return { ...saveState };
    })();

    return initializationPromise;
};

export const getSaveData = () => ({ ...saveState });

export const updateRunState = (progress) => {
    saveState = normalizeSave({ ...saveState, ...progress });
    return { ...saveState };
};

export const saveProgress = (progress = {}) => {
    updateRunState(progress);
    const snapshot = { ...saveState };
    const serialized = JSON.stringify(snapshot);

    saveQueue = saveQueue
        .catch(() => undefined)
        .then(async () => {
            try {
                if (inPlayables()) {
                    await youtubeApi().game.saveData(serialized);
                } else {
                    globalThis.localStorage?.setItem(SAVE_KEY, serialized);
                }
            } catch (error) {
                reportSdkFailure('Progress could not be saved.', error);
            }
        });

    return saveQueue.then(() => ({ ...snapshot }));
};

export const startNewRun = () => saveProgress({
    currentLevel: 0,
    score: 0,
    health: 3,
    completed: false
});

export const finishRun = (score) => saveProgress({
    currentLevel: 0,
    score: 0,
    health: 3,
    bestScore: Math.max(saveState.bestScore, score),
    completed: true
});

export const sendScore = async (score) => {
    if (!inPlayables() || !youtubeApi()?.engagement?.sendScore) return;
    try {
        await youtubeApi().engagement.sendScore({ value: score });
    } catch (error) {
        reportSdkFailure('Score could not be submitted.', error);
    }
};

export const configureSystemIntegration = (game) => {
    const system = youtubeApi()?.system;
    if (!system) return;

    const applyAudioSetting = (enabled) => {
        game.sound.mute = !enabled;
    };

    try {
        applyAudioSetting(system.isAudioEnabled());
        system.onAudioEnabledChange(applyAudioSetting);
    } catch (error) {
        reportSdkFailure('Audio-state integration failed.', error);
    }

    let pausedSceneKeys = [];

    system.onPause(() => {
        document.documentElement.classList.add('yt-game-paused');
        pausedSceneKeys = game.scene.getScenes(true).map((scene) => scene.scene.key);
        pausedSceneKeys.forEach((key) => game.scene.pause(key));
        game.loop.sleep();
        void saveProgress();
    });

    system.onResume(() => {
        document.documentElement.classList.remove('yt-game-paused');
        game.loop.wake();
        pausedSceneKeys.forEach((key) => game.scene.resume(key));
        pausedSceneKeys = [];
    });
};
