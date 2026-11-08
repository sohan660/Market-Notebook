import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=file=>fs.readFile(new URL(file,root),'utf8');
function dataset(code,key){const context={window:{}};vm.runInNewContext(code,context);return context.window[key];}
const research=dataset(await read('research-data.js'),'MARKET_FINANCIALS');
const holdings=dataset(await read('investor-data.js'),'MARKET_HOLDINGS');
for(const data of [research,holdings]){
  assert.match(data.checkedOn,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Date.parse(data.reviewDue)>Date.parse(data.checkedOn),'reviewDue must follow checkedOn');
}
for(const company of Object.values(research.companies)){
  const years=new Set();
  for(const row of company.annual){
    assert.ok(!years.has(row.year),'Duplicate annual year');years.add(row.year);
    assert.ok(Number.isInteger(row.year)&&row.end.startsWith(String(row.year)));
    for(const field of ['revenue','netIncome','eps'])assert.ok(Number.isFinite(row[field]));
    assert.ok(row.revenue>0);
    assert.ok(company.sources[row.source]?.url.startsWith('https://'));
  }
  for(const year of [2024,2025])assert.ok(years.has(year),'Missing comparison year');
}
for(const manager of Object.values(holdings.managers)){
  assert.ok(Number.isSafeInteger(manager.total)&&manager.total>0);
  assert.ok(Number.isInteger(manager.entries)&&manager.entries>0);
  assert.ok(manager.summary.startsWith('https://www.sec.gov/'));
  assert.ok(manager.table.startsWith('https://www.sec.gov/'));
  if(manager.top){
    assert.ok(manager.top.every(row=>Number.isSafeInteger(row.v)&&row.v>0));
    assert.ok(manager.top.reduce((a,row)=>a+row.v,0)<=manager.total,'Selected holdings exceed filing total');
  }
}
const pages=['index.html','start.html','investors.html','research.html','about.html'];
let links=0;
for(const file of pages){
  const html=await read(file);
  const markup=html.replace(/<script>[\s\S]*?<\/script>/g,'');
  const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,file+': duplicate IDs');
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1,file+': active navigation');
  assert.ok(html.includes('href="site.css"'),file+': shared stylesheet missing');
  for(const match of markup.matchAll(/<(?:a|link|script|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g)){
    const url=match[1];if(/^(https?:|data:|mailto:)/.test(url))continue;
    const [path,hash]=url.split('#');await fs.access(new URL(path||file,root));
    if(hash)assert.ok((await read(path||file)).includes('id="'+hash+'"'),file+': broken anchor '+url);
    links++;
  }
  for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename:file});
}
for(const file of ['script.js','research-data.js','investor-data.js','data-status.js'])new vm.Script(await read(file),{filename:file});
const statusContext={window:{},document:{querySelectorAll:()=>[]}};
vm.runInNewContext(await read('data-status.js'),statusContext);
const status=statusContext.window.marketDataStatus;
const sample={checkedOn:'2026-11-08',reviewDue:'2026-12-08'};
assert.equal(status(sample,new Date('2026-12-07T12:00:00Z')).stale,false);
assert.equal(status(sample,new Date('2026-12-08T00:00:00Z')).stale,true);
assert.equal(status({...sample,checkedOn:'invalid'},new Date('2026-12-08')).stale,true);
console.log('PASS: datasets, sources, review-date boundaries, JavaScript syntax, navigation, and '+links+' local links/assets.');
