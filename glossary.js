/* Search the glossary locally. No data is sent anywhere. */
(() => {
  'use strict';
  const search=document.querySelector('#glossary-search'),cards=[...document.querySelectorAll('.glossary-term')],buttons=[...document.querySelectorAll('[data-glossary-category]')],count=document.querySelector('#glossary-count'),empty=document.querySelector('#glossary-empty');
  if(!search||!cards.length)return;
  let category='all';
  const update=()=>{
    const query=search.value.trim().toLocaleLowerCase('en-US');
    let visible=0;
    for(const card of cards){
      const text=(card.textContent+' '+(card.dataset.keywords||'')).toLocaleLowerCase('en-US');
      const show=(category==='all'||card.dataset.category===category)&&(!query||text.includes(query));
      card.hidden=!show;if(show)visible++;
    }
    count.textContent=visible+' of '+cards.length+' terms';
    empty.hidden=visible>0;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.glossaryCategory===category)));
  };
  search.addEventListener('input',update);
  buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.glossaryCategory;update();}));
  document.querySelector('#glossary-clear').addEventListener('click',()=>{
    search.value='';category='all';update();search.focus();
  });
  update();
})();
