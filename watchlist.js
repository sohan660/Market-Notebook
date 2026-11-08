/* Local-only watchlist. Quotes open externally; no simulated market data. */
(()=>{'use strict';
const $=s=>document.querySelector(s),form=$('#watchlist-form');if(!form)return;
const KEY='market-notebook:watchlist:v1',MAX=25,valid=/^[A-Z][A-Z0-9.-]{0,9}$/;
let items=[];try{let x=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(x))items=x.filter(i=>i&&valid.test(i.symbol)).slice(0,MAX)}catch(_){}
const notice=s=>$('#watch-status').textContent=s;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items));return true}catch(_){notice('Storage unavailable. Export your list to keep a copy.');return false}};
const el=(tag,text,cls)=>{let v=document.createElement(tag);if(text!==undefined)v.textContent=text;if(cls)v.className=cls;return v};
function draw(){let box=$('#watch-entries');box.replaceChildren();$('#watch-count').textContent='('+items.length+')';$('#watch-export').disabled=!items.length;
if(!items.length){box.appendChild(el('p','Your list is empty. Add a ticker above.','watchlist-empty'));return}
for(const item of items){let card=el('article',undefined,'watch-item'),head=el('div',undefined,'watch-item-head');head.append(el('h3',item.symbol),el('span','Added '+item.added));card.append(head);
if(item.note)card.appendChild(el('p',item.note,'watch-item-note'));
let row=el('div',undefined,'watch-actions'),link=el('a','Open quote & chart ↗','feature-btn primary');link.href='https://finance.yahoo.com/quote/'+encodeURIComponent(item.symbol)+'/';link.target='_blank';link.rel='noopener noreferrer';row.append(link);
if(['AAPL','MSFT','KO'].includes(item.symbol)){let a=el('a','Research Lab ↗','feature-btn');a.href='research.html';row.append(a)}
let btn=el('button','Remove','feature-btn quiet');btn.type='button';btn.dataset.removeSymbol=item.symbol;row.append(btn);card.append(row);box.append(card)}}
function add(ticker,why=''){let s=ticker.trim().toUpperCase();if(!valid.test(s)){notice('Enter a ticker such as AAPL, SPY or BRK.B.');return}
if(items.some(i=>i.symbol===s)){notice(s+' is already saved.');return}if(items.length>=MAX){notice('Limit: '+MAX+' symbols. Remove one first.');return}
items.push({symbol:s,note:why.trim().slice(0,240),added:new Date().toISOString().slice(0,10)});
if(save())notice(s+' added to this browser.');$('#watch-symbol').value='';$('#watch-note').value='';draw()}
form.addEventListener('submit',e=>{e.preventDefault();add($('#watch-symbol').value,$('#watch-note').value)});
document.querySelectorAll('[data-add-symbol]').forEach(b=>b.addEventListener('click',()=>add(b.dataset.addSymbol)));
$('#watch-entries').addEventListener('click',e=>{let b=e.target.closest('button[data-remove-symbol]');if(!b)return;items=items.filter(i=>i.symbol!==b.dataset.removeSymbol);save();draw();notice(b.dataset.removeSymbol+' removed.')});
$('#watch-export').addEventListener('click',()=>{if(!items.length)return;let quote=x=>'"'+String(x).replaceAll('"','""')+'"',csv=['Ticker,Reason,Added',...items.map(i=>[i.symbol,i.note,i.added].map(quote).join(','))].join('\r\n')+'\r\n';const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='market-notebook-watchlist.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('CSV export prepared.')});
draw();
})();
