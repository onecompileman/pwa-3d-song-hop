import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  sRGBEncoding,
  AmbientLight,
  DirectionalLight,
  Vector2,
  LinearToneMapping,
  Vector3,
  Clock,
  Color
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Player } from './game-objects/player';
import { constrain } from './utils/constrain';
import { MainPlatform } from './game-objects/main-platform';
import { getRandomInt, getRandomItem } from './utils/randomizer';
import { Props } from './game-objects/props';
import { map } from './utils/map';
import { ParticleSystem } from './game-objects/particle-system/particle-system';
import { BigProp } from './game-objects/big-prop';
import { Platform } from './game-objects/platform';
import { ScreenTypes } from '../enums/screen-types';
import { ScreenManager } from './screen-manager';
import { AudioManager } from './audio-manager';
import { SongService } from '../services/song-service';

export class GameManager {
  constructor() {
    this.playing = true;
  }

  start() {
    this.actualPlaying = false;
    this.score = 0;
    this.songEnded = false;
    this.songService = new SongService();
    if (this.scene) {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }
    this.initScreenManager();
    this.initColors();
    this.initRenderer();
    this.initClock();
    this.initScene();
    this.initCamera();
    this.initBloom();
    this.initLights();
    this.initPlayer();
    this.initMainPlatform();
    this.bindEvents();
    this.initProps();
    this.initPlatforms();
    this.initParticleSystems();
    this.initBigProps();
    this.initAudioManager();
    this.render();
  }

  initScreenManager() {
    this.screenManager = new ScreenManager();
    this.screenManager.screens.songList.onPlaySongCallback = (path, song) => {
      this.song = song;
      this.screenManager.screens.loading.musicTitle = song.name;
      this.screenManager.screens.loading.artist = song.artist;
      this.screenManager.showScreen(ScreenTypes.LOADING);
      this.loadSong(path);
      this.play();
      this.audioManager.song.onEnded = () => (this.songEnded = true);
    };
    this.screenManager.screens.inGameUI.onPauseCallback = () => {
      this.screenManager.screens.pause.score = this.score;
      this.screenManager.screens.pause.percentage = this.audioManager.getCompletionPercentage();

      this.pause();
      this.audioManager.pauseSong();
      this.screenManager.showScreen(ScreenTypes.PAUSE);
    };

    this.screenManager.screens.pause.onResumeCallback = () => {
      this.play();
      this.audioManager.playSong();
      this.screenManager.showScreen(ScreenTypes.IN_GAME_UI);
    };
    this.screenManager.showScreen(ScreenTypes.MAIN_MENU);
  }

  initAudioManager() {
    this.audioManager = new AudioManager(this.camera);
    this.song = null;
    this.lastFrequency = 0;
    this.currentFrequency = 0;
    this.frequencyThreshold = 20;
  }

  async loadSong(path) {
    this.frequencyData = await this.audioManager.loadSong(path);
    this.screenManager.showScreen(ScreenTypes.IN_GAME_UI);
  }

  play() {
    this.playing = true;
    this.actualPlaying = true;
  }

  pause() {
    this.actualPlaying = false;
    this.playing = false;
  }

  checkWin() {
    if (this.songEnded && !this.platforms.length) {
      this.screenManager.showScreen(ScreenTypes.CONGRATULATIONS);
      this.songService.setNewHighScoreSong(this.song.name, this.score);
      this.screenManager.screens.congratulations.onContinue = () => {
        this.screenManager.showScreen(ScreenTypes.MAIN_MENU);
      };
    }
  }

  gameover() {
    this.songService.setNewHighScoreSong(this.song.name, this.score);
    this.screenManager.showScreen(ScreenTypes.GAME_OVER);
    const gameOverScreen = this.screenManager.screens.gameOver;
    gameOverScreen.score = this.score;
    gameOverScreen.onMenuCallback = () => {
      this.screenManager.showScreen(ScreenTypes.MAIN_MENU);
    };
    gameOverScreen.onRetryCallback = () => {
      this.play();
      this.audioManager.resetPlay();
    };
    this.actualPlaying = false;
    this.score = 0;
    this.audioManager.pauseSong();
  }

