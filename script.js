/* Market Notebook: charts, calculators, quiz.
   To update the data, edit the numbers below. Everything is plain JS, no libraries. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const usd = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const pct = v => (v > 0 ? '+' : v < 0 ? '\u2212' : '') + Math.abs(v).toFixed(1) + '%';
  const NS = 'http://www.w3.org/2000/svg';

  /* S&P 500 total return (dividends reinvested), calendar years. Source: SmartAsset's table; 2023-2025 cross-checked. */
  const SP = {2000:-9.10,2001:-11.89,2002:-22.10,2003:28.68,2004:10.88,2005:4.91,2006:15.79,2007:5.49,2008:-37.00,2009:26.46,2010:15.06,2011:2.11,2012:16.00,2013:32.39,2014:13.69,2015:1.38,2016:11.96,2017:21.83,2018:-4.38,2019:31.49,2020:18.40,2021:28.71,2022:-18.11,2023:26.29,2024:25.02,2025:17.88};
  /* Berkshire vs S&P 500, per Berkshire's reported figures as published by The Motley Fool (rounded to 0.1). */
  const BRK = {2015:-12.5,2016:23.4,2017:21.9,2018:2.8,2019:11.0,2020:2.4,2021:29.6,2022:4.0,2023:15.8,2024:25.5,2025:10.9};
  const SPB = {2015:1.4,2016:12.0,2017:21.8,2018:-4.4,2019:31.5,2020:18.4,2021:28.7,2022:-18.1,2023:26.3,2024:25.0,2025:17.9};

  function svg(w, h, label) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 ' + w + ' ' + h); s.setAttribute('role', 'img'); s.setAttribute('aria-label', label || 'Chart'); return s; }
  function el(p, t, a, txt) { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; p.appendChild(e); return e; }
  const short = v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? Math.round(v / 1e3) + 'k' : String(Math.round(v));
  function legend(box, items) { const l = $('.legend', box); if (l) l.innerHTML = items.map(i => '<span><i style="background:' + i[1] + '"></i>' + i[0] + '</span>').join(''); }

  function bars(box, o) {
    const W = 760, H = 270, L = 36, T = 12, B = 24, n = o.labels.length, all = o.series.flatMap(s => s.vals);
    const mn = Math.min(0, Math.floor(Math.min(...all) / 10) * 10), mx = Math.ceil(Math.max(...all) / 10) * 10;
    const y = v => T + (mx - v) / (mx - mn) * (H - T - B), step = (W - L) / n, gw = step * 0.78, bw = gw / o.series.length;
    const s = svg(W, H, o.aria), ro = $('.readout', box);
    s.setAttribute('role', 'group');
    for (let v = mn; v <= mx; v += 10) { el(s, 'line', { x1: L, x2: W, y1: y(v), y2: y(v), stroke: v ? '#eee7d6' : '#1f2430' }); el(s, 'text', { x: L - 5, y: y(v) + 4, 'text-anchor': 'end' }, v + '%'); }
    o.labels.forEach((lb, i) => {
      if (n < 14 || i % 5 === 0) el(s, 'text', { x: L + step * i + step / 2, y: H - 6, 'text-anchor': 'middle' }, lb);
      o.series.forEach((se, j) => {
        const v = se.vals[i];
        const r = el(s, 'rect', { x: L + step * i + (step - gw) / 2 + bw * j, y: Math.min(y(0), y(v)), width: bw - 1, height: Math.abs(y(v) - y(0)) || 1, fill: o.sign ? (v < 0 ? '#d9480f' : '#2457c5') : se.color });
        const say = () => { if (ro) ro.textContent = lb + (o.series.length > 1 ? ' \u00b7 ' + se.name : '') + ': ' + pct(v); };
        r.setAttribute('tabindex', '0');
        r.setAttribute('role', 'button');
        r.setAttribute('aria-label', lb + (o.series.length > 1 ? ', ' + se.name : '') + ': ' + pct(v));
        r.addEventListener('mouseenter', say);
        r.addEventListener('focus', say);
        r.addEventListener('click', say);
        r.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); say(); }
        });
      });
    });
    const pl = $('.plot', box); pl.innerHTML = ''; pl.appendChild(s);
    legend(box, o.sign ? [['Up year', '#2457c5'], ['Down year', '#d9480f']] : o.series.map(x => [x.name, x.color]));
    const tb = $('.tbl', box);
    if (tb) tb.innerHTML = '<table><tr><th>Year</th>' + o.series.map(x => '<th>' + x.name + '</th>').join('') + '</tr>' + o.labels.map((lb, i) => '<tr><td>' + lb + '</td>' + o.series.map(x => '<td>' + pct(x.vals[i]) + '</td>').join('') + '</tr>').join('') + '</table>';
  }

  function lines(box, o) {
    const W = 760, H = 270, L = 56, T = 12, B = 24, n = o.x.length;
    const all = o.series.flatMap(s => s.vals).concat(o.hline || []), mx = Math.max(...all, 1) * 1.05;
    const x = i => L + (W - L - 10) * i / (n - 1), y = v => T + (1 - v / mx) * (H - T - B);
    const s = svg(W, H, o.aria), ro = $('.readout', box);
    for (let k = 0; k <= 4; k++) { const v = mx * k / 4; el(s, 'line', { x1: L, x2: W, y1: y(v), y2: y(v), stroke: '#eee7d6' }); el(s, 'text', { x: L - 5, y: y(v) + 4, 'text-anchor': 'end' }, '$' + short(v)); }
    o.x.forEach((lb, i) => { if (i % o.every === 0) el(s, 'text', { x: x(i), y: H - 6, 'text-anchor': 'middle' }, lb); });
    if (o.hline) { el(s, 'line', { x1: L, x2: W, y1: y(o.hline), y2: y(o.hline), stroke: '#d9480f', 'stroke-dasharray': '5 4' }); el(s, 'text', { x: L + 4, y: y(o.hline) - 5, style: 'fill:#d9480f' }, o.hlabel); }
    o.series.forEach(se => el(s, 'polyline', { points: se.vals.map((v, i) => x(i) + ',' + y(v)).join(' '), fill: 'none', stroke: se.color, 'stroke-width': 2.5, 'stroke-dasharray': se.dash || '' }));
    const g = el(s, 'line', { y1: T, y2: H - B, stroke: '#999', visibility: 'hidden' });
    const ov = el(s, 'rect', { x: L, y: T, width: W - L, height: H - T - B, fill: 'transparent' });
    const mv = e => { const p = s.getBoundingClientRect(), px = (e.clientX - p.left) / p.width * W, i = Math.max(0, Math.min(n - 1, Math.round((px - L) / (W - L - 10) * (n - 1)))); g.setAttribute('x1', x(i)); g.setAttribute('x2', x(i)); g.setAttribute('visibility', 'visible'); if (ro) ro.textContent = o.x[i] + ': ' + o.series.map(se => se.name + ' ' + usd(se.vals[i])).join(' \u00b7 '); };
    ov.addEventListener('pointermove', mv); ov.addEventListener('pointerdown', mv);
    const pl = $('.plot', box); pl.innerHTML = ''; pl.appendChild(s);
    legend(box, o.series.map(x => [x.name, x.color]));
  }

  function hbars(box, items, max, fmt) {
    $('.plot', box).innerHTML = items.map(i => '<div class="hb"><span>' + i.l + '</span><div class="tr"><i style="width:' + Math.max(1, i.v / max * 100) + '%;background:' + (i.c || '#2457c5') + '"></i></div><b>' + fmt(i.v) + '</b></div>').join('');
  }

  const yrs = Object.keys(SP);
  const CH = {
    sp: b => bars(b, { labels: yrs, sign: 1, series: [{ name: 'S&P 500', vals: yrs.map(k => SP[k]) }], aria: 'Bar chart of S&P 500 total return for each year from 2000 to 2025' }),
    ten: b => { let v = 1e4; const x = ['1999'], a = [v]; yrs.forEach(k => { v *= 1 + SP[k] / 100; x.push(k); a.push(v); }); const t = $('#tenEnd'); if (t) t.textContent = usd(v); lines(b, { x, every: 5, series: [{ name: '$10,000 in the S&P 500', vals: a, color: '#2457c5' }], aria: 'Line chart of $10,000 invested in the S&P 500 at the end of 1999' }); },
    brk: b => { const k = Object.keys(BRK); bars(b, { labels: k, series: [{ name: 'Berkshire Hathaway', vals: k.map(y => BRK[y]), color: '#2457c5' }, { name: 'S&P 500', vals: k.map(y => SPB[y]), color: '#f2a900' }], aria: 'Grouped bar chart comparing Berkshire Hathaway and the S&P 500 each year from 2015 to 2025' }); },
    brkLong: b => hbars(b, [{ l: 'Berkshire stock', v: 19.7 }, { l: 'S&P 500', v: 10.5, c: '#f2a900' }], 20, v => v + '%'),
    brkHold: b => { const t = 299.25, top = [['Apple', 65.95], ['American Express', 51.28], ['Alphabet (both classes)', 37.76], ['Coca-Cola', 32.51]], o = t - top.reduce((s, x) => s + x[1], 0); hbars(b, top.map(x => ({ l: x[0], v: x[1] / t * 100 })).concat([{ l: 'Everything else', v: o / t * 100, c: '#bdb5a0' }]), 40, v => v.toFixed(1) + '%'); },
    pshHold: b => hbars(b, [{ l: 'Uber', v: 12.72 }, { l: 'Brookfield', v: 12.58 }, { l: 'Microsoft', v: 11.89 }, { l: 'Other 11 positions', v: 62.81, c: '#bdb5a0' }], 65, v => v.toFixed(1) + '%'),
    size: b => hbars(b, [{ l: 'Berkshire', v: 299.25 }, { l: 'Pershing Square', v: 19.5, c: '#f2a900' }, { l: 'Soros Fund Mgmt', v: 7.6, c: '#d9480f' }], 299.25, v => '$' + v.toFixed(1) + 'B')
  };
  document.querySelectorAll('[data-chart]').forEach(b => { try { CH[b.dataset.chart](b); } catch (e) { console.error(e); } });

  /* Calculators. Monthly compounding, contributions at month-end, no fees/taxes/inflation unless a fee is chosen. */
  function grow(i, m, y, r) { const q = r / 1200; let b = i, c = i; const B = [b], K = [c]; for (let k = 1; k <= y * 12; k++) { b = b * (1 + q) + m; c += m; if (k % 12 === 0) { B.push(b); K.push(c); } } return [B, K]; }
  const num = id => Math.max(0, +$('#' + id).value || 0);
  const yl = a => a.map((_, k) => 'Yr ' + k);

  function calcGrow() {
    const y = +$('#period').value, r = +$('#assumed').value, g = grow(num('initial'), num('monthly'), y, r), B = g[0], K = g[1];
    $('#total').textContent = usd(B[y]); $('#contributed').textContent = usd(K[y]); $('#growth').textContent = usd(B[y] - K[y]);
    lines($('#growChart'), { x: yl(B), every: Math.max(1, Math.round(y / 5)), series: [{ name: 'Your balance', vals: B, color: '#2457c5' }, { name: 'What you put in', vals: K, color: '#8a8f98', dash: '5 4' }], aria: 'Line chart of a hypothetical balance versus total contributions' });
  }
  function calcFee() {
    const y = +$('#fYears').value, gr = +$('#fGross').value, f = +$('#fFee').value, i = num('fInit'), m = num('fMonthly');
    const lo = grow(i, m, y, gr - 0.03)[0], hi = grow(i, m, y, gr - f)[0];
    $('#fLow').textContent = usd(lo[y]); $('#fHigh').textContent = usd(hi[y]); $('#fDiff').textContent = usd(lo[y] - hi[y]);
    lines($('#feeChart'), { x: yl(lo), every: 5, series: [{ name: '0.03% fee', vals: lo, color: '#2457c5' }, { name: f.toFixed(2) + '% fee', vals: hi, color: '#d9480f' }], aria: 'Line chart comparing a 0.03 percent fee with the chosen fee' });
  }
  function calcMil() {
    const r = +$('#millionRate').value / 100; let b = 1e5, n = 0; const B = [b];
    while (b < 1e6 && n < 200) { b *= 1 + r; n++; B.push(b); }
    $('#millionYears').textContent = 'Year ' + n; $('#millionValue').textContent = usd(b);
    $('#millionDetail').textContent = 'At ' + (r * 100) + '% a year, $100,000 first tops $1 million in year ' + n + ', with no new deposits and no down years.';
    lines($('#milChart'), { x: yl(B), every: Math.max(1, Math.round(n / 6)), series: [{ name: 'Balance', vals: B, color: '#2457c5' }], hline: 1e6, hlabel: '$1 million', aria: 'Line chart of $100,000 growing toward $1 million' });
  }
  [[calcGrow, ['initial', 'monthly', 'period', 'assumed']], [calcFee, ['fInit', 'fMonthly', 'fYears', 'fGross', 'fFee']], [calcMil, ['millionRate']]].forEach(p => {
    try { if (!$('#' + p[1][0])) return; p[1].forEach(id => $('#' + id).addEventListener('input', p[0])); p[0](); } catch (e) { console.error(e); }
  });

  /* Quiz */
  const Q = [
    ['Which is more likely to hold lots of different companies?', ['One individual stock', 'A broad stock ETF'], 1, 'A broad ETF is a basket. One stock is one company.'],
    ['Diversification guarantees you will not lose money.', ['True', 'False'], 1, 'It spreads risk around, but a whole market can still fall (the S&P 500 lost 37% in 2008).'],
    ['Why look at an ETF\u2019s expense ratio?', ['Ongoing costs eat into your returns', 'It predicts the fund\u2019s future return'], 0, 'The fee comes out every year, so it compounds against you. It says nothing about future returns.'],
    ['Since 2000, in how many calendar years was the S&P 500 down (total return, through 2025)?', ['2', '6', '12'], 1, 'Six: 2000, 2001, 2002, 2008, 2018 and 2022.'],
    ['A 13F filing shows...', ['Everything a fund owns, in real time', 'Long U.S. stock positions at quarter-end, filed up to 45 days later'], 1, 'It is a delayed snapshot. It leaves out cash, most shorts and a lot more.']
  ];
  const qz = $('#quiz');
  if (qz) {
    qz.insertAdjacentHTML('afterbegin', Q.map((q, i) => '<div class="q"><b>' + (i + 1) + '. ' + q[0] + '</b>' + q[1].map((o, j) => '<label><input type="radio" name="q' + i + '" value="' + j + '">' + o + '</label>').join('') + '<div class="small" id="fb' + i + '"></div></div>').join(''));
    qz.addEventListener('submit', e => {
      e.preventDefault(); let s = 0, a = 0;
      Q.forEach((q, i) => { const c = qz.querySelector('input[name=q' + i + ']:checked'), f = $('#fb' + i); if (!c) { f.textContent = ''; return; } a++; const ok = +c.value === q[2]; if (ok) s++; f.className = 'small ' + (ok ? 'ok' : 'bad'); f.textContent = (ok ? 'Right. ' : 'Not quite. ') + q[3]; });
      $('#score').textContent = a ? s + ' of ' + Q.length + ' right' : 'Pick an answer first.';
    });
  }

  /* Button feedback for mouse, touch, and keyboard; navigation is never delayed. */
  const tapSelector = '.btn, .home-button, .home-lesson';
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('pointerdown', e => {
    const el = e.target.closest(tapSelector);
    if (!el || el.matches(':disabled, [aria-disabled="true"]')) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty('--tap-x', ((e.clientX - box.left) / box.width * 100) + '%');
    el.style.setProperty('--tap-y', ((e.clientY - box.top) / box.height * 100) + '%');
    el.classList.add('is-pressed');
  });
  const releaseTap = () => document.querySelectorAll('.is-pressed').forEach(el => el.classList.remove('is-pressed'));
  document.addEventListener('pointerup', releaseTap);
  document.addEventListener('pointercancel', releaseTap);
  window.addEventListener('blur', releaseTap);
  document.addEventListener('click', e => {
    const el = e.target.closest(tapSelector);
    if (!el || el.matches(':disabled, [aria-disabled="true"]') || (reducedMotion && reducedMotion.matches)) return;
    if (e.detail === 0) {
      el.style.setProperty('--tap-x', '50%');
      el.style.setProperty('--tap-y', '50%');
    }
    el.classList.remove('tap-pop');
    void el.offsetWidth; // restart the ripple on repeated presses
    el.classList.add('tap-pop');
  });
  document.addEventListener('animationend', e => {
    if (e.animationName === 'notebook-tap-ripple') e.target.classList.remove('tap-pop');
  });
})();
