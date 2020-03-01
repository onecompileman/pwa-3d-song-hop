const componentStyles = `
<style>

  @keyframes ldio-4uxsy1a2cgv-1 {
    0% { top: 20px; height: 160px }
    50% { top: 60px; height: 80px }
    100% { top: 60px; height: 80px }
  }
  @keyframes ldio-4uxsy1a2cgv-2 {
    0% { top: 30px; height: 140px }
    50% { top: 60px; height: 80px }
    100% { top: 60px; height: 80px }
  }
  @keyframes ldio-4uxsy1a2cgv-3 {
    0% { top: 40px; height: 120px }
    50% { top: 60px; height: 80px }
    100% { top: 60px; height: 80px }
  }
  .ldio-4uxsy1a2cgv div { position: absolute; width: 20px }
  .ldio-4uxsy1a2cgv div:nth-child(1) {
  left: 35px;
    background: #4df8e4;
    animation: ldio-4uxsy1a2cgv-1 1.5384615384615383s cubic-bezier(0,0.5,0.5,1) infinite;
    animation-delay: -0.3076923076923077s;
  }
  .ldio-4uxsy1a2cgv div:nth-child(2) {
    left: 85px;
    background: #4df8e4;
    animation: ldio-4uxsy1a2cgv-2 1.5384615384615383s cubic-bezier(0,0.5,0.5,1) infinite;
    animation-delay: -0.15384615384615385s;
  }
  .ldio-4uxsy1a2cgv div:nth-child(3) {
    left: 135px;
    background: #4df8e4;
    animation: ldio-4uxsy1a2cgv-3 1.5384615384615383s cubic-bezier(0,0.5,0.5,1) infinite;
    animation-delay: 0.65s;
  }

  .loadingio-spinner-pulse-5a14352j4uk {
    width: 200px;
    height: 200px;
    display: inline-block;
    overflow: hidden;
    background: rgba(255, 255, 255, 0);
  }
  .ldio-4uxsy1a2cgv {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
  }
  .ldio-4uxsy1a2cgv div { box-sizing: content-box; }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background: rgba(0, 0, 0, 0.8);
    height: calc(100% - 20px);
    font-family: Arial;
  }

  .music-title {
    color: #ddd;
    font-size: 26px;
    margin-top: 25px;
  }

  .artist {
    color: #ddd;
    font-size: 18px;
    margin-top: 8px;
  }

  .loading-text {
    letter-spacing: 2px;
    color: #ddd;
    font-size: 16px;
    margin-bottom: 30px;
  }

  .music-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  
</style>
`;
export class Loading extends HTMLElement {
  constructor() {
    super();
    this.prop = {
      musicTitle: '',
      artist: ''
    };
    this.root = this.attachShadow({ mode: 'open' });
    this.updateDom();
  }

  get artist() {
    return this.prop.artist;
  }

  set artist(artist) {
    this.prop.artist = artist;
    this.root.querySelector('#artist').innerHTML = artist;
  }

  get musicTitle() {
    return this.prop.musicTitle;
  }

  set musicTitle(musicTitle) {
    this.prop.musicTitle = musicTitle;
    this.root.querySelector('#musicTitle').innerHTML = musicTitle;
  }

  updateDom() {
    /*html*/
    this.root.innerHTML = `
            ${componentStyles}
            <div class="loading">
                <div class="music-container">
                  <span class="music-title" id="musicTitle">
                      Memories
                  </span>
                  <span class="artist" id="artist">
                  </span>
                </div>
                <div class="loadingio-spinner-pulse-5a14352j4uk"><div class="ldio-4uxsy1a2cgv">
                <div></div><div></div><div></div>
                </div></div>
                <span class="loading-text">
                    LOADING 
                </div>
            </div>
        `;
  }

  static get observedAttributes() {
    return ['musicTitle', 'artist'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'musicTitle':
        this.musicTitle = newValue;
        break;
      case 'artist':
        this.artist = newValue;
        break;
    }
  }
}

customElements.define('loading-screen', Loading);
