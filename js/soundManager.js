const audioCtx = new AudioContext();

class SoundManager {
    constructor() {
        this.soundMap = new Map();
    }

    async storeSound(soundID, filePath) {
        // var sound = new Audio();
        // sound.src = filePath;

        // this.soundMap.set(soundID, sound);

        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        this.soundMap.set(soundID, audioBuffer);
    }

    async playSound(soundID) {
        //     var sound = this.soundMap.get(soundID);

        //     sound.load(); // reset playback to the beginning
        //     var playPromise = sound.play();

        //     if (playPromise !== undefined) {
        //         playPromise.then(_ => {
        //           // Audio playback started
        //         })
        //         .catch(error => {
        //           // Audio playback failed
        //         });
        //       }
        // }

        const track = await this.soundMap.get(soundID);

        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const trackSource = audioCtx.createBufferSource();
        trackSource.buffer = track;
        trackSource.connect(audioCtx.destination);

        trackSource.start();
    }
}

const soundManager = new SoundManager();

export { soundManager };