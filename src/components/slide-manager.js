const gr = require('grimoirejs').default;
const {CameraComponent} = require('grimoirejs-fundamental').default.Components;
const Component = gr.Node.Component;

module.exports = class SlideManager extends Component {
  $awake() {
    this.pages = [];
    this.number = 0;
    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowRight':
          if (this.number === this.pages.length - 1) {
            return;
          }
          this.operate(1);
          break;
        case 'ArrowLeft':
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
        this.operate(0);
      });
    });
  }

  operate(delta) {
    const slideRenderer = this.node.getComponentsInChildren('SlideRenderer')[0];
    const currentNumber = this.number + delta;
    const currentPageScene = this.pages[currentNumber];
    const previousPageScene = this.pages[this.number];
    if (!currentPageScene) { return; }
    const tween = delta !== 1 ? null : {
      transition: `transition-${previousPageScene.getAttribute('transition')}`,
      easing: previousPageScene.getAttribute('easing'),
      duration: previousPageScene.getAttribute('duration'),
    };
    const currentClearColor = currentPageScene.getAttribute('color');
    const previousClearColor = previousPageScene.getAttribute('color');
    previousPageScene.node.emit('hide');
    slideRenderer.updateClearColor(currentClearColor, previousClearColor);
    slideRenderer.transit(`#page${currentNumber}`, `#page${this.number}`, tween);
    currentPageScene.node.emit('show');
    this.number = currentNumber;
  }

  update() {
    this.pages = this.node.children.map((v) => {
      return v.getComponent('PageScene');
    }).filter((v) => v).sort((a, b) => {
      const aa = parseInt(a.getAttribute('order'), 10);
      const bb = parseInt(b.getAttribute('order'), 10);
      if (isNaN(aa) || isNaN(bb)) {
        return 0;
      } else {
        return aa - bb;
      }
    });
    this.pages.forEach((v, i) => {
      v.node.getComponentsInChildren(CameraComponent)[0].node.setAttribute('id', `page${i}`); // temporary avoid bugs
    });
  }
}
