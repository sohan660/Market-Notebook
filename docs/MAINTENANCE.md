# Keep Market Notebook small and useful

This website intentionally does **not** need quarterly financial-data updates. The S&P 500 2000–2025 chart and the FY2023–FY2026 company-financial examples are fixed historical lessons, not a rolling feed.

## Publishing checklist

1. Add or edit content in plain HTML/CSS/JavaScript, keeping the site's cream/green student-made design and keyboard accessibility.
2. Make sure navigation, link previews, canonical URLs and sitemap stay consistent.
3. Run `node scripts/validate-site.mjs` (automatic in GitHub Actions).
4. Run `node scripts/browser-smoke.mjs` with Playwright and Chromium, or review the browser workflow result in GitHub Actions.
5. Check mobile layouts, focus states, calculator input errors, form resets, note saving and exported CSV/Markdown.
6. If a page describes historical numbers, say exactly which period it represents. Never imply numbers are live/current.
7. Make sure GitHub Pages deployment succeeds, then test the public website in a normal browser.

## User-facing features to watch

- Mobile nav: expands with the Menu button, closes on outside click and Escape, and remains visible without JavaScript.
- Quiz: answer seven questions, get feedback, retry, optionally copy a score+link message. The quiz step is marked complete in the browser's learning path.
- Research Lab: deep link by `?company=aapl|msft|ko&tab=overview|comparison|checklist|notes`; checklists and notes are saved per company in the visitor's browser.
- Watchlist: exported CSV must round-trip through Import; preserve existing notes and skip duplicates/invalid symbols.
- Glossary: search and category filters run locally and show an empty state when nothing matches.
- Share features never transmit private notes or quiz answers to a server.

## Future improvements

Further work should focus on usability, clearer learning content, more exercises, and accessibility—not manual earnings or 13F updates. Visitor analytics remain off until an appropriate privacy-conscious provider is selected and configured. If analytics are added, disclose their data collection clearly.
