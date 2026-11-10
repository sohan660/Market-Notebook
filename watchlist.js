/* Market Notebook watchlist: local notes, no price feed. */
(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const form=$('#watchlist-form'); if(!form)return;
  const STORAGE_KEY='market-notebook:watchlist:v1', LIMIT=25;
  const VALID=/^[A-Z][A-Z0-9]{0,7}(?:[.-][A-Z0-9]{1,3})?$/;
  const list=$('#watch-entries'), status=$('#watch-status'), symbolInput=$('#watch-symbol'), noteInput=$('#watch-note');
  const editing=new Set();
  let items=[];
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    if(Array.isArray(saved))items=saved.filter(x=>x&&typeof x.symbol==='string'&&VALID.test(x.symbol)).slice(0,LIMIT)
      .map(x=>({symbol:x.symbol,note:typeof x.note==='string'?x.note.slice(0,240):'',added:typeof x.added==='string'?x.added:'Earlier'}));
  } catch (_) { /* Private browsing can make storage unavailable. */ }
  const inform=s=>{ status.textContent=s; };
  function persist(){
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify(items));return true;}
    catch (_) {inform('Could not save to this browser. Export a CSV for a backup.');return false;}
  }
  function element(tag,text,className){
    const node=document.createElement(tag);
    if(text!==undefined)node.textContent=text;
    if(className)node.className=className;
    return node;
  }
  function action(text,name,ticker,cls='feature-btn'){
    const b=element('button',text,cls);b.type='button';b.dataset.action=name;b.dataset.symbol=ticker;return b;
  }
  function draw(){
    list.replaceChildren();
    $('#watch-count').textContent='('+items.length+')';
    $('#watch-export').disabled=items.length===0;
    if(!items.length){list.appendChild(element('p','Your watchlist is empty. Add a ticker above.','watchlist-empty'));return;}
    for(const item of items){
      const card=element('article',undefined,'watch-item'),head=element('div',undefined,'watch-item-head');
      head.append(element('h3',item.symbol),element('span','Added '+item.added));card.append(head);
      if(editing.has(item.symbol)){
        const label=element('label','Research note for '+item.symbol,'watch-edit-label');
        const field=element('textarea',item.note,'watch-edit-input');
        field.rows=3;field.maxLength=240;field.dataset.editField=item.symbol;
        label.append(field);card.append(label);
        const controls=element('div',undefined,'watch-actions');
        controls.append(action('Save note','save',item.symbol,'feature-btn primary'),action('Cancel','cancel',item.symbol));card.append(controls);
      } else {
        card.append(element('p',item.note||'No note yet. Add a reason for following this ticker.','watch-item-note'));
        const controls=element('div',undefined,'watch-actions');
        const quote=element('a','Open quote & chart ↗','feature-btn primary');
        quote.href='https://finance.yahoo.com/quote/'+encodeURIComponent(item.symbol)+'/';
        quote.target='_blank';quote.rel='noopener noreferrer';controls.append(quote);
        if(['AAPL','MSFT','KO'].includes(item.symbol)){
          const lab=element('a','Historical case study ↗','feature-btn');
          lab.href='research.html';controls.append(lab);
        }
        controls.append(action('Edit note','edit',item.symbol),action('Remove','remove',item.symbol,'feature-btn quiet'));card.append(controls);
      }
      list.append(card);
    }
  }
  function add(raw,reason=''){
    const ticker=raw.trim().toUpperCase();
    if(!VALID.test(ticker)){
      inform('Enter a ticker format such as AAPL, SPY or BRK.B (letters, numbers and at most one dot or hyphen).');
      symbolInput.focus();return;
    }
    if(items.some(x=>x.symbol===ticker)){inform(ticker+' is already on your watchlist.');return;}
    if(items.length>=LIMIT){inform('Watchlist limit: '+LIMIT+' entries. Remove one first.');return;}
    items.push({symbol:ticker,note:reason.trim().slice(0,240),added:new Date().toISOString().slice(0,10)});
    if(persist())inform(ticker+' added. Check the quote provider to confirm the symbol exists.');
    symbolInput.value='';noteInput.value='';draw();
  }
  form.addEventListener('submit',e=>{e.preventDefault();add(symbolInput.value,noteInput.value);});
  document.querySelectorAll('[data-add-symbol]').forEach(b=>b.addEventListener('click',()=>add(b.dataset.addSymbol)));
  list.addEventListener('click',e=>{
    const button=e.target.closest('button[data-action]');if(!button)return;
    const ticker=button.dataset.symbol,kind=button.dataset.action,entry=items.find(x=>x.symbol===ticker);
    if(!entry)return;
    if(kind==='edit'){editing.add(ticker);draw();list.querySelectorAll('textarea[data-edit-field]').forEach(t=>{if(t.dataset.editField===ticker)t.focus();});return;}
    if(kind==='cancel'){editing.delete(ticker);draw();inform('No changes to '+ticker+'.');return;}
    if(kind==='save'){
      const editor=[...list.querySelectorAll('textarea[data-edit-field]')].find(t=>t.dataset.editField===ticker);
      if(!editor)return;
      entry.note=editor.value.trim().slice(0,240);editing.delete(ticker);
      if(persist())inform('Updated note for '+ticker+'.');draw();return;
    }
    if(kind==='remove'){items=items.filter(x=>x.symbol!==ticker);editing.delete(ticker);persist();draw();inform(ticker+' removed.');}
  });
  $('#watch-export').addEventListener('click',()=>{
    if(!items.length)return;
    const quote=x=>'"'+String(x).replaceAll('"','""')+'"';
    const csv=['Ticker,Reason,Added',...items.map(x=>[x.symbol,x.note,x.added].map(quote).join(','))].join('\r\n')+'\r\n';
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='market-notebook-watchlist.csv';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);inform('CSV export prepared.');
  });
  draw();
})();
