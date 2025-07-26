const puppeteer = require('puppeteer');
const fs = require('fs');

const WALLET_LIST_PATH = './wallets.txt';
const URL = "https://near-faucet.io/";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

(async () => {
  const wallets = fs.readFileSync(WALLET_LIST_PATH, 'utf-8').split('\n').map(x => x.trim()).filter(Boolean);

  for (const wallet of wallets) {
    console.log(`\n[${new Date().toISOString()}] Claiming for wallet: ${wallet}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle2' });

    try {
      await page.type('input[name="wallet"]', wallet);
      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForTimeout(5000),
      ]);
      console.log(`✅ Claimed faucet for ${wallet}`);
    } catch (err) {
      console.error(`❌ Error for ${wallet}: ${err.message}`);
    }

    await browser.close();

    const waitTime = randomInt(30, 90);
    console.log(`⏳ Waiting ${waitTime}s before next wallet...\n`);
    await delay(waitTime * 1000);
  }

  console.log("🎉 Rotation finished.");
})();
