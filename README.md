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

## Live item price research

The app includes a Cloudflare Pages Function at `functions/api/price-search.js`.
When a new estimate item description is entered and committed (focus leaves the description field), the function searches the live web for Irish listings, including Chadwicks, Goodwins, Brooks, TJ O'Mahony, McMahons, Woodie's, Ganly's and wider specialist/web results.

Cloudflare Pages automatically deploys files in the `functions/` directory as Pages Functions. Deploy this repository as a Cloudflare Pages project with the root as the output directory; no separate API key is required for the DuckDuckGo HTML search integration.

The estimator extracts euro prices visible in search-result titles/snippets, uses the median of the extracted prices as the suggested rate, updates the estimate line and saves the item to Global Rates. Each returned result is shown as a clickable source with its title, domain, displayed price (when found), and the date checked. Results with no extractable price are shown as listings only. When no price is found, the app leaves the entered rate unchanged and allows manual entry.

Important: this is live web-search discovery, not direct supplier inventory/API access. Search snippets can be stale, omit VAT, reflect a different pack size, or show a price for a similar rather than identical product. Verify the linked listing and unit before accepting the suggested rate. The app does not invent a rate when search results contain no detectable euro price.
