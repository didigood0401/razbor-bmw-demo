/* v3: кино-секция (Bugatti), проявление слов, плавающая карточка «Выкуп BMW» */
(function(){
 const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
 const cine=document.querySelector('.cine'),gtr=document.querySelector('.gtr'),cbg=document.querySelector('.cbg');
 const lead=document.querySelector('[data-words]');let ws=[];
 if(lead){
  const t=lead.textContent.trim();
  const first=t.split('.')[0].split(/\s+/).length;
  lead.innerHTML=t.split(/\s+/).map((w,i)=>'<span class="wd2'+(i<first?' k':'')+'">'+w+'</span>').join(' ');
  ws=[...lead.querySelectorAll('.wd2:not(.k)')];
 }
 const flt=document.querySelector('.flt');let off=false;
 if(flt){
  try{off=sessionStorage.getItem('fltOff')==='1'}catch(e){}
  flt.querySelector('.fx').addEventListener('click',()=>{flt.classList.remove('on');off=true;try{sessionStorage.setItem('fltOff','1')}catch(e){}});
 }
 let tk=false;
 function upd(){
  tk=false;const h=innerHeight;
  if(cine&&gtr&&!RM){
   const r=cine.getBoundingClientRect();const p=cl((h-r.top)/(h+r.height),0,1);
   gtr.style.transform='translate3d('+(-p*gtr.scrollWidth*.45).toFixed(1)+'px,0,0)';
   if(cbg)cbg.style.transform='translate3d(0,'+((.5-p)*80).toFixed(1)+'px,0)';
  }
  if(ws.length){
   const r=lead.getBoundingClientRect();const p=RM?1:cl((h*.85-r.top)/(h*.45),0,1);const n=Math.round(p*ws.length);
   ws.forEach((w,i)=>w.classList.toggle('on',i<n));
  }
  if(flt&&!off){const doc=document.documentElement.scrollHeight;flt.classList.toggle('on',scrollY>h*1.1&&scrollY+h<doc-700)}
 }
 addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});
 addEventListener('resize',upd);upd();
})();
