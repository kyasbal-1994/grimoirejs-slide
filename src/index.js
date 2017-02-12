const gr = require('grimoirejs').default;

gr(() => {
  const $$ = gr('#canvas');
  $$('page').on('show', (i) => {
    console.log(`show ${i}`);
  });
  $$('page').on('hide', (i) => {
    console.log(`hide ${i}`);
  });
  $$('page').on('build', (i) => {
    console.log(i);
  });

  // pages
  require('./page/page-compare');
});
