const puppeteer = require("puppeteer");

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
  }
  return browser;
}

async function renderHtmlToPng(html, { width = 1080, height = 1350 } = {}) {
  const b = await getBrowser();
  const page = await b.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle0", timeout: Number(process.env.PUPPETEER_TIMEOUT_MS || 30000) });
  const screenshot = await page.screenshot({ type: "png" });
  await page.close();
  return screenshot;
}

module.exports = { renderHtmlToPng };
