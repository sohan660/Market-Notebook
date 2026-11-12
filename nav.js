/* A small, keyboard-friendly menu for phones. Works without a framework. */
(() => {
  'use strict';
  const breakpoint=window.matchMedia('(min-width: 1081px)');
  document.querySelectorAll('.site-nav').forEach(nav=>{
    const button=nav.querySelector('.mobile-menu-toggle'),links=nav.querySelector('.site-links');
    if(!button||!links)return;
    button.hidden=false;nav.classList.add('nav-ready');
    const setOpen=open=>{
      links.classList.toggle('is-open',open);
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',open?'Close navigation':'Open navigation');
      const label=button.querySelector('.menu-label');if(label)label.textContent=open?'Close':'Menu';
    };
    button.addEventListener('click',()=>setOpen(!links.classList.contains('is-open')));
    links.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false);});
    document.addEventListener('click',event=>{if(!nav.contains(event.target))setOpen(false);});
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&links.classList.contains('is-open')){setOpen(false);button.focus();}
    });
    breakpoint.addEventListener('change',e=>{if(e.matches)setOpen(false);});
    setOpen(false);
  });
})();
