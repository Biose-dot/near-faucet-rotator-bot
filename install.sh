#!/bin/bash

echo "📦 Installing Node.js and Puppeteer..."
sudo apt update && sudo apt install -y nodejs npm
npm init -y
npm install puppeteer

echo "✅ Done. Add your wallets to wallets.txt and run ./start.sh"
