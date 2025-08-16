# BTC Solo Mining Tracker

This dashboard displays live stats from CKPool and SoloChance odds for a given BTC wallet.

## Features
- Wallet address display
- Worker count
- Best share
- Network difficulty
- Last block height
- SoloChance odds calculation

## Data Source
- Cloudflare Worker endpoint: `https://broad-cell-151e.schne564.workers.dev/`

## Setup
1. Upload all files to your GitHub repo
2. Enable GitHub Pages (source: `main` branch)
3. Visit: `https://schne564.github.io/btc-solo-tracker2/`

## Notes
- Odds are pulled directly from the Worker JSON and calculated as exponential percentage
- Styling is dark-mode friendly and responsive
