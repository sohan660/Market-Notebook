import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml'};
const server=http.createServer(async(req,res)=>{
  try{
    let pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    if(pathname==='/')pathname='/index.html';
    const filename=path.resolve(root,'.'+pathname);
    if(!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const content=await fs.readFile(filename);
    res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(content);
  }catch(error){res.writeHead(404);res.end('Missing file');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:375,height:812},acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('dialog',dialog=>dialog.dismiss());
const visit=async pathname=>{
  const response=await page.goto(base+pathname,{waitUntil:'load'});
  assert.equal(response.status(),200,'Page request failed: '+pathname);
};
const checkNoErrors=label=>{
  assert.deepEqual(errors,[],label+': uncaught browser JS errors');
  console.log('PASS '+label);
};

try{
  await visit('');
  assert.equal(await page.locator('.mobile-menu-toggle').isVisible(),true);
  assert.equal(await page.locator('.site-links').isVisible(),false);
  await page.locator('.mobile-menu-toggle').click();
  assert.equal(await page.locator('.site-links').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.site-links').isVisible(),false);
  await page.locator('.mobile-menu-toggle').click();
  await page.locator('.site-links a[href="glossary.html"]').click();
  await page.waitForURL(/glossary\.html/);
  checkNoErrors('mobile navigation and glossary route');

  assert.equal(await page.locator('.glossary-term').count(),29);
  await page.locator('#glossary-search').fill('expense ratio');
  assert.ok(await page.locator('.glossary-term:visible').count()>=1);
  assert.ok(await page.locator('.glossary-term:visible').count()<29);
  await page.locator('[data-glossary-category="risk"]').click();
  assert.equal(await page.locator('#glossary-empty').isVisible(),true);
  await page.locator('#glossary-clear').click();
  assert.equal(await page.locator('.glossary-term:visible').count(),29);
  checkNoErrors('local glossary search and filters');

  await visit('start.html#quiz-section');
  assert.equal(await page.locator('#quiz-questions fieldset').count(),7);
  assert.equal(await page.locator('#quiz-submit').isDisabled(),true);
  const correct=[1,2,0,1,2,0,1];
  for(let i=0;i<correct.length;i++)await page.locator('input[name="q'+i+'"][value="'+correct[i]+'"]').check();
  assert.equal(await page.locator('#quiz-submit').isDisabled(),false);
  await page.locator('#quiz-submit').click();
  assert.equal((await page.locator('#score').textContent()).trim(),'7 / 7');
  assert.equal(await page.locator('#quiz-share').isVisible(),true);
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('market-notebook:learning-path:v1')||'[]'));
  assert.ok(progress.includes('quiz'),'Completing quiz should mark lesson progress');
  await page.locator('#quiz-share').click();
  await page.waitForFunction(()=>document.querySelector('#quiz-share-status').textContent.length>0);
  await page.locator('#quiz-retake').click();
  assert.equal((await page.locator('#quiz-progress').textContent()).trim(),'0 / 7 answered');
  checkNoErrors('quiz answers, feedback, sharing and retake');

  await visit('research.html?company=msft&tab=notes');
  assert.equal(await page.locator('#company-select').inputValue(),'msft');
  assert.equal(await page.locator('#notes').isVisible(),true);
  await page.locator('#note-thesis').fill('A company worth understanding, not a buy signal.');
  await page.reload();
  assert.equal(await page.locator('#notes').isVisible(),true);
  assert.ok((await page.locator('#note-thesis').inputValue()).includes('worth understanding'));
  await page.locator('[data-tab="checklist"]').click();
  await page.locator('#check-questions input[type="checkbox"]').first().check();
  assert.equal((await page.locator('#progress-number').textContent()).trim(),'1 / 5');
  await page.reload();
  assert.equal(await page.locator('#check-questions input[type="checkbox"]').first().isChecked(),true);
  await page.locator('#company-select').selectOption('aapl');
  assert.equal(await page.locator('#check-questions input[type="checkbox"]').first().isChecked(),false);
  await page.locator('#company-select').selectOption('msft');
  assert.equal(await page.locator('#check-questions input[type="checkbox"]').first().isChecked(),true);
  await page.locator('#copy-case-link').click();
  await page.waitForFunction(()=>document.querySelector('#case-share-status').textContent.length>0);
  checkNoErrors('company case-study links, saved notes and per-company checklist');

  await visit('watchlist.html');
  await page.locator('#watch-symbol').fill('AAPL');
  await page.locator('#watch-note').fill('Review profit trends');
  await page.locator('#watchlist-form button[type="submit"]').click();
  assert.equal(await page.locator('.watch-item').count(),1);
  await page.locator('button[data-action="edit"]').click();
  await page.locator('.watch-edit-input').fill('Review profit, cash flow and risk');
  await page.locator('button[data-action="save"]').click();
  await page.reload();
  assert.ok((await page.locator('.watch-item-note').textContent()).includes('cash flow'));
  const downloadEvent=page.waitForEvent('download');
  await page.locator('#watch-export').click();
  const downloaded=await downloadEvent;
  assert.equal(downloaded.suggestedFilename(),'market-notebook-watchlist.csv');
  await page.locator('button[data-action="remove"]').click();
  assert.equal(await page.locator('.watch-item').count(),0);
  await page.locator('#watch-import-file').setInputFiles({
    name:'market-notebook-watchlist.csv',mimeType:'text/csv',
    buffer:Buffer.from('Ticker,Reason,Added\r\n"AAPL","Company, with a comma","2026-11-10"\r\n"MSFT","A second symbol","2026-11-10"\r\n')
  });
  await page.waitForFunction(()=>document.querySelectorAll('.watch-item').length===2);
  assert.ok((await page.locator('#watch-status').textContent()).includes('Imported 2'));
  await page.reload();
  assert.equal(await page.locator('.watch-item').count(),2);
  checkNoErrors('editable watchlist, CSV download and import persistence');

  for(const width of [320,375]){
    await page.setViewportSize({width,height:812});
    for(const route of ['','start.html','investors.html','research.html','watchlist.html','glossary.html','about.html']){
      await visit(route);
      const dims=await page.evaluate(()=>({documentWidth:document.documentElement.scrollWidth,viewport:innerWidth}));
      assert.ok(dims.documentWidth<=dims.viewport+2,'Page-wide horizontal overflow at '+width+'px on '+route+': '+JSON.stringify(dims));
    }
  }
  await page.setViewportSize({width:1280,height:850});
  await visit('');
  assert.equal(await page.locator('.mobile-menu-toggle').isVisible(),false);
  assert.equal(await page.locator('.site-links').isVisible(),true);
  checkNoErrors('seven pages at mobile widths and desktop navigation');
  console.log('Browser smoke tests passed.');
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
