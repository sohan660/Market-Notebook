/* Lightweight share action; no analytics or tracking. */
(() => {
  'use strict';
  const button=document.querySelector('#copy-site-link'),status=document.querySelector('#share-status');
  if(!button||!status)return;
  const url='https://sohan660.github.io/Market-Notebook/';
  button.addEventListener('click',async()=>{
    try {
      if(!navigator.clipboard||!navigator.clipboard.writeText)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      status.textContent='Website link copied. Share it with a friend!';
    } catch (_) {
      status.textContent='Copy the website link from the prompt.';
      window.prompt('Copy this link to share Market Notebook:',url);
    }
  });
})();
