# Market Notebook

**Learn what you are buying. Then decide for yourself.**

Visit: https://sohan660.github.io/Market-Notebook/

Market Notebook is a free investing education project made by a student at Franklin & Marshall College. It deliberately avoids live market-data feeds and ongoing SEC filing updates.

## Pages

- **Home (index.html):** introduction and a fixed historical S&P 500 returns chart for 2000–2025.
- **Investing 101 (start.html):** basics, risk, ETF fees, compounding calculators, a quiz and a locally saved learning path.
- **Investor Principles (investors.html):** evergreen lessons about understanding businesses, diversification, costs and patience; no current investor holdings or Form 13F tracking.
- **Research Lab (research.html):** fixed historical financial case studies: Apple and Microsoft FY2024–2026, Coca-Cola FY2023–2025. Practice margin calculations, comparisons, a locally saved company-specific checklist, and exportable notes. **Not current market analysis.**
- **Watchlist (watchlist.html):** up to 25 tickers with editable research notes, CSV export and external quote/chart links. The website checks ticker formatting but does not verify existence or fetch prices.
- **About (about.html):** creator background and LinkedIn.

## No routine filing/data updates required

The S&P 500 2000–2025 series is a deliberately bounded historical lesson, not a continuously growing chart. The Research Lab's dated source reports are **permanent historical examples**; newer earnings are not meant to be incorporated. Current quotes belong on the external websites linked from the watchlist. No ongoing 13F holdings, live feeds, or automatic data refresh deadlines exist on this website.

Future updates can focus on better learning experiences, design and accessibility rather than copying earnings releases. Readers must check more recent primary sources before making investment decisions.

## Browser-only features and privacy

Research checklists, research notes, investing lessons progress and watchlists use browser localStorage. Research notes can be exported to Markdown and the watchlist to CSV. There are no accounts or cloud sync; clearing browser data may erase saved work.

## Technical organization

Static HTML/CSS/vanilla JavaScript, deployed from main via GitHub Pages. No build, paid API or user account required.

- styles.css + site.css: global design
- research.css + features.css: Research Lab and newer tools
- script.js: bounded historical market charts, calculators and quiz
- research-data.js: **frozen historical** company data with source links
- research-notes.js: per-company notes
- learning-path.js: learning progress
- watchlist.js: editable watchlist and CSV export
- share.js: homepage copy-link action
- sitemap.xml + social-preview.png: search discovery and link previews

Maintenance checklist: [docs/MAINTENANCE.md](docs/MAINTENANCE.md).

Validate the site with: node scripts/validate-site.mjs

An automated GitHub Actions workflow runs the same validation on pushes and pull requests.

## Sources and disclaimer

Historical examples link to original company reports. Additional learning material: https://www.investor.gov/introduction-investing/investing-basics

This project is independent, educational, not affiliated with the referenced companies, and not personalized investment advice. Market prices fluctuate and past results do not predict future returns.

© 2026 Sohan Shrestha.
