class SoundManager {
    constructor() {
        this.audioCtx = new AudioContext();
        this.soundMap = new Map();
    }

    async storeSound(soundID, filePath) {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

        this.soundMap.set(soundID, audioBuffer);
    }

    async playSound(soundID) {
        // check if context is in suspended state (autoplay policy)
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        const sound = this.soundMap.get(soundID);

        const tempAudioBuffer = this.audioCtx.createBufferSource();
        tempAudioBuffer.buffer = sound;
        tempAudioBuffer.connect(this.audioCtx.destination);
        tempAudioBuffer.start();
    }
}

const soundManager = new SoundManager();

export { soundManager };