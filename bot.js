const puppeteer = require("puppeteer-core");
const wallets = require("./wallets.json");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const MAX_CYCLE = 100;
const MAX_RETRY_PER_WALLET = 3;
const SLEEP_3_HOURS = 3 * 60 * 60 * 1000; // 3 jam

(async () => {
  for (let cycle = 1; cycle <= MAX_CYCLE; cycle++) {
    console.log(`\n⏰ [Cycle ${cycle}/${MAX_CYCLE}] Running faucet rotation at ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`);
    
    let anySuccess = false;

    for (const wallet of wallets) {
      console.log(`💧 Wallet: ${wallet}`);

      let retry = 0;
      let success = false;

      while (retry < MAX_RETRY_PER_WALLET && !success) {
        retry++;
        console.log(`🔁 Try ${retry}/${MAX_RETRY_PER_WALLET} for ${wallet}...`);

        try {
          const browser = await puppeteer.launch({
            headless: true,
            executablePath: "/usr/bin/google-chrome", // sesuaikan jika beda
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
          });

          const page = await browser.newPage();
          await page.goto("https://near-faucet.io", {
            timeout: 60000,
            waitUntil: "domcontentloaded"
          });

          // Tunggu dan isi form wallet
          await page.waitForSelector('input[name="account"]', { timeout: 10000 });
          await page.type('input[name="account"]', wallet, { delay: 50 });

          // Cari tombol "Request"
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

          if (!requestButton) throw new Error("Tombol 'Request' tidak ditemukan!");

          await requestButton.click();
          await delay(3000); // tunggu respons singkat

          console.log(`✅ Success for ${wallet} on attempt ${retry}`);
          anySuccess = true;
          success = true;

          await browser.close();
        } catch (error) {
          console.error(`❌ Failed attempt ${retry} for ${wallet}: ${error.message}`);
        }
      }

      if (!success) {
        console.warn(`⚠️ Gagal klaim untuk ${wallet} setelah ${MAX_RETRY_PER_WALLET} kali.`);
      }
    }

    if (!anySuccess) {
      console.warn(`🛑 Semua klaim gagal di siklus ${cycle}. Tidur selama 3 jam...`);
      await delay(SLEEP_3_HOURS);
    } else {
      console.log(`🌀 Siklus ${cycle} selesai. Melanjutkan...`);
      await delay(2000); // jeda antar siklus pendek
    }
  }

  console.log(`🎉 Telah menyelesaikan ${MAX_CYCLE} siklus klaim.`);
})();
