`use strict`;

const { init, start } = require('./lib/server');

init().then(() => {
  start();
})