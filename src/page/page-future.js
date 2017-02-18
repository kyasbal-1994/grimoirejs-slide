const gr = require('grimoirejs').default;
const $$ = gr('#canvas');
const Tweenable = require('shifty');
const { Color4 } = require('grimoirejs-math').default;

const fadeIn = (selector, finish) => {
  return (new Tweenable()).tween({
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 1000,
    easing: 'swifter',
    step(state) {
      $$(selector).setAttribute('color', new Color4(1, 1, 1, state.opacity));
    },
    finish: finish,
  });
}
const fadeOut = (selector, finish) => {
  return (new Tweenable()).tween({
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: 1000,
    easing: 'swifter',
    step(state) {
      $$(selector).setAttribute('color', new Color4(1, 1, 1, state.opacity));
    },
    finish: finish,
  });
}
let tweenable = null;
$$('.future').on('build', (i) => {
  switch (i) {
    case 1:
      tweenable = fadeIn('.future .future-image1', () => {
        tweenable = null;
      });
      break;
    case 2:
      if (tweenable) {
        tweenable.stop();
        tweenable = null;
      }
      debugger;
      tweenable = fadeIn('.future .future-image2');
      //fadeOut('.future .future-image1');
      break;
  }
});

$$('.future').on('hide', () => {
  if (tweenable) {
    tweenable.stop();
    tweenable = null;
  }
  $$('.future .future-image1').setAttribute('color', new Color4(1, 1, 1, 0));
  $$('.future .future-image2').setAttribute('color', new Color4(1, 1, 1, 0));
});
