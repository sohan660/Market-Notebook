import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root=new URL('../',import.meta.url);
const read=file=>fs.readFile(new URL(file,root),'utf8');
const pages=['index.html','start.html','investors.html','research.html','watchlist.html','about.html'];
const scripts=['script.js','research-data.js','learning-path.js','research-notes.js','watchlist.js','share.js'];

const context={window:{}};
vm.runInNewContext(await read('research-data.js'),context);
const study=context.window.MARKET_FINANCIALS;
assert.ok(study?.companies,'Historical financial examples missing');
assert.ok(!('reviewDue' in study),'Historical data should have no review deadline');
for(const company of Object.values(study.companies)){
  const years=new Set();
  for(const row of company.annual){
    assert.ok(Number.isInteger(row.year)&&!years.has(row.year),'Invalid/duplicate year');
    years.add(row.year);
    assert.ok(row.end.startsWith(String(row.year)),'Fiscal end mismatch');
    for(const key of ['revenue','netIncome','eps'])assert.ok(Number.isFinite(row[key]),'Non-numeric financial value');
    assert.ok(row.revenue>0,'Revenue should be positive');
    assert.ok(company.sources[row.source]?.url.startsWith('https://'),'Missing historical report source');
  }
  for(const year of [2024,2025])assert.ok(years.has(year),'Comparison year missing');
}

let links=0;
for(const file of pages){
  const html=await read(file),markup=html.replace(/<script>[\s\S]*?<\/script>/g,'');
  const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,file+': duplicate IDs');
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1,file+': exactly one active nav link needed');
  for(const pattern of ['href="site.css"','property="og:image"','name="twitter:card"','href="watchlist.html"','Investor Principles</a>'])
    assert.ok(html.includes(pattern),file+': missing '+pattern);
  assert.ok(!html.includes('data-status.js')&&!html.includes('investor-data.js'),file+': obsolete live-maintenance script linked');
  for(const m of markup.matchAll(/<(?:a|link|script|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g)){
    const url=m[1];if(/^(https?:|data:|mailto:)/.test(url))continue;
    const [path,hash]=url.split('#');
    await fs.access(new URL(path||file,root));
    if(hash)assert.ok((await read(path||file)).includes('id="'+hash+'"'),file+': broken anchor '+url);
    links++;
  }
  for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:file});
}
for(const file of scripts)new vm.Script(await read(file),{filename:file});
const research=await read('research.html'),watch=await read('watchlist.js'),home=await read('index.html'),investors=await read('investors.html');
assert.ok(research.includes('function loadChecklist()')&&research.includes('localStorage.setItem(checklistKey()'),'Research checklist persistence missing');
assert.ok(watch.includes("kind==='edit'")&&watch.includes("kind==='save'"),'Watchlist editing missing');
assert.ok(home.includes('id="copy-site-link"')&&home.includes('src="share.js"'),'Share link missing');
assert.ok(!investors.includes('13F')&&!investors.includes('MARKET_HOLDINGS'),'Investor Principles must remain evergreen');
const sitemap=await read('sitemap.xml');
assert.equal((sitemap.match(/<url>/g)||[]).length,pages.length,'Sitemap page count mismatch');
for(const p of pages){
  const url='https://sohan660.github.io/Market-Notebook/'+(p==='index.html'?'':p);
  assert.ok(sitemap.includes('<loc>'+url+'</loc>'),'Missing sitemap URL '+url);
}
const png=await fs.readFile(new URL('social-preview.png',root));
assert.equal(png.subarray(1,4).toString(),'PNG');
assert.equal(png.readUInt32BE(16),1200);
assert.equal(png.readUInt32BE(20),630);
console.log('PASS: case studies, evergreen pages, saved checklists, editable watchlist, JavaScript syntax, social card, sitemap and '+links+' links/assets.');
