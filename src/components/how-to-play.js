const componentStyles = `
<style>
    .how-to-play {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(0,0,0,0.9);
        padding: 10px;
        font-family: Arial;
        height: calc(100% - 20px);
    }

    .close-container {
        text-align: right;
        width: 100%;
    }

    .close {
        cursor: pointer;
        color: white;
        font-weight: bold;
        font-size: 32px;
    }

    .how-to-play-image {
        width: 100%;
        height: auto'
    }
</style>
`;

export class HowToPlay extends HTMLElement {
  constructor() {
    super();
    this.prop = {
      onCloseCallback: () => {}
    };
    this.root = this.attachShadow({ mode: 'open' });
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
        <div class="how-to-play">
            <div class="close-container">
                <span class="close">
                    X
                </span>
            </div>
            <img class="how-to-play-image" src="/assets/images/how-to-play.jpg" alt="How to Play">
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

customElements.define('how-to-play', HowToPlay);
