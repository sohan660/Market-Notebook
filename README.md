# Market Notebook

**Stocks, ETFs, and market data explained by a college student.**

A free, independently written investing guide by Sohan Shrestha, a first-year student at Franklin & Marshall College.

**Website:** https://sohan660.github.io/Market-Notebook/

## What you can learn

This is an educational project for students who want to understand investing without being told what to buy.

- **Home — `index.html`:** introduction and an interactive chart of S&P 500 annual total returns from 2000–2025.
- **Investing 101 — `start.html`:** stocks, ETFs, risk, fund fees, account basics, historical charts, two hypothetical calculators, and a five-question quiz.
- **Investor research — `investors.html`:** Berkshire Hathaway/Warren Buffett, Pershing Square/Bill Ackman, Soros Fund Management, and John Bogle. Includes historical returns and dated Form 13F holdings visualizations.
- **Research Lab — `research.html`:** reported company annual financials with source links, fiscal dates, comparison charts and a research checklist; not live quotes.
- **About Sohan — `about.html`:** education, research experience, interests, and a LinkedIn contact link.

Charts and quiz logic live in `script.js`; visual styling lives in `styles.css`. The current logo and browser favicon are `logo.svg` and `favicon.svg`.

## Important notes about the numbers

- The market return charts use **historical calendar-year data through 2025**, not live prices.
- The $10,000 S&P 500 illustration applies those historical annual index returns to a hypothetical starting balance. It assumes dividend reinvestment and excludes fees and taxes.
- The long-term growth and fee calculators assume fixed returns. **They are examples, not forecasts or promises.**
- Form 13F data covers certain reportable securities positions at a quarter end, with disclosure delays; **portfolio value does not mean personal wealth, profit, or total firm assets.** The current holdings examples are snapshots from June 30, 2026, not live positions.

### Sources to consult

- [S&P Dow Jones Indices: annual returns and market commentary](https://www.spglobal.com/spdji/en/commentary/article/us-equities-market-attributes)
- [Berkshire Hathaway's 2025 annual report](https://berkshirehathaway.com/2025ar/2025ar.pdf)
- [SEC: Form 13F FAQ](https://www.sec.gov/rules-regulations/staff-guidance/frequently-asked-questions-about-form-13f)
- [SEC Investor.gov: ETFs](https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-2)
- [Investment Company Institute: 2025 fund fees](https://www.ici.org/news-release/mutual-fund-and-etf-fees-remained-near-historic-lows-in-2025)
- [GuruFocus investor directory](https://www.gurufocus.com/guru/list)

## Editing

This is a static site built with HTML, CSS and plain JavaScript. It requires no server, sign-in, build system, API token, or stock market API.

On GitHub, edit the desired file on the `main` branch and commit the change. GitHub Pages deploys the repository root. You can inspect deployment status in **Actions**.

The repository is `Market-Notebook`; the GitHub Pages URL is https://sohan660.github.io/Market-Notebook/.

## About this project

Created for learning, not for personalized financial or tax advice. Public-data examples may become outdated, and investing involves possible losses. This project is not affiliated with or endorsed by the investors, firms, or data publishers mentioned.

© 2026 Sohan Shrestha.

## Research Lab data

research-data.js stores reported GAAP annual revenue and net income in USD millions and diluted EPS in USD/share. Every year has a period-end date and source index. Snapshot checked November 8, 2026: Apple and Microsoft FY2024–2026; Coca-Cola FY2023–2025. Apple figures come from unaudited earnings statements; Microsoft and Coca-Cola from annual reports. Updates are manual; no live quotes or quarterly refresh is configured.

To update, verify the original report, add the annual values and exact period end with a source link, update the checked date and visible snapshot text, and test the chart and comparison years. Preserve past years used by comparisons. Net margin and revenue growth are calculated from the stored values. P/E has been replaced by reported diluted EPS because no dated stock-price feed is connected.

## Maintenance and validation

See [the data review procedure](docs/DATA-UPDATES.md) for source checks, refresh steps and the November 2026 audit. Run node scripts/validate-site.mjs before publishing. Research Lab and Investor Playbook show review dates and turn the notice amber when a review is overdue. These reminders do not automatically refresh financial figures.

Shared navigation, footer, typography and responsive refinements live in site.css. Investing 101 and Investor Playbook include section navigation. Browser rendering still requires the manual viewport checks listed in the procedure.
