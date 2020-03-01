const componentStyles = `
<style>
  .game-over {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-family: Arial;
    background-color: rgba(0,0,0,0.5);
    text-shadow: 0 0 3px rgba(0,0,0,0.6);
  }

  .game-over-text {
    font-size: 36px;
    margin-top: 60px;
    color: white;
    letter-spacing: 2px;
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

  .action-container {
    width: 80%;
    min-width: 250px;
    max-width: 350px;
    bottom: 35px;
    position: absolute;
  }

  .retry-button, .menu-button {
    height: 36px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    margin-top: 20px;
    letter-spacing: 1.5px
  }

  .menu-button {
    background-color: #004FB3;
  }

  .circle-text {
    color: white;
    margin-right: 8px;
  }

  .retry-button {
    background-color: #FA0C84;
  }
</style>
`;

export class GameOver extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      onRetryCallback: () => {},
      onMenuCallback: () => {},
      score: 0,
      circles: 0
    };
    this.updateDom();
    this.bindEvents();
  }

  get score() {
    return this.prop.score;
  }

  get circles() {
    return this.prop.circles;
  }

  get onMenuCallback() {
    return this.prop.onMenuCallback;
  }

  get onRetryCallback() {
    return this.prop.onRetryCallback;
  }

  set score(score) {
    this.prop.score = score;
    const scoreText = this.root.querySelector('#scoreText');
    scoreText.innerHTML = score;
  }

  set circles(circles) {
    this.prop.circles = circles;
    const circleText = this.root.querySelector('#circleText');
    circleText.innerHTML = circles;
  }

  set onMenuCallback(onMenuCallback) {
    this.prop.onMenuCallback = onMenuCallback;
  }

  set onRetryCallback(onRetryCallback) {
    this.prop.onRetryCallback = onRetryCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#retry')
      .addEventListener('click', () => this.prop.onResumeCallback());
    this.root
      .querySelector('#menu')
      .addEventListener('click', () => this.prop.onMenuCallback());
  }

  updateDom() {
    /*html*/
    this.root.innerHTML = `
        ${componentStyles}
        <div class="game-over">
            <div class="game-over-text">
                GAME OVER
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
                <div class="retry-button" id="retry">
                    RETRY
                </div>
                <div class="menu-button" id="menu">
                    MENU
                </div>
            </div>
        </div>
        `;
  }

  static get observedAttributes() {
    return ['onRetryCallback', 'onMenuCallback', 'score', 'percentage'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onRetryCallback':
        this.onResumeCallback = newValue;
        break;
      case 'onMenuCallback':
        this.onMenuCallback = newValue;
        break;
      case 'score':
        this.score = newValue;
        break;
      case 'circles':
        this.circles = newValue;
        break;
    }
  }
}

customElements.define('game-over', GameOver);
