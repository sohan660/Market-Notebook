# Market Notebook

**Learn what you're buying. Then decide for yourself.**

[Visit the website](https://sohan660.github.io/Market-Notebook/)

Market Notebook is a small, independent investing education website made by a Franklin & Marshall student. It's free, uses plain HTML/CSS/JavaScript, and intentionally avoids live stock feeds or recurring filing updates.

## Explore

- **Home:** an introduction to the project, bounded historical S&P 500 returns (2000–2025) and an easy way to share the site.
- **Investing 101:** stocks, ETFs, risk, fees, compounding calculators and a seven-question quiz with explanations, retry, locally saved personal best and a copyable result. The learning path is saved in your browser.
- **Investor Principles:** evergreen lessons about understanding businesses, costs, risk, and patience. No current 13F tracker.
- **Research Lab:** fixed historical financial case studies for Apple and Microsoft FY2024–2026 and Coca-Cola FY2023–2025. Compare reports, save per-company checklists, write and export notes, or copy a link to a particular company/tab (for example, [Microsoft notes](https://sohan660.github.io/Market-Notebook/research.html?company=msft&tab=notes)).
- **Watchlist:** save up to 25 ticker bookmarks and notes, edit them, export a CSV, and import a CSV to restore saved symbols in another browser. External quote links are provided; the website **does not retrieve or verify live prices or listed tickers**.
- **Glossary:** 29 searchable beginner-friendly financial terms with category filters.
- **About:** why I made the website, what I've learned so far, and how to get in touch.

## November 2026 design refresh

This version keeps Market Notebook small and personal, with a more readable homepage, updated student-made typography and paper-like accents, and a clear showcase for the quiz, glossary, and Research Lab.

The **About** page now explains the project goals, HTML/CSS/JavaScript choices, historical research, and GitHub Pages testing process. Feedback is available in the footer of every public page and on the homepage/Contact section. Suggestions go to public GitHub Issues (a GitHub login is required); LinkedIn is an alternate contact option. There is no data-collection form or visitor-tracking script.

The homepage now has clearer Open Graph sharing copy for previews on LinkedIn and other platforms. The existing social card image is still `social-preview.png`.

### LinkedIn-ready screenshots

On every successful GitHub Actions browser test, the `market-notebook-preview` artifact provides four PNG screenshots:

- `market-notebook-home-desktop.png` — first screen of the homepage at desktop size.
- `market-notebook-features.png` — the three featured learning tools.
- `market-notebook-home-mobile.png` — the top of the homepage on mobile.
- `market-notebook-about.png` — the student project story.

Open the latest successful **Validate website** workflow under GitHub Actions, download the `market-notebook-preview` artifact ZIP, and choose the images you want to use in a social post. These screenshots show the website and are not endorsements or performance claims.

## Built to stay useful without frequent updates

The historical market series and company-financial examples are deliberately frozen and clearly identified as teaching cases, **not current research or forecasts**. This project has no earnings-feed updater, current investor holdings chart, scheduled source-refresh deadline, account system, or paid API.

## Privacy and saving work

Watchlists, Research Lab checklists/notes, quiz personal bests and learning-path progress use browser localStorage. This means data is not automatically uploaded, shared, or synced to a different device. Clearing site data can delete it. Export CSV or Markdown files when you want a backup.

Quiz result sharing copies a short score-and-link message; it **does not publish a leaderboard or send scores to a server**. The glossary search runs locally. No third-party visitor analytics have been enabled, because that would require selecting and configuring a provider with a suitable privacy policy.

## Structure

| File | Purpose |
| --- | --- |
| index.html, start.html, investors.html, research.html, watchlist.html, glossary.html, about.html | Public pages |
| styles.css, site.css, features.css, research.css, enhancements.css, refresh.css | Visual styles |
| script.js | Fixed historic charts and calculators |
| nav.js | Accessible mobile navigation |
| quiz.js | Question bank, scoring, feedback and score sharing |
| glossary.js | Local search and filters |
| research-data.js | Fixed sourced historical financial case studies |
| research-notes.js | Saved research notes and export |
| learning-path.js | Lesson progress |
| watchlist.js | Bookmarks, note editing, CSV import/export |
| share.js | Homepage copy-link action |
| scripts/validate-site.mjs | Static checks |
| scripts/browser-smoke.mjs | Real Chromium browser interaction checks |
| .github/workflows/validate.yml | Automated static + browser tests on push/PR |

## Testing

Static site checks use Node (no package installation):

```bash
node scripts/validate-site.mjs
```

To run browser tests locally, install the pinned Playwright version and Chromium, then run the script:

```bash
npm install --no-save playwright@1.56.1
npx playwright install chromium
node scripts/browser-smoke.mjs
```

GitHub Actions runs both static validation and browser smoke tests automatically on pushes and pull requests. See [maintenance notes](docs/MAINTENANCE.md) for the small number of things worth checking after a redesign.

## Data and disclaimer

Historical company information links to original source reports. For general learning material, see [Investor.gov](https://www.investor.gov/introduction-investing/investing-basics). The site is independent and educational, is not endorsed by the referenced companies and does not give personalized investment advice. Investments can lose value.

© 2026 Sohan Shrestha.
