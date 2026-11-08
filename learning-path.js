/* Browser-only Investing 101 learning progress. */
(()=>{'use strict';
const boxes=[...document.querySelectorAll('[data-path-step]')];if(!boxes.length)return;
const key='market-notebook:learning-path:v1',label=document.querySelector('#study-track-count'),bar=document.querySelector('.study-track-progress'),fill=document.querySelector('#study-track-fill');
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))boxes.forEach(b=>b.checked=saved.includes(b.dataset.pathStep))}catch(_){}
function update(){const n=boxes.filter(b=>b.checked).length;label.textContent=n+' of '+boxes.length+' completed';bar.setAttribute('aria-valuenow',String(n));fill.style.width=n/boxes.length*100+'%'}
boxes.forEach(b=>b.addEventListener('change',()=>{try{localStorage.setItem(key,JSON.stringify(boxes.filter(b=>b.checked).map(b=>b.dataset.pathStep)))}catch(_){}update()}));
document.querySelector('#study-track-reset').addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);try{localStorage.removeItem(key)}catch(_){}update()});update();
})();
