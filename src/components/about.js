const componentStyles = `
<style>
    .about {
        display: flex;
        flex-direction: column;
        background-color: rgba(0,0,0,0.9);
        align-items: center;
        padding: 10px;
        height: calc(100% - 20px);
        font-family: Arial;
    } 

    .close-container {
        width: 100%;
        text-align: right;
    }

    .close {
        cursor: pointer;
        color: white;
        font-weight: bold;
        font-size: 32px;
    }

    .about-text {
        letter-spacing: 2px;
        color: white;
        margin-top: 60px;
        margin-bottom: 25px;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
    }


    .about-description {
        font-size: 18px;
        color: white;
        line-height: 1.333;
        max-width: 400px;
        padding: 15px;
        padding-top: 25px;
        padding-bottom: 25px;
        background-color: rgba(0, 79, 179, 0.4);
    }


</style>
`;

export class About extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.prop = {
      onCloseCallback: () => {}
    };
    this.updateDom();
    this.bindEvents();
  }

  get onCloseCallback() {
    return this.prop.onCloseCallback;
  }

  set onCloseCallback(onCloseCallback) {
    this.prop.onCloseCallback = onCloseCallback;
  }

  bindEvents() {
    this.root
      .querySelector('.close')
      .addEventListener('click', () => this.prop.onCloseCallback());
  }

  updateDom() {
    /*html*/
    this.root.innerHTML = `
        ${componentStyles}
        <div class="about">
            <div class="close-container">
                <span class="close">
                    X
                </span>
            </div>
            <span class="about-text">
                ABOUT THE GAME
            </span>
            <p class="about-description">
                This game is created using Web components, Workbox, HTML, CSS, Webpack, Hammer.js and Three.js 
                <br><br>Created by: <a href="https://www.linkedin.com/in/stephen-vinuya-54441b106/" style="color: white;font-weight: bold;">Stephen Vinuya</a>
                <br>Github Repo: <a href="" style="color: white;">Repo</a>
            </p>
        </div>
        `;
  }

  static get observedAttributes() {
    return ['onCloseCallback'];
  }

  attribteChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'onCloseCallback':
        this.onCloseCallback = newValue;
        break;
    }
  }
}

customElements.define('about-screen', About);
