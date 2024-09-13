const prerender = require('prerender');

const server = prerender({
  chromeLocation: '/usr/bin/chromium',
  logRequests: true,
  captureConsoleLog: true,
  chromeFlags: ['--disable-web-security', '--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars', '--disable-dev-shm-usage']
});
server.use(require('./plugins/blockResources'));
server.use(require('./plugins/removeScriptTags'));
server.start();
