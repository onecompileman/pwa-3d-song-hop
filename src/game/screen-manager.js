import { ScreenTypes } from '../enums/screen-types';

export class ScreenManager {
  constructor() {
    this.screens = {
      about: document.querySelector('about-screen'),
      gameOver: document.querySelector('game-over'),
      howToPlay: document.querySelector('how-to-play'),
      inGameUI: document.querySelector('in-game-ui'),
      mainMenu: document.querySelector('main-menu'),
      pause: document.querySelector('pause-screen'),
      songList: document.querySelector('song-list'),
      loading: document.querySelector('loading-screen')
    };
    this.bindEvents();
  }

  bindEvents() {
    this.screens.about.onCloseCallback = () => {
      this.showScreen(ScreenTypes.MAIN_MENU);
    };

    this.screens.gameOver.onMenuCallback = () => {
      this.showScreen(ScreenTypes.MAIN_MENU);
    };

    this.screens.howToPlay.onCloseCallback = () => {
      this.showScreen(ScreenTypes.MAIN_MENU);
    };

    this.screens.mainMenu.onPlayCallback = () => {
      this.showScreen(ScreenTypes.SONG_LIST);
    };

    this.screens.mainMenu.onHowToPlayCallback = () => {
      this.showScreen(ScreenTypes.HOW_TO_PLAY);
    };

    this.screens.mainMenu.onAboutCallback = () => {
      this.showScreen(ScreenTypes.ABOUT);
    };

    this.screens.pause.onMenuCallback = () => {
      this.showScreen(ScreenTypes.MAIN_MENU);
    };

    this.screens.songList.onCloseCallback = () => {
      this.showScreen(ScreenTypes.MAIN_MENU);
    };
  }

  hideAllScreen() {
    Object.keys(this.screens).forEach(screenName =>
      this.hideScreen(screenName)
    );
  }

  showScreen(screenName) {
    this.hideAllScreen();
    this.screens[screenName].style.display = 'block';
  }

  hideScreen(screenName) {
    this.screens[screenName].style.display = 'none';
  }
}
