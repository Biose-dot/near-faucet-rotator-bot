const puppeteer = require("puppeteer");
const fs = require("fs");
const wallets = require("./wallets.json");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function claimFaucet(page, wallet) {
  try {
    await page.goto("https://near-faucet.io", { waitUntil: "domcontentloaded" });

    await page.waitForSelector('input[name="account"]', { timeout: 10000 });
    await page.type('input[name="account"]', wallet);

    await page.waitForXPath("//button[contains(., 'Request')]", { timeout: 10000 });
    const [requestButton] = await page.$x("//button[contains(., 'Request')]");
    if (requestButton) {
      await requestButton.click();
    } else {
      throw new Error("Tombol Request tidak ditemukan.");
    }

    await delay(5000);
    console.log(`✅ Sukses kirim request untuk ${wallet}`);
  } catch (err) {
    console.error(`❌ Error untuk ${wallet}: ${err.message}`);
  }
}

async function run() {
  while (true) {
    console.log(`⏰ Running faucet rotation at ${new Date().toLocaleString("id-ID")}`);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    for (const wallet of wallets) {
      console.log(`🚰 Claiming faucet for ${wallet}...`);
      await claimFaucet(page, wallet);
      const delaySeconds = Math.floor(Math.random() * 20) + 30; // delay antara 30-50 detik
      console.log(`⏳ Waiting ${delaySeconds}s before next wallet...`);
      await delay(delaySeconds * 1000);
    }

    await browser.close();

    console.log("🎉 Rotation finished.");
    console.log("🛌 Sleeping 3 hours before next full cycle...");
    await delay(3 * 60 * 60 * 1000); // delay 3 jam
  }
}

run();
