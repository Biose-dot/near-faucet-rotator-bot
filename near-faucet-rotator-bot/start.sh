#!/bin/bash

while true
do
  echo "⏰ Running faucet rotation at $(date)"
  node bot.js
  echo "🛌 Sleeping 3 hours before next full cycle..."
  sleep 10800
done
