# Financial data review
Review Research Lab monthly and after annual earnings; review holdings after each quarterly 13F filing season. The dates in research-data.js and investor-data.js drive the on-page reminder. The reminder turns amber on the due date. No background data refresh is configured.

## Repeatable update procedure
1. Read each original company report or SEC filing linked in the dataset. Check the company/CIK, period end, filing date, amendment status, units and GAAP basis.
2. For annual results, edit research-data.js. Store revenue and shareholder net income in USD millions, diluted EPS in USD/share, exact fiscal end and the source index. Preserve comparison years available for all companies. Add new comparison-year options only when all three companies have that year.
3. For holdings, edit investor-data.js. Use the 13F summary's full reported USD total, including every instrument type, and its filing-row count. Aggregate duplicate security rows for selected holdings; combine Alphabet classes only when explicitly labeled. Never mix totals excluding options with full filing totals.
4. Update related page captions, prose, fiscal ranges and any static no-JavaScript values. Run a search for the old date/year/value to catch duplicates.
5. Only after checking the source, set checkedOn to the actual review date and reviewDue to the next review deadline. Never change checkedOn just to silence an overdue notice.
6. Run: node scripts/validate-site.mjs
7. Open every company and chart, switch comparison years, and inspect exact-value source tables. Review all pages at 320, 375, 768 and 1280 CSS pixels; confirm no page-wide horizontal overflow, visible chart/table scroll, keyboard focus, 44-pixel touch controls, and 200% text zoom.
8. Commit and publish. Verify the GitHub Pages deployment and fetch the changed dataset to confirm the site is serving it.

## Audit completed November 8, 2026
- Berkshire 2025 annual report pages 19–20: 2015–2025 return series and 19.7% / 10.5% compounded gains matched.
- Berkshire Q2 2026 13F: USD 299,253,556,246, 89 filing rows. Selected holdings were summed across manager rows.
- Pershing Square Q2 2026 13F: USD 19,465,692,772, 15 rows representing 14 securities; Howard Hughes occurs twice. Top-three weights are calculated from original USD values.
- Soros Fund Management Q2 2026 13F: USD 8,143,628,824, 266 rows. Replaced the old USD 7.6 billion filtered estimate with the full reported total.
- Removed the unsourced Berkshire cash figure, quarter-over-quarter Alphabet claim, and Soros trade-profit anecdote. Holdings snapshots do not represent current portfolios, total firm assets or personal wealth.
- Exact filing summary and information-table links are stored in investor-data.js and linked beside the charts. Bogle history links to Vanguard.
- Browser/mobile visual QA was unavailable in this session because computer access failed. DOM interaction and static checks do not replace that review.

## Feature update — November 8, 2026
- Apple reported financials now link to the audited FY2026 Form 10-K, filed November 3, 2026. Comparative FY2024–2026 values were retained.
- Research Lab comparison refreshes after a company change while comparing; EPS explanation matches the reported EPS metric. Homepage no longer promises valuation analysis and Research Lab no longer promises debt metrics.
- Research Lab styling has its own CSS file; browser-only notes, learning progress and a watchlist have new JS files. The watchlist links to external quotes; it contains no market-price feed.
- A custom social share PNG and sitemap were added. After deployment verify the social thumbnail, the GitHub Pages URL and Search Console sitemap submission manually.
- Test on phone and desktop: localStorage saves, cross-company note switching, file exports, invalid tickers, keyboard focus, and menu links.
