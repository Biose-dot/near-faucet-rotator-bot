const puppeteer = require("puppeteer-core"); // atau "puppeteer" jika kamu install penuh
const wallets = require("./wallets.json");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

(async () => {
  while (true) {
    console.log(`⏰ Running faucet rotation at ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`);

    for (const wallet of wallets) {
      console.log(`🚰 Claiming faucet for ${wallet}...`);
      try {
        const browser = await puppeteer.launch({
          headless: true,
          executablePath: "/usr/bin/google-chrome", // ganti sesuai dengan path Chrome kamu
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.goto("https://near-faucet.io", { timeout: 60000, waitUntil: "domcontentloaded" });

        await page.waitForSelector('input[name="account"]', { timeout: 10000 });
        await page.type('input[name="account"]', wallet, { delay: 100 });

        // Tunggu dan cari tombol "Request"
        await page.waitForSelector("button", { timeout: 10000 });
        const buttons = await page.$$("button");
        let requestButton = null;

        for (const btn of buttons) {
          const text = await page.evaluate(el => el.innerText, btn);
          if (text.trim().toLowerCase() === "request") {
            requestButton = btn;
            break;
          }
        }

        if (!requestButton) throw new Error("Tombol 'Request' tidak ditemukan");

        await requestButton.click();
        await delay(5000); // tunggu respons
        console.log(`✅ Success for ${wallet}`);

        await browser.close();
      } catch (error) {
        console.error(`❌ Error untuk ${wallet}: ${error.message}`);
      }

      const waitTime = Math.floor(Math.random() * 20) + 15; // 15–35 detik delay antar akun
      console.log(`⏳ Waiting ${waitTime}s before next wallet...\n`);
      await delay(waitTime * 1000);
    }

    console.log("🎉 Rotation finished.");
    console.log("🛌 Sleeping 3 hours before next full cycle...\n");
    await delay(3 * 60 * 60 * 1000); // 3 jam
  }
})();
