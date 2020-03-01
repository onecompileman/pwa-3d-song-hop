const componentStyle = `
<style>
    .in-game-ui {
        height: 120px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Arial;
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

    .in-game-top-bar {
        height: 36px;
        width: 100%;
        display: flex;
        margin: 6px;
        justify-content: space-between;
        align-items: center;
    }
    
    .circle-container {
        display: flex;
        align-items: center;
        padding-left: 7px;
    }

    .circle {
        height: 24px;
        width: 24px;
        border-radius: 100%;
        background-color: white;
        margin-right: 8px;
    }

    #circleCollected {
        font-size: 14px;
        color: white;
    }

    .pause-btn {
        display: flex;
        padding-right: 7px;
     }

    .pause-box {
        margin-left: 10px;
        background-color: white;
        width: 8px;
        height: 26px;
    }

    .score {
        font-size: 38px;
        color: white;
        margin-top: 6px;
        margin-bottom: 6px;
        text-align: center;
    }

    .progress-bar {
        width: 80%;
        text-align: center;
        max-width: 380px;
        height: 28px;
        border-radius: 20px;
        border: 2px solid rgba(250, 250, 132, 0.9);
        padding: 2px;
    }

    .progress-bar-thumb {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        background: rgba(240, 1, 100, 1);
    }
</style>
`;

export class InGameUI extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      score: 0,
      circles: 0,
      percentage: 0,
      onPauseCallback: () => {}
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

  get onPauseCallback() {
    return this.prop.onPauseCallback;
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

  set onPauseCallback(onPauseCallback) {
    this.prop.onPauseCallback = onPauseCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#pause')
      .addEventListener('click', () => this.prop.onPauseCallback());
  }

  updateDom() {
    /*html*/
    this.root.innerHTML = `
        ${componentStyle}
        <div class="in-game-ui">
            <div class="in-game-top-bar">
                <div class="circle-container">
                    <div class="circle" id="circleText"></div>
                    <span id="circleCollected">0</span>
                </div>
                <div class="pause-btn" id="pause">
                    <div class="pause-box">
                    </div>
                    <div class="pause-box">
                    </div>
                </div>  
            </div>
            <div class="score" id="scoreText">
                0
            </div>
            <div class="progress-bar">
                <div class="progress-bar-thumb" id="progressThumb">
                   
                </div>
                 <span id="progressText">
                    0% Completed
                </span>
            </div>
        </div>
        `;
  }

  static get observedAttributes() {
    return ['onPauseCallback', 'score', 'percentage', 'circles'];
  }

  attribteChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onPauseCallback':
        this.onPauseCallback = newValue;
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

customElements.define('in-game-ui', InGameUI);
