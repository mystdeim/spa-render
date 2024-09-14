const express = require('express');
const { chromium } = require('playwright');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const BLOCKED_RESOURCES = [
  "google-analytics.com",
  "api.mixpanel.com",
  "fonts.googleapis.com",
  "stats.g.doubleclick.net",
  "mc.yandex.ru",
  "use.typekit.net",
  "beacon.tapfiliate.com",
  "js-agent.newrelic.com",
  "api.segment.io",
  "woopra.com",
  "static.olark.com",
  "static.getclicky.com",
  "fast.fonts.com",
  "youtube.com/embed",
  "cdn.heapanalytics.com",
  "googleads.g.doubleclick.net",
  "pagead2.googlesyndication.com",
  "fullstory.com/rec",
  "navilytics.com/nls_ajax.php",
  "log.optimizely.com/event",
  "hn.inspectlet.com",
  "tpc.googlesyndication.com",
  "partner.googleadservices.com",
  "mail.ru",
  "calltouch.ru",
  "facebook.net",
  "vk.com",
  "chatra.io",
  "googletagmanager.com",
  "bitrix24.ru"
];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

let browser;

const isBlocked = (url) => {
  return BLOCKED_RESOURCES.some(substring => url.includes(substring));
}

app.post('/render', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const page = await browser.newPage();
    await page.route("**/*", (route, request) => {
      const url = request.url()
      const resourceType = request.resourceType();
      const blockedTypes = ["image", "stylesheet", "media", "xhr", "fetch", "font", "manifest", "websocket", "x-icon", "ping", "preflight"];

      if (blockedTypes.includes(resourceType) || isBlocked(url)) {
        console.log(`Blocked: ${url}`);
        route.abort();
      } else {
        console.log(`Downloading: ${url}`);
        route.continue();
      }
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    const content = await page.content();
    await page.close();

    res.send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while rendering the page');
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  browser = await chromium.launch({
    headless: true
  });
  console.log('Browser launched');
});

process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
    console.log('Browser closed');
  }
  process.exit();
});
