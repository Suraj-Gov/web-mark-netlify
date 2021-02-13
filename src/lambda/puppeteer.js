const playwright = require("playwright-aws-lambda");

exports.handler = async (event, ctx) => {
  const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

  const browser = await playwright.launchChromium();
  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto(pageToScreenshot);

  const title = await page.title();

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      title,
    }),
  };
};

// TODO: uninstall puppeteer
