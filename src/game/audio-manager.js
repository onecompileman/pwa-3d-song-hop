import { AudioLoader, AudioListener, Audio, AudioAnalyser } from 'three';

export class AudioManager {
  constructor(camera) {
    this.camera = camera;
    this.loader = new AudioLoader();
    this.listener = new AudioListener();
    this.camera.add(this.listener);
    this.song = new Audio(this.listener);
    this.songStartTime = 0;
    this.songDuration = 0;
  }

  loadSong(path) {
    if (this.song.isPlaying) {
      this.song.stop();
    }
    return new Promise((resolve, reject) => {
      this.loader.load(path, buffer => {
        this.song.setBuffer(buffer);
        this.song.setLoop(false);
        this.song.setVolume(0.5);
        this.song.play();
        this.songStartTime = this.song.context.currentTime;
        this.songDuration = buffer.duration;
        this.songAnalyser = new AudioAnalyser(this.song, 32);
        resolve(this.songAnalyser.data);
      });
    });
  }

  getCompletionPercentage() {
    const currentTime = this.song.context.currentTime - this.songStartTime;
    return Math.round((currentTime / this.songDuration) * 100);
  }

  pauseSong() {
    this.song.pause();
  }

  playSong() {
    this.song.play();
  }

  resetPlay() {
    this.song.stop().play();
    this.songStartTime = this.song.context.currentTime;
  }

  updateAnalyser() {
    if (this.songAnalyser) {
      this.songAnalyser.getFrequencyData();
    }
  }

  getAnalyserAverageFrequency() {
    return this.songAnalyser ? this.songAnalyser.getAverageFrequency() : 0;
  }
}
