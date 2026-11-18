# TECTON Estimator

Conservative, plug-and-play cost estimator for home extensions (Ireland).

## How it works now

1. **Start page** – You describe the job in plain English (or paste a list of what is included).
2. **Automatic scope expansion** – The system detects what you wrote, then adds anything that is normally required but missing (foundations, floor slab, insulation, prelims, cladding, internal works, attendances, etc.).
3. **Full estimate** – You get a complete conservative cost breakdown. Every line is still editable. Rates you change are saved permanently on that browser.

## Features

- Start / intake screen – just list the works
- Auto-adds missing necessary packages based on keywords + construction type
- Fully dynamic – add or remove any item or whole section afterwards
- Permanent rate corrections (localStorage)
- Conservative multipliers + 15 % contingency
- Suggested sell price = cost × 2 (your 50 % margin)
- Multi-source 2026 Irish material pricing
- Print / PDF ready
- Fully offline once loaded

## Deploy to Cloudflare Pages

1. Connect this repo to Cloudflare Pages
2. Build command: leave empty
3. Output directory: `/`
4. Deploy

## Local use

Open `index.html` in any browser.
