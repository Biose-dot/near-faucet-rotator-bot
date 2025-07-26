
const puppeteer = require('puppeteer');
const wallets = require('./wallets.json');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function claimFaucet(wallet) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://near-faucet.io/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('input[name="wallet"]', { timeout: 10000 });
    await page.type('input[name="wallet"]', wallet);
    await page.click('button[type="submit"]');

    await delay(10000); // wait 10 seconds

    console.log(`✅ Claimed for ${wallet}`);
  } catch (error) {
    console.error(`❌ Error for ${wallet}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  while (true) {
    console.log('🚀 Starting new rotation...');
    for (const wallet of wallets) {
      await claimFaucet(wallet);
      const waitTime = 30000 + Math.random() * 20000;
      console.log(`⏳ Waiting ${Math.round(waitTime / 1000)}s before next wallet...`);
      await delay(waitTime);
    }
    const cycleWait = 3 * 60 * 60 * 1000;
    console.log('🎉 Rotation finished. 🛌 Sleeping 3 hours before next full cycle...');
    await delay(cycleWait);
  }
}

main();