  initBigProps() {
    this.bigProps = [];
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 8; c++) {
        const position = new Vector3(c * 34.8 - 123 + 2.5, r * 23.8 + -5, -220);
        const bigProp = new BigProp(position);
        this.scene.add(bigProp.object);
        this.bigProps.push(bigProp);
      }
    }
  }

  initPlatforms() {
    this.generationSpeedMin = 0.5;
    this.generationSpeedMax = 4;
    this.generateCounter =
      getRandomInt(this.generationSpeedMin, this.generationSpeedMax) * 60;
    this.speed = 0.09;
    this.complexity = 1;
    this.platforms = [];
  }

  generatePlatform() {
    const hasBeat =
      Math.abs(this.currentFrequency - this.lastFrequency) >=
      this.frequencyThreshold;
    // const hasBeat = this.currentFrequency >= 110;
    if (this.generateCounter <= 0 && hasBeat) {
      this.lastFrequency = this.currentFrequency;
      const position = new Vector3(getRandomInt(-1.9, 1.9), 0, -30);
      const velocity = new Vector3(0, 0, this.speed);
      const platform = new Platform(position, velocity);
      this.scene.add(platform.object);
      this.platforms.push(platform);
      this.generateCounter = this.generationSpeedMin * 60;
    }
    this.generateCounter--;
  }

  updateScreen() {
    this.screenManager.screens.inGameUI.percentage = this.audioManager.getCompletionPercentage();
    this.screenManager.screens.inGameUI.score = this.score;
  }

  updatePlatforms() {
    this.platforms = this.platforms.filter(platform => {
      platform.update();
      if (platform.isDead()) {
        this.scene.remove(platform.object);
      }

      return !platform.isDead();
    });
    this.generatePlatform();
  }

  initParticleSystems() {
    this.particleSystems = [];
    this.playerParticleSystem = new ParticleSystem(
      this.scene,
      1,
      0.02,
      100,
      65,
      this.player.position,
      new Color(0x4444ff),
      0.3,
      new Vector3(-0.002, -0.002, 0.005),
      new Vector3(0.002, 0.002, 0.009)
    );
    this.playerParticleSystem.start();
    this.particleSystems.push(this.playerParticleSystem);
  }

  createOnBounceParticleSystem() {
    const particleSystem = new ParticleSystem(
      this.scene,
      15,
      0.06,
      30,
      30,
      this.player.position,
      new Color(0x1111ee),
      0.15,
      new Vector3(-1, 0.1, -1),
      new Vector3(1, 0.3, 1),
      false
    );
    particleSystem.start();
    this.particleSystems.push(particleSystem);
  }

  initClock() {
    this.clock = new Clock();
  }

  initColors() {
    this.colors = [0x004fb3, 0xb3400f, 0x4fb300, 0xb3114f].map(
      c => new Color(c)
    );
    this.changeColorInterval = 1200;
    this.changeColorCounter = this.changeColorInterval;
    this.currentColor = this.colors[0].clone();
    this.colorIndexToLerp = 0;
  }

  updateColor() {
    if (this.changeColorCounter <= 0) {
      this.colorIndexToLerp =
        this.colorIndexToLerp === 3 ? 0 : this.colorIndexToLerp + 1;
      this.changeColorCounter = this.changeColorInterval;
    }
    this.changeColorCounter--;
    this.currentColor.lerp(this.colors[this.colorIndexToLerp], 0.1);
    this.renderer.setClearColor(this.currentColor.getHex(), 0.07);
    this.renderer.clearColor.s;
  }

  initRenderer() {
    this.canvas = document.querySelector('#mainCanvas');
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setClearColor(this.currentColor, 0.1);
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.setSize(constrain(innerWidth, null, 550), innerHeight);
    this.renderer.gammaFactor = 2.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = LinearToneMapping;
  }

  initScene() {
    this.scene = new Scene();
  }

  initProps() {
    this.props = [];
    this.propGenerationMax = 72;
    this.propGenerationCounter = this.propGenerationMax;
  }

  generateProps() {
    if (this.propGenerationCounter <= 0) {
      this.createProps(15);
      this.propGenerationCounter = this.propGenerationMax;
    }

    this.propGenerationCounter--;
  }

  createProps(count) {
    for (let i = 0; i < count; i++) {
      const position = new Vector3(
        getRandomInt(-3, 3),
        getRandomInt(1.5, 5),
        getRandomInt(-40, -30)
      );
      const prop = new Props(position, getRandomItem(['box']));
      this.scene.add(prop.object);
      this.props.push(prop);
    }
  }

  initBloom() {
    const params = {
      exposure: 0.5,
      bloomStrength: 1,
      bloomThreshold: 0,
      bloomRadius: 0
    };

    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = params.bloomThreshold;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      400
    );
    this.camera.position.z = 3.8;
    this.camera.position.y = 2.6;
    this.camera.rotation.x = -Math.PI * 0.05;
    this.scene.add(this.camera);
  }

  initLights() {
    this.ambientLight = new AmbientLight(0xf0f0f0, 0.4);
    this.directionalLight = new DirectionalLight(0xf9f9f9, 0.6);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight).add(this.ambientLight);
  }

  initMainPlatform() {
    this.mainPlatform = new MainPlatform();
    this.scene.add(this.mainPlatform.object);
  }

  initPlayer() {
    this.player = new Player();
    this.scene.add(this.player.object);
  }

  bindEvents() {
    addEventListener('resize', () => this.onResize());
    this.canvas.addEventListener('mousemove', event => this.onMouseMove(event));
    this.canvas.addEventListener('touchmove', event => this.onMouseMove(event));
  }

  onMouseMove(event) {
    // console.log(event);
    if (event.touches) {
      const toFollowX = map(
        event.touches[0].clientX,
        0,
        this.canvas.clientWidth,
        -1.9,
        1.9
      );
      this.player.follow.x = toFollowX;
    } else {
      const toFollowX = map(
        event.offsetX,
        0,
        this.canvas.clientWidth,
        -1.9,
        1.9
      );
      this.player.follow.x = toFollowX;
    }
  }

  onResize() {
    this.renderer.setSize(constrain(innerWidth, null, 550), innerHeight);
    this.composer.setSize(constrain(innerWidth, null, 550), innerHeight);
    const canvas = this.renderer.domElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  updateParticleSystems() {
    this.particleSystems = this.particleSystems.filter(particleSystem => {
      particleSystem.update();
      if (particleSystem.isDead()) {
        particleSystem.stop();
      }
      return !particleSystem.isDead();
    });
  }

  updateProps() {
    this.props = this.props.filter(prop => {
      prop.update();
      if (prop.isDead()) {
        this.scene.remove(prop.object);
      }
      return !prop.isDead();
    });
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    if (this.playing) {
      if (this.actualPlaying) {
        this.updateScreen();
        this.checkWin();
        this.currentFrequency = this.audioManager.getAnalyserAverageFrequency();
      }

      this.mainPlatform.update();
      this.updateProps();
      this.updatePlatforms();
      this.updateParticleSystems();
      this.updateBigProps();
      this.updateColor();
      this.updatePlayer();
      this.generateProps();
      this.updateAudio();
      this.composer.render();
    }
    // this.renderer.render(this.scene, this.camera);
  }

  updateBigProps() {
    this.bigProps.forEach(bigProp => bigProp.update());
  }

  updateAudio() {
    if (this.frequencyData) {
      this.audioManager.updateAnalyser();
      // console.log(this.frequencyData);
    }
  }

  updatePlayer() {
    this.player.update();
    if (this.platforms.length && this.actualPlaying) {
      const firstPlatform = this.platforms[0];
      if (firstPlatform.object.position.z >= -0.45 && !firstPlatform.bounced) {
        firstPlatform.bounced = true;
        this.player.goDown();
        this.player.onDownListener = () => {
          if (this.player.bBox.intersectsBox(firstPlatform.bBox)) {
            this.createOnBounceParticleSystem();
            this.score += 10;
          } else {
            this.gameover();
          }
        };
      }
    }

    this.playerParticleSystem.setPosition(this.player.position.clone());
  }
}
