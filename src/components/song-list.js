import { SongService } from '../services/song-service';

const componentStyles = `
<style>
    .circle {
        height: 18px;
        width: 18px;
        border-radius: 100%;
        background-color: white;
    }

    .song-list {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: rgba(0,0,0,0.9);
        font-family: Arial;
        height: calc(100% - 20px);
        overflow: hidden;
    }

    .song-list-text {
        display: flex;
        align-items: center;
        color: white;
        font-size: 36px;
        justify-content: center;
    }

    .song-icon {
        width: 72px;
    }

    
    .close-container {
        text-align: right;
    }

    .close {
        cursor: pointer;
        color: white;
        font-weight: bold;
        font-size: 32px;
    }

    .song-list-container {
        height: calc(100% - 185px);
        background-color: rgba(0, 79, 179, 0.4);
        border-radius: 40px;
        margin-top: 20px;
    }

    .song-list-wrapper {
        height: 100%;
        overflow-y: scroll;
        padding: 5px;
        display: flex;
        flex-direction: column;
    }

    .song-list-wrapper::-webkit-scrollbar {
        width: 2px;
    }
    
    .song-list-wrapper::-webkit-scrollbar-track {
        background: none;
    }
    
    .song-list-wrapper::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.5);
    }

    .song-list-item {
        background-color: rgba(237, 237, 237, 0.9);
        display: flex;
        justify-content: space-between;
        border-radius: 40px;
        margin-bottom: 15px;
        height: 52px;
        animation: listAnimation 0.5s;
    }

    .song-description {
        padding: 5px;
        flex: 1;
    }

    .song-difficulty {
        font-weight: bolder;
    }

    .song-title {
        font-size: 18px;
        font-weight: bolder;
        color: #333;
    }

    .song-footer {
        margin-top: 5px;
        font-size: 14px;
    }

    @keyframes listAnimation {
        from { opacity: 0; transform: translateX(-100px); }
        to { opacity: 1; transform: translateX(0); }
    }
</style>
`;
export class SongList extends HTMLElement {
  constructor() {
    super();
    this.songService = new SongService();
    this.prop = {
      songLists: [],
      onPlaySongCallback: songPath => {},
      onCloseCallback: () => {}
    };
    this.root = this.attachShadow({ mode: 'open' });
    this.updateDom();
    this.updateSongs();
    this.bindEvents();
  }

  get onPlaySongCallback() {
    return this.prop.onPlaySongCallback;
  }

  get onCloseCallback() {
    return this.prop.onCloseCallback;
  }

  set onPlaySongCallback(onPlaySongCallback) {
    this.prop.onPlaySongCallback = onPlaySongCallback;
  }

  set onCloseCallback(onCloseCallback) {
    this.prop.onCloseCallback = onCloseCallback;
  }

  updateSongs() {
    const songListWrapper = this.root.querySelector('.song-list-wrapper');
    const songLists = this.songService.getSongsWithScore();
    songLists.forEach(song => {
      const songElement = document.createElement('div');
      songElement.className = 'song-list-item';
      songElement.innerHTML = `<img src="assets/images/cd.png" alt="CD" width="52">
                        <div class="song-description">
                            <span class="song-title">
                                ${song.name}
                            </span>
                            <div class="song-footer">
                                ${this.getSongDifficultyElement(
                                  song.difficulty
                                )}
                                |
                                <span class="last-record">
                                    <b>Record:</b> ${
                                      song.score > 0 ? song.score : 'None'
                                    }
                                </span>
                            </div>
                        </div>
                        <img src="assets/images/play.png" alt="Play" width="52">`;
      songElement.addEventListener('click', () => {
        this.onPlaySongCallback(`assets/songs/${song.file}`, song);
      });
      songListWrapper.appendChild(songElement);
    });
  }

  bindEvents() {
    this.root
      .querySelector('.close')
      .addEventListener('click', () => this.prop.onCloseCallback());
  }

  getSongDifficultyElement(difficulty) {
    switch (difficulty) {
      case 'Easy':
        return `<span class="song-difficulty" style="color: #149F5B;">${difficulty}</span>`;
      case 'Medium':
        return `<span class="song-difficulty" style="color: #DD6940;">${difficulty}</span>`;
      case 'Hard':
        return `<span class="song-difficulty" style="color: #DD5246;">${difficulty}</span>`;
    }
  }

  updateDom() {
    this.root.innerHTML = `
        ${componentStyles}
        <div class="song-list">
        <div class="close-container">
                <span class="close">
                    X
                </span>
            </div>
            <div style="text-align: center; margin-top: 40px;">
                <img class="song-icon" src="assets/images/music.png" alt="Music icon">
            </div>
            <div class="song-list-text">
                PICK A <b style="color:#FA0C84;">SONG</b>
            </div>
            <div class="song-list-container">
                <div class="song-list-wrapper">
                   
                </div>
            </div>
        </div>
        `;
  }

  static get observedAttributes() {
    return ['onPlaySongCallback', 'onCloseCallback'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onPlaySongCallback':
        this.onPlaySongCallback = newValue;
        break;
      case 'onCloseCallback':
        this.onCloseCallback = newValue;
        break;
    }
  }
}

customElements.define('song-list', SongList);
