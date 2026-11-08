/* The review date is an editorial reminder, not a claim of live data. */
(function () {
  'use strict';
  function dataStatus(data, now) {
    const checked=Date.parse(data.checkedOn+'T00:00:00Z');
    const due=Date.parse(data.reviewDue+'T00:00:00Z');
    const today=Date.parse((now || new Date()).toISOString().slice(0,10)+'T00:00:00Z');
    if (!Number.isFinite(checked) || !Number.isFinite(due) || due<=checked || checked>today) {
      return {stale:true,text:'Data review date unavailable. Check the original source reports before using these figures.'};
    }
    const date=s=>new Date(s+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
    const overdue=today>=due;
    return {stale:overdue,text:(overdue?'Review overdue. ':'Snapshot reviewed. ')+'Last checked '+date(data.checkedOn)+'. '+(overdue?'A newer report may be available.':'Next review due '+date(data.reviewDue)+'.')+' This page is updated manually; these are not live prices.'};
  }
  window.marketDataStatus=dataStatus;
  document.querySelectorAll('[data-review]').forEach(el=>{
    const data=el.dataset.review==='holdings'?window.MARKET_HOLDINGS:window.MARKET_FINANCIALS;
    const result=data?dataStatus(data):{stale:true,text:'Data status could not load. Refer to the dated reports linked below.'};
    el.textContent=result.text;el.classList.toggle('is-stale',result.stale);
  });
})();
