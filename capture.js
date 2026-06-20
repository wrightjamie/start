const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a nice 1080p laptop size
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Load the local HTML file
  const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Give the weather API a second to fully render
  await new Promise(r => setTimeout(r, 2000));

  // Take the screenshot
  await page.screenshot({ path: 'assets/dashboard_preview.png', fullPage: true });

  await browser.close();
  console.log('Screenshot captured successfully!');
})();
