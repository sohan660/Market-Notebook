# Your First Share

**A beginner's guide to stocks and ETFs, created as a student project by Sohan Shrestha.**

Live site: https://sohan660.github.io/beginnerinvestmentguide/

I started this project while exploring finance and wealth management at Franklin & Marshall College. The goal is to give other students a place to learn basic investing terms and read financial data without feeling pushed into a particular stock.

## What's on the site

- **Home (index.html)** — where to start, with a clearly labeled, hypothetical $25/week illustration.
- **Investing 101 (start.html)** — stocks, ETFs, account basics, risk, an ETF research checklist, interactive calculator, and a three-question quiz.
- **Charts & Data (charts.html)** — a hypothetical contribution model, actual 2019–2025 annual Berkshire Hathaway/S&P 500 returns, and the SEC's educational example of how fees affect long-term results.
- **Investor Research (investors.html)** — Warren Buffett, Bill Ackman, George Soros, John Bogle, plus a chart of disclosed 13F portfolio concentration. Data are dated and attributed.
- **About (about.html)** — education, LaGuardia Business Services research, IRS VITA/TCE certification, and a link to LinkedIn.

## How to keep the facts straight

There is no stock-price API. This site is not a live market-data service.

The numbers fall into two categories:

1. **Historical:** Berkshire's published 2025 annual report; GuruFocus snapshots of 2026 quarterly Form 13F filings. A 13F position value isn't a manager's profit, total holdings, or a recommendation. Filing dates and portfolio dates can differ.
2. **Hypothetical:** $25/week examples and the $100k-to-$1m calculator, which assume fixed returns rather than predicting markets. The SEC fee illustration is also hypothetical and is directly labeled as such.

Primary references:

- [Berkshire Hathaway 2025 Annual Report, pp. 19–20](https://berkshirehathaway.com/2025ar/2025ar.pdf)
- [SEC Investor.gov: Understanding Fees](https://www.investor.gov/introduction-investing/getting-started/understanding-fees)
- [SEC Investor.gov: ETFs](https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-2)
- [SEC: FAQ about Form 13F](https://www.sec.gov/rules-regulations/staff-guidance/frequently-asked-questions-about-form-13f)
- [GuruFocus investor profiles](https://www.gurufocus.com/guru/list)
- [Vanguard: the history of index investing](https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/50-years-50-facts-indexing-since-1976.html)

Before adding new figures, verify the source and put the **date, metric and assumptions next to the chart**.

## Editing and publishing

All pages are plain HTML/CSS/JavaScript. There is no build step, database, account signup, tracker, or API key. You can make changes with GitHub's file editor.

styles.css controls the design. script.js controls the two calculators and quiz. logo.svg and favicon.svg are the rising-candlestick icon.

GitHub Pages deploys from main / (root) under **Settings → Pages**.

Before sharing widely, review the first-person biography and the financial descriptions yourself, and confirm the live site opens correctly on your phone.

_Independent student education project. Not personalized investing, legal, or tax advice. Not endorsed by GuruFocus or any featured investor._
