# TECTON Estimator

Conservative, plug-and-play cost estimator for home extensions (Ireland).

## Features

- Fully **dynamic line items** – add or remove any item or whole section
- **Permanent corrections** – change any rate and it is remembered forever on that browser (localStorage)
- Conservative multipliers: labour ×1.25, materials ×1.15, 15 % contingency
- Multi-source 2026 Irish material pricing (Goodwins, Brooks, McMahons, Hanly, TJ O’Mahony, etc.)
- Labour time guidance drawn from 5+ real extension programmes
- Suggested sell price = cost × 2 (your 50 % margin)
- Confidence tags per section
- Print / PDF ready
- Fully offline once loaded – no backend required

## Deploy to Cloudflare Pages

1. Connect this repo to Cloudflare Pages
2. Build command: leave empty (static site)
3. Output directory: `/` (root)
4. Deploy

Optional: drop `logo.jpeg` next to `index.html` if you want the full graphic logo (the app already has a clean brand mark).

## How corrections work

- Click any rate or quantity and change it → it is saved immediately and permanently for that browser.
- Open **Edit Rates** to change the global unit rates (skip, concrete, PIR, day rates, etc.). These also persist.
- **Reset All** clears everything back to the factory conservative defaults.

## Local use

Just open `index.html` in any browser, or:

```bash
npx serve .
```
