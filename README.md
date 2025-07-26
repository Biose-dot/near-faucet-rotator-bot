# 🚰 NEAR Faucet Rotator Bot

Automates faucet claims for multiple NEAR testnet accounts from [https://near-faucet.io](https://near-faucet.io), using Puppeteer.

## ✨ Features
- Rotates through multiple NEAR wallets
- Randomized human-like delay (30–90s)
- Runs forever via loop (`start.sh`)
- Easy install on Ubuntu via CLI

## ⚠️ Warning
This bot may violate the faucet's Terms of Service. Use responsibly for testing only.

## 🛠 Installation (Ubuntu CLI)

```bash
git clone https://github.com/YOUR_USERNAME/near-faucet-rotator-bot.git
cd near-faucet-rotator-bot
chmod +x install.sh start.sh
./install.sh
nano wallets.txt   # Add your wallets
./start.sh         # Run the bot
```

Or run in background:

```bash
tmux new -s faucet
./start.sh
```

## 📄 wallets.txt Format

Add one wallet per line:

```
tightstreet530.testnet
user456.testnet
...
```

## 📜 License

MIT — Open-source for testing only.
