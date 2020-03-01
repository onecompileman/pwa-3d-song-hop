const componentStyles = `
<style>
    .main-menu {
        display: flex;
        flex-direction: column;
        font-family: Arial;
        align-items: center;
        padding: 10px;
        height: calc(100% - 20px);
        background-color: rgba(0,0,0,0.8);
    }

    .game-text {
        font-size: 48px;
        font-weight bolder;
        margin-top: 60px;
        margin-bottom: 70px;
        color: white;
        letter-spacing: 2px;
    }

    .menu-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .menu-btn {
        height: 42px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 18px;
        margin-top: 35px;
        letter-spacing: 1.5px;
        background-color: #FA0C84;
        max-width: 280px;
    }


    .footer-text {
        color: white;
        font-size: 16px;
        text-align: right;
        position: absolute;
        width: 100%;
        bottom: 10px;
        text-align: center;
    }
</style>
`;

export class MainMenu extends HTMLElement {
  constructor() {
    super();
    this.prop = {
      onPlayCallback: () => {},
      onAboutCallback: () => {},
      onHowToPlayCallback: () => {}
    };
    this.root = this.attachShadow({ mode: 'open' });
    this.updateDom();
    this.bindEvents();
  }

  get onPlayCallback() {
    return this.prop.onPlayCallback;
  }

  set onPlayCallback(onPlayCallback) {
    this.prop.onPlayCallback = onPlayCallback;
  }

  get onAboutCallback() {
    return this.prop.onAboutCallback;
  }

  set onAboutCallback(onAboutCallback) {
    this.prop.onAboutCallback = onAboutCallback;
  }

  get onHowToPlayCallback() {
    return this.prop.onHowToPlayCallback;
  }

  set onHowToPlayCallback(onHowToPlayCallback) {
    this.prop.onHowToPlayCallback = onHowToPlayCallback;
  }

  bindEvents() {
    this.root
      .querySelector('#play')
      .addEventListener('click', () => this.prop.onPlayCallback());
    this.root
      .querySelector('#about')
      .addEventListener('click', () => this.prop.onAboutCallback());
    this.root
      .querySelector('#howToPlay')
      .addEventListener('click', () => this.prop.onHowToPlayCallback());
  }

  updateDom() {
    /*html*/
    this.root.innerHTML = `
        ${componentStyles}
        <div class="main-menu">
            <div class="game-text">
                Song Hop
            </div>
            <div class="menu-container">
                <div class="menu-btn" id="play">
                    PLAY
                </div>
                <div class="menu-btn" id="howToPlay">
                    HOW TO PLAY
                </div>
                <div class="menu-btn" id="about">
                    ABOUT
                </div>
            </div>
            <div class="footer-text">
                (c) 2020 <a href="https://onecompileman.com" style="color: white;">Stephen Vinuya</a>
            </div>
        </div>
        `;
  }

  static get observedAttributes() {
    return ['onPlayCallback'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onPlayCallback':
        this.onPlayCallback = newValue;
        break;
    }
  }
}

customElements.define('main-menu', MainMenu);
