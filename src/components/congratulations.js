const componentStyles = `
<style>
  .congrats {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-family: Arial;
    background-color: rgba(0,0,0,0.5);
    text-shadow: 0 0 3px rgba(0,0,0,0.6);
  }

  .music-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

    .music-title {
    color: #ddd;
    font-size: 26px;
    margin-top: 25px;
  }

  .score {
    font-size: 68px;
    margin-top: 30px;
    color: white;
  }
    
  .score-label {
    font-size: 20px;
    text-transform: uppercase;
    color: white;
    margin-bottom: 20px;
  }

 

  .circle-text {
    color: white;
    margin-right: 8px;
  }


  .artist {
    color: #ddd;
    font-size: 18px;
    margin-top: 8px;
  }

  .circle-container {
    display: flex;
    align-items: center;
    font-size: 24px;
  }

  .circle {
    height: 24px;
    width: 24px;
    border-radius: 100%;
    background-color: white;
    }

  .continue-button {
    height: 36px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    margin-top: 20px;
    letter-spacing: 1.5px;
    background-color:#FA0C84;
  }

  .action-container {
      width: 80%;
      min-width: 250px;
      max-width: 350px;
      bottom: 35px;
      position: absolute;
  }

</style>
`;

export class Congratulations extends HTMLElement {
  constructor() {
    super();
    this.prop = {
      onContinueCallback: () => {},
      score: 0,
      musicTitle: '',
      artist: ''
    };

    this.root = this.attachShadow({ mode: 'open' });
    this.updateDom();
    this.bindEvents();
  }

  get score() {
    return this.prop.score;
  }

  get musicTitle() {
    return this.prop.musicTitle;
  }

  get artist() {
    return this.prop.artist;
  }

  get onContinueCallback() {
    return this.prop.onContinueCallback;
  }

  set score(score) {
    this.prop.score = score;
    this.root.querySelector('#score').innerHTML = score;
  }

  set musicTitle(musicTitle) {
    this.prop.musicTitle = musicTitle;
    this.root.querySelector('#musicTitle').innerHTML = musicTitle;
  }

  set artist(artist) {
    this.prop.artist = artist;
    this.root.querySelector('#artist').innerHTML = artist;
  }

  set onContinueCallback(onContinueCallback) {
    this.prop.onContinueCallback = onContinueCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#continue')
      .addEventListener('click', () => this.prop.onContinueCallback());
  }

  updateDom() {
    /*html*/
    this.root.innerHTML = `
            ${componentStyles}
        <div class="congrats">
             <div class="music-container">
                <span class="music-title" id="musicTitle">
                    Memories
                </span>
                <span class="artist" id="artist">
                </span>
            </div>
            <div class="score" id="scoreText">
                0
            </div>
            <div class="score-label">
                Score
            </div>
            <div class="circle-container">
                <span class="circle-text" id="circleText">
                    +0
                </span>
                <div class="circle"></div>
            </div>
            <div class="action-container">
                <div class="continue-button" id="continue">
                    CONTINUE
                </div>
            </div>
        </div>
        `;
  }

  static get observedAttributes() {
    return ['onContinueCallback', 'musicTitle', 'artist', 'score'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onContinueCallback':
        this.onContinueCallback = newValue;
        break;
      case 'musicTitle':
        this.musicTitle = newValue;
        break;
      case 'artist':
        this.artist = newValue;
        break;
      case 'score':
        this.score = newValue;
        break;
    }
  }
}

customElements.define('congratulations-screen', Congratulations);
