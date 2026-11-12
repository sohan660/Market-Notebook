/* Market Notebook: charts, calculators, quiz. Historical periods are fixed educational examples, not a live market feed. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const usd = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const pct = v => (v > 0 ? '+' : v < 0 ? '\u2212' : '') + Math.abs(v).toFixed(1) + '%';
  const NS = 'http://www.w3.org/2000/svg';

  /* S&P 500 total return (dividends reinvested), calendar years. Source: SmartAsset's table; 2023-2025 cross-checked. */
  const SP = {2000:-9.10,2001:-11.89,2002:-22.10,2003:28.68,2004:10.88,2005:4.91,2006:15.79,2007:5.49,2008:-37.00,2009:26.46,2010:15.06,2011:2.11,2012:16.00,2013:32.39,2014:13.69,2015:1.38,2016:11.96,2017:21.83,2018:-4.38,2019:31.49,2020:18.40,2021:28.71,2022:-18.11,2023:26.29,2024:25.02,2025:17.88};

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
    let selected = n - 1;
    const show = i => { selected = i; g.setAttribute('x1', x(i)); g.setAttribute('x2', x(i)); g.setAttribute('visibility', 'visible'); if (ro) ro.textContent = o.x[i] + ': ' + o.series.map(se => se.name + ' ' + usd(se.vals[i])).join(' \u00b7 '); };
    const mv = e => { const p = s.getBoundingClientRect(), px = (e.clientX - p.left) / p.width * W; show(Math.max(0, Math.min(n - 1, Math.round((px - L) / (W - L - 10) * (n - 1))))); };
    s.setAttribute('role', 'group');
    ov.setAttribute('tabindex', '0');
    ov.setAttribute('role', 'slider');
    ov.setAttribute('aria-label', 'Chart year. Use left and right arrow keys to explore.');
    ov.setAttribute('aria-valuemin', '0');
    ov.setAttribute('aria-valuemax', String(n - 1));
    const describe = () => { ov.setAttribute('aria-valuenow', String(selected)); ov.setAttribute('aria-valuetext', ro ? ro.textContent : o.x[selected]); };
    const update = e => { mv(e); describe(); };
    ov.addEventListener('pointermove', update); ov.addEventListener('pointerdown', update);
    ov.addEventListener('focus', () => { show(selected); describe(); });
    ov.addEventListener('keydown', e => {
      let i = selected;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') i++;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') i--;
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = n - 1;
      else return;
      e.preventDefault(); show(Math.max(0, Math.min(n - 1, i))); describe();
    });
    show(selected); describe();
    const pl = $('.plot', box); pl.innerHTML = ''; pl.appendChild(s);
    legend(box, o.series.map(x => [x.name, x.color]));
  }

  const yrs = Object.keys(SP);
  const CH = {
    sp: b => bars(b, { labels: yrs, sign: 1, series: [{ name: 'S&P 500', vals: yrs.map(k => SP[k]) }], aria: 'Bar chart of S&P 500 total return for each year from 2000 to 2025' }),
    ten: b => { let v = 1e4; const x = ['1999'], a = [v]; yrs.forEach(k => { v *= 1 + SP[k] / 100; x.push(k); a.push(v); }); const t = $('#tenEnd'); if (t) t.textContent = usd(v); lines(b, { x, every: 5, series: [{ name: '$10,000 in the S&P 500', vals: a, color: '#2457c5' }], aria: 'Line chart of $10,000 invested in the S&P 500 at the end of 1999' }); },


  };
  document.querySelectorAll('[data-chart]').forEach(b => { try { CH[b.dataset.chart](b); } catch (e) { console.error(e); } });

  /* Calculators. Monthly compounding, contributions at month-end, no fees/taxes/inflation unless a fee is chosen. */
  function grow(i, m, y, r) { const q = r / 1200; let b = i, c = i; const B = [b], K = [c]; for (let k = 1; k <= y * 12; k++) { b = b * (1 + q) + m; c += m; if (k % 12 === 0) { B.push(b); K.push(c); } } return [B, K]; }
  function num(id) {
    const input = $('#' + id), value = Number(input.value);
    const valid = input.value.trim() !== '' && Number.isFinite(value) && value >= 0 && value <= 1e9;
    input.setCustomValidity(valid ? '' : 'Enter an amount from 0 to 1,000,000,000.');
    input.setAttribute('aria-invalid', String(!valid));
    return valid ? value : null;
  }
  function amountsValid(ids, chartId, outputs) {
    const valid = ids.map(num).every(v => v !== null), chart = $('#' + chartId);
    let message = chart.parentElement.querySelector('.calc-error');
    if (!message) { message = document.createElement('p'); message.className = 'calc-error'; message.setAttribute('role', 'status'); chart.before(message); }
    message.textContent = valid ? '' : 'Enter valid amounts from $0 to $1,000,000,000 to calculate.';
    chart.hidden = !valid;
    if (!valid) outputs.forEach(id => { $('#' + id).textContent = '—'; });
    return valid;
  }
  const yl = a => a.map((_, k) => 'Yr ' + k);

  function calcGrow() {
    if (!amountsValid(['initial', 'monthly'], 'growChart', ['total', 'contributed', 'growth'])) return;
    const y = +$('#period').value, r = +$('#assumed').value, g = grow(num('initial'), num('monthly'), y, r), B = g[0], K = g[1];
    $('#total').textContent = usd(B[y]); $('#contributed').textContent = usd(K[y]); $('#growth').textContent = usd(B[y] - K[y]);
    lines($('#growChart'), { x: yl(B), every: Math.max(1, Math.round(y / 5)), series: [{ name: 'Your balance', vals: B, color: '#2457c5' }, { name: 'What you put in', vals: K, color: '#8a8f98', dash: '5 4' }], aria: 'Line chart of a hypothetical balance versus total contributions' });
  }
  function calcFee() {
    if (!amountsValid(['fInit', 'fMonthly'], 'feeChart', ['fLow', 'fHigh', 'fDiff'])) return;
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
