const gr = require('grimoirejs').default;
const {CameraComponent} = require('grimoirejs-fundamental').default.Components;
const Component = gr.Node.Component;

module.exports = class SlideManager extends Component {
  $awake() {
    this.pages = [];
    this.number = 0;
    this.build = 0;
    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (this.pages.length === 0) { return; }
      switch (e.key) {
        case 'PageDown':
        case 'ArrowRight':
          if (this.pages[this.number].getAttribute('build') > this.build) {
            this.build += 1;
            this.pages[this.number].node.emit('build', this.build);
            return;
          }
          if (this.number === this.pages.length - 1) {
            return;
          }
          this.operate(1);
          break;
        case 'PageUp':
        case 'ArrowLeft':
          if (this.build > 0) {
            this.operate(0);
            return;
          }
          if (this.number === 0) {
            return;
          }
          this.operate(-1);
          break;
      }
    });
  }

  $mount() {
    process.nextTick(() => {
      process.nextTick(() => {
        const page = parseInt(document.location.hash.substr(1), 10);
        this.operate(page || 0);
      });
    });
  }

  operate(delta) {
    const slideRenderer = this.node.getComponentsInChildren('SlideRenderer')[0];
    const previousNumber = this.number;
    const currentNumber = previousNumber + delta;
    const currentPageScene = this.pages[currentNumber];
    const previousPageScene = this.pages[previousNumber];
    if (!currentPageScene) { return; }
    const tween = delta !== 1 ? null : {
      transition: `transition-${previousPageScene.getAttribute('transition')}`,
      easing: previousPageScene.getAttribute('easing'),
      duration: previousPageScene.getAttribute('duration'),
    };
    const currentClearColor = currentPageScene.getAttribute('color');
    const previousClearColor = previousPageScene.getAttribute('color');
    slideRenderer.updateClearColor(currentClearColor, previousClearColor);
    slideRenderer.transit(`#page${currentNumber}`, `#page${previousNumber}`, tween, () => {
      previousPageScene.node.emit('hide', previousNumber, delta);
    });
    currentPageScene.node.emit('show', currentNumber, delta);
    this.number += delta;
    document.location.hash = this.number;
    this.build = 0;
  }

  update() {
    this.pages = this.node.children.map((v) => {
      return v.getComponent('PageScene');
    }).filter((v) => v)//.sort((a, b) => {
    //   const aa = parseInt(a.getAttribute('order'), 10);
    //   const bb = parseInt(b.getAttribute('order'), 10);
    //   if (isNaN(aa) && isNaN(bb)) {
    //     return 0;
    //   } else if (isNaN(aa)) {
    //     return 1;
    //   } else if (isNaN(bb)) {
    //     return -1;
    //   } else {
    //     return aa - bb;
    //   }
    // });
    this.pages.forEach((v, i) => {
      v.node.getComponentsInChildren(CameraComponent)[0].node.setAttribute('id', `page${i}`); // temporary avoid bugs
    });
  }
}
