const componentStyle = `
<style>
    .pause {
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

    .action-container {
        width: 80%;
        min-width: 250px;
        max-width: 350px;
        bottom: 35px;
        position: absolute;
    }

    .score {
        font-size: 52px;
        margin-top: 40px;
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

    .progress-bar {
        text-align: center;
        width: 80%;
        margin-top: 15px;
        margin-bottom: 15px;
        max-width: 380px;
        height: 28px;
        border-radius: 20px;
        border: 2px solid rgba(250, 250, 132, 0.9);
        padding: 2px;
    }

     #progressText {
        width: 100%;
        color: white;
        position: relative;
        z-index: 111111111;
        width: 100%;
        display: block;
        top: -75%;
        font-size: 16px;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 2px;
    }

    .progress-bar-thumb {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        background-color: rgba(240, 1, 100, 1);
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

export class Pause extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      onResumeCallback: () => {},
      onMenuCallback: () => {},
      percentage: 0,
      score: 0,
      circles: 0
    };
    this.updateDom();
    this.bindEvents();
  }

  get percentage() {
    return this.prop.percentage;
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

  get onResumeCallback() {
    return this.prop.onResumeCallback;
  }

  set percentage(percentage) {
    this.prop.percentage = percentage;
    const progressThumb = this.root.querySelector('#progressThumb');
    const progressText = this.root.querySelector('#progressText');
    const percentageText = `${this.prop.percentage}%`;
    progressThumb.style.width = percentageText;
    progressText.innerHTML = `${percentageText} COMPLETED`;
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

  set onResumeCallback(onResumeCallback) {
    this.prop.onResumeCallback = onResumeCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#resume')
      .addEventListener('click', () => this.prop.onResumeCallback());
    this.root
      .querySelector('#menu')
      .addEventListener('click', () => this.prop.onMenuCallback());
  }

  updateDom() {
    /*html*/
    this.root.innerHTML = `
        ${componentStyle}
        <div class="pause">
            <div class="game-over-text">
                PAUSED
            </div>
            
            <div class="score" id="scoreText">
                0
            </div>
            <div class="score-label">
                Score
            </div>
            <div class="progress-bar">
                <div class="progress-bar-thumb" id="progressThumb">
                
                </div>
                <span id="progressText">
                    0% Completed
                </span>
            </div>
            <div class="circle-container">
                <span class="circle-text" id="circleText">
                    +0
                </span>
                <div class="circle"></div>
            </div>
            <div class="action-container">
                <div class="retry-button" id="resume">
                    RESUME
                </div>
                <div class="menu-button" id="menu">
                    MENU
                </div>
            </div>
        </div>
        `;
  }

  static get observedAttributes() {
    return [
      'onResumeCallback',
      'onMenuCallback',
      'score',
      'percentage',
      'circles'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onResumeCallback':
        this.onResumeCallback = newValue;
        break;
      case 'onMenuCallback':
        this.onMenuCallback = newValue;
        break;
      case 'score':
        this.score = newValue;
        break;
      case 'percentage':
        this.percentage = newValue;
        break;
      case 'circles':
        this.circles = newValue;
        break;
    }
  }
}

customElements.define('pause-screen', Pause);
