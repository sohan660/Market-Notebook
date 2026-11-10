# Low-maintenance website development

Market Notebook intentionally does not track current investor holdings or current financial figures.

## No scheduled content updates

- Investor Principles is evergreen: no 13F filing refreshes.
- Research Lab uses fixed historical FY2023–2026 case-study figures with source links, labeled as historical. New earnings do not require changes.
- The S&P 500 2000–2025 chart is an intentionally fixed historical window, not an annually refreshed feed.
- User notes, watchlists and progress exist only in each visitor's browser.

## When you improve the website

1. Keep navigation and SEO tags consistent across all six pages.
2. Be explicit about historical, hypothetical, and externally provided live data.
3. Run: node scripts/validate-site.mjs
4. Use the automatic GitHub Actions checks for push/pull-request regression testing.
5. Test small and large screens, keyboard controls, reload persistence and CSV/Markdown downloads.
6. If adding new external sources, link to them rather than copying current numbers.
7. Confirm GitHub Pages deployment succeeded before promoting changes.

Features to consider later: watchlist CSV import, new evergreen practice exercises, accessibility improvements, faster loading, and more useful peer-sharing options. Avoid new recurrent data-update obligations unless there is a sustainable automated data feed.
