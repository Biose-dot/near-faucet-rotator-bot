
const puppeteer = require('puppeteer');
const wallets = require('./wallets.json');
const { setTimeout: wait } = require('timers/promises');

(async () => {
    while (true) {
        for (const wallet of wallets) {
            try {
                console.log(`🚰 Claiming faucet for ${wallet}...`);
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const page = await browser.newPage();
                await page.goto('https://near-faucet.io/', { waitUntil: 'domcontentloaded' });

                await page.waitForSelector('input[name="wallet"]');
                await page.type('input[name="wallet"]', wallet);
                await page.click('button[type="submit"]');

                console.log(`✅ Claimed for ${wallet}`);
                await browser.close();
                await wait(37000); // wait 37s before next wallet
            } catch (error) {
                console.error(`❌ Error for ${wallet}:`, error.message);
            }
        }
        console.log('🎉 Rotation finished.');
        console.log('🛌 Sleeping 3 hours before next full cycle...');
        await wait(3 * 60 * 60 * 1000); // wait 3 hours
    }
})();
