/* Local-only stock research notes. */
(()=>{'use strict';
const $=s=>document.querySelector(s),sel=$('#company-select');if(!sel||!$('#note-thesis'))return;
const fields=['thesis','risks','questions','conclusion'],nodes=Object.fromEntries(fields.map(k=>[k,$('#note-'+k)])),status=$('#research-notes-status');
const sym=()=>sel.value.toUpperCase(),key=()=> 'market-notebook:research-notes:v1:'+sym();
const notice=s=>status.textContent=s,collect=()=>Object.fromEntries(fields.map(k=>[k,nodes[k].value]));
function load(){let data={};try{data=JSON.parse(localStorage.getItem(key())||'{}')||{}}catch(_){notice('Local storage unavailable. Export to keep a copy.')}
fields.forEach(k=>nodes[k].value=typeof data[k]==='string'?data[k]:'');$('#notes-company').textContent=sym()}
function save(announce){try{localStorage.setItem(key(),JSON.stringify(collect()));if(announce)notice('Saved notes for '+sym()+' in this browser.');}catch(_){notice('Browser storage unavailable. Export to keep a copy.')}}
fields.forEach(k=>nodes[k].addEventListener('input',()=>save(false)));
sel.addEventListener('change',()=>{load();notice('Showing notes for '+sym()+'.')});
$('#save-research-notes').addEventListener('click',()=>save(true));
$('#export-research-notes').addEventListener('click',()=>{const data=collect();const txt='# '+sym()+' — Market Notebook research notes\n\n'+fields.map(k=>'## '+k+'\n\n'+(data[k].trim()||'Not recorded')).join('\n\n')+'\n\nFor education only.\n';const blob=new Blob([txt],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=sym().toLowerCase()+'-notes.md';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('Export prepared for '+sym()+'.')});
$('#clear-research-notes').addEventListener('click',()=>{if(!confirm('Delete notes for '+sym()+' on this browser?'))return;fields.forEach(k=>nodes[k].value='');try{localStorage.removeItem(key())}catch(_){}notice('Notes cleared for '+sym()+'.')});
load();
})();
