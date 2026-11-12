/* Investing 101 quiz: evergreen questions, clear feedback, shareable results. */
(() => {
  'use strict';
  const form=document.querySelector('#quiz'),questionBox=document.querySelector('#quiz-questions');
  if(!form||!questionBox)return;
  const questions=[
    {q:'What does one share of stock represent?',options:['A guaranteed return','A small ownership interest in a company','A loan to a government'],correct:1,why:'A stock is ownership in a company. Its price can rise or fall.'},
    {q:'Why might a beginner choose a broad-market ETF?',options:['It guarantees a profit','It always beats individual stocks','It spreads exposure across many holdings'],correct:2,why:'Broad diversification helps reduce risk tied to one company, not all risk.'},
    {q:'Which goal usually makes more sense for money needed next semester?',options:['Keep it accessible in cash or a savings account','Buy the most volatile stock','Use leverage to grow it quickly'],correct:0,why:'Money needed soon generally should not depend on stock market returns.'},
    {q:'What is an expense ratio?',options:['The amount of tax on every trade','An ongoing annual fund cost expressed as a percentage','The interest you earn from the fund'],correct:1,why:'Fund expenses reduce what investors keep over time.'},
    {q:'A company reports growing revenue. Does that automatically make its stock a bargain?',options:['Yes, revenue is the only number that matters','Only if social media agrees','No, profits, risk and the price you pay also matter'],correct:2,why:'A growing business can still be overpriced or face serious risks.'},
    {q:'What does diversification protect against best?',options:['The risk that a single company performs poorly','Every possible market decline','Inflation in all circumstances'],correct:0,why:'Spreading holdings reduces company-specific concentration; it cannot eliminate market losses.'},
    {q:'What is a sensible response to a claim of guaranteed high returns?',options:['Assume it is risk-free','Check the source, costs and risks before acting','Buy right away before everyone else'],correct:1,why:'Promises of unusually high returns without risk are a warning sign.'}
  ];
  const create=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
  for(const [index,q] of questions.entries()){
    const fieldset=create('fieldset'),legend=create('legend',(index+1)+'. '+q.q);
    fieldset.className='quiz-question';fieldset.append(legend);
    q.options.forEach((option,n)=>{
      const label=create('label'),radio=create('input');
      radio.type='radio';radio.name='q'+index;radio.value=String(n);
      label.append(radio,create('span',option));fieldset.append(label);
    });
    const feedback=create('p');feedback.className='quiz-feedback';feedback.id='quiz-feedback-'+index;
    fieldset.append(feedback);questionBox.append(fieldset);
  }
  const results=document.querySelector('#quiz-results'),score=document.querySelector('#score'),
    percent=document.querySelector('#quiz-percent'),summary=document.querySelector('#quiz-summary'),
    share=document.querySelector('#quiz-share'),retake=document.querySelector('#quiz-retake'),
    progress=document.querySelector('#quiz-progress'),submit=document.querySelector('#quiz-submit'),best=document.querySelector('#quiz-best');
  const BEST_KEY='market-notebook:quiz-best:v1';
  const total=questions.length;
  const bestScore=()=>{try{return Number(localStorage.getItem(BEST_KEY))||0;}catch(_){return 0;}};
  const updateBest=()=>{const n=bestScore();best.textContent=n?'Best so far: '+n+' / '+total+' questions':'No quiz score saved yet';};
  const selected=i=>form.querySelector('input[name="q'+i+'"]:checked');
  let lastScore=null;
  const updateProgress=()=>{
    const answered=questions.filter((_,i)=>selected(i)).length;
    progress.textContent=answered+' / '+total+' answered';
    submit.disabled=answered!==total;
  };
  form.addEventListener('change',event=>{
    if(!event.target.matches('input[type="radio"]'))return;
    const i=Number(event.target.name.slice(1));
    if(!Number.isInteger(i)||i<0||i>=total)return;
    if(lastScore===null){updateProgress();}
  });
  const setFeedback=(i,correct)=>{
    const p=document.querySelector('#quiz-feedback-'+i);
    p.textContent=(correct?'Correct. ':'Not quite. ')+questions[i].why;
    p.className='quiz-feedback '+(correct?'is-correct':'is-incorrect');
  };
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(questions.some((_,i)=>!selected(i))){updateProgress();return;}
    const correct=questions.reduce((sum,q,i)=>{
      const yes=Number(selected(i).value)===q.correct;setFeedback(i,yes);return sum+Number(yes);
    },0);
    lastScore=correct;
    score.textContent=correct+' / '+total;
    percent.textContent=Math.round(correct/total*100)+'% correct';
    summary.textContent=correct===total?'You nailed the basics. Keep asking good questions.':
      correct>=5?'Nice work. Review the explanations and try again if you want.':
      'Good start. Go back to the lessons, then give it another shot.';
    results.hidden=false;
    submit.hidden=true;
    share.hidden=false;retake.hidden=false;
    form.querySelectorAll('input[type="radio"]').forEach(x=>x.disabled=true);
    try{if(correct>bestScore())localStorage.setItem(BEST_KEY,String(correct));}catch(_){}
    updateBest();
    const quizStep=document.querySelector('[data-path-step="quiz"]');
    if(quizStep&&!quizStep.checked){
      quizStep.checked=true;
      quizStep.dispatchEvent(new Event('change',{bubbles:true}));
    }
    results.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
  });
  retake.addEventListener('click',()=>{
    form.reset();
    lastScore=null;
    results.hidden=true;share.hidden=true;retake.hidden=true;submit.hidden=false;
    form.querySelectorAll('input[type="radio"]').forEach(x=>x.disabled=false);
    questionBox.querySelectorAll('.quiz-feedback').forEach(x=>{x.textContent='';x.className='quiz-feedback';});
    updateProgress();form.querySelector('input[type="radio"]')?.focus();
  });
  share.addEventListener('click',async()=>{
    if(lastScore===null)return;
    const link='https://sohan660.github.io/Market-Notebook/start.html#quiz-section';
    const message='I got '+lastScore+'/'+total+' on Market Notebook’s Investing 101 quiz. Try it: '+link;
    try{
      if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');
      await navigator.clipboard.writeText(message);
      document.querySelector('#quiz-share-status').textContent='Score and quiz link copied. Share it with a friend!';
    }catch(_){
      document.querySelector('#quiz-share-status').textContent='Copy this text to share your result.';
      window.prompt('Copy your quiz result:',message);
    }
  });
  updateBest();updateProgress();
})();
