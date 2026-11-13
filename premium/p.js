document.documentElement.classList.add('js');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer:fine)').matches;
const PHONE='79167016393';

/* loader: tach sweep once per session */
const ld=$('.ld');
function ready(){document.body.classList.add('ready')}
let seen=false;try{seen=sessionStorage.getItem('rb-ld')==='1'}catch(e){}
if(ld){if(RM||seen){ld.remove();ready()}else{try{sessionStorage.setItem('rb-ld','1')}catch(e){}
 setTimeout(()=>{ld.classList.add('go');ready();setTimeout(()=>ld.remove(),1000)},1400)}}else ready();

/* split headings into words */
$$('.split').forEach(el=>{let d=0;el.innerHTML=el.innerHTML.split(/(<br>)/).map(part=>part==='<br>'?part:part.trim().split(/\s+/).map(w=>`<span class="wd"><span style="--d:${d++}">${w}</span></span>`).join(' ')).join('')});

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -5% 0px'});
const watch=()=>$$('.rv:not(.in),.clip:not(.in),.split:not(.in)').forEach(x=>io.observe(x));watch();

/* nav hide on scroll down */
const nav=$('.nav');let ly=0;
addEventListener('scroll',()=>{const y=scrollY;nav.classList.toggle('sc',y>40);nav.classList.toggle('hide',y>ly&&y>500&&!$('.mnav.open'));ly=y},{passive:true});
$('.burger').onclick=()=>{$('.mnav').classList.toggle('open')};$$('.mnav a').forEach(a=>a.onclick=()=>$('.mnav').classList.remove('open'));

/* parallax bg */
const pbg=$('.hero .bg,.lh .bg');
if(pbg&&!RM){addEventListener('scroll',()=>{const y=scrollY;if(y<innerHeight*1.2)pbg.style.transform=`translate3d(0,${y*.28}px,0) scale(${1.04+y*.00018})`},{passive:true})}

/* cursor glow + peek image on directions */
if(FINE&&!RM){const g=document.createElement('div');g.className='glow';document.body.appendChild(g);
 addEventListener('pointermove',e=>{g.style.transform=`translate(${e.clientX-210}px,${e.clientY-210}px)`},{passive:true});g.style.left='0';g.style.top='0'}
const peek=$('.peek');
if(peek&&FINE&&!RM){const im=$('img',peek);let tx=0,ty=0,cx=0,cy=0;
 $$('.drow').forEach(r=>{r.addEventListener('pointerenter',()=>{im.src=r.dataset.img;peek.classList.add('on')});r.addEventListener('pointerleave',()=>peek.classList.remove('on'))});
 addEventListener('pointermove',e=>{tx=e.clientX+170;ty=e.clientY},{passive:true});
 (function lp(){cx+=(tx-cx)*.14;cy+=(ty-cy)*.14;peek.style.left=cx+'px';peek.style.top=cy+'px';requestAnimationFrame(lp)})()}

/* magnetic pills */
if(FINE&&!RM)$$('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.25}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});

/* ask modal */
const modal=$('#ask');
const page=()=>document.title.split(' |')[0];
function openAsk(t){t=t||'Вопрос с сайта';const text=`Здравствуйте! ${t}. Страница: ${page()}`;
 $('#askCtx').textContent=`${t} · «${page()}»`;$('#mTg').href='https://t.me/+'+PHONE;$('#mWa').href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(text);
 $('#cf').classList.remove('on');$('#mdone').style.display='none';modal.classList.add('open');modal.setAttribute('aria-hidden','false');setTimeout(()=>$('.mops .call').focus(),60)}
function closeAsk(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.x'))closeAsk()});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeAsk();$('.dock').classList.remove('open')}});
$('.mops .call').onclick=()=>{$('#cf').classList.add('on');$('#cf input').focus()};
$('#cf').onsubmit=e=>{e.preventDefault();const d=$('#mdone');d.style.display='block';d.textContent='Готово - перезвоним в течение 15 минут. (Демо: заявка не отправляется.)'};
$('#mMax').onclick=e=>{e.preventDefault();const d=$('#mdone');d.style.display='block';d.textContent='В рабочей версии откроется ваш чат в MAX с этим текстом.'};
document.addEventListener('click',e=>{const a=e.target.closest('[data-ask]');if(!a)return;e.preventDefault();$('.dock').classList.remove('open');openAsk(a.dataset.ask)});

/* dock */
const dock=$('.dock');$('.tgl',dock).onclick=()=>{const o=dock.classList.toggle('open');$('.tgl',dock).setAttribute('aria-expanded',o)};
$$('.dock a[href^="https://wa.me"]').forEach(a=>a.href='https://wa.me/'+PHONE+'?text='+encodeURIComponent('Здравствуйте! Вопрос со страницы: '+page()));

/* counters */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,to=parseFloat(el.dataset.to),dec=(el.dataset.to.split('.')[1]||'').length,t0=performance.now(),D=RM?0:1600;
 (function f(t){const k=Math.min(1,(t-t0)/(D||1)),v=to*(1-Math.pow(1-k,4));el.textContent=v.toFixed(dec).replace('.',',');if(k<1)requestAnimationFrame(f)})(t0)}),{threshold:.5});
$$('[data-to]').forEach(x=>cio.observe(x));

/* engine studio */
const E={
 N13:{f:'b',t:'R4 · 1.6 бензин турбо',n:4,rep:60,buy:170,w:'Цепь ГРМ, натяжитель, ванос'},
 N20:{f:'b',t:'R4 · 2.0 бензин турбо',n:4,rep:60,buy:160,w:'Цепь ГРМ, ванос, колпачки'},
 N26:{f:'b',t:'R4 · 2.0 бензин турбо',n:4,w:'Цепь ГРМ, ванос, течи масла'},
 N46:{f:'b',t:'R4 · 2.0 бензин',n:4,w:'Масложор, колпачки, Valvetronic'},
 B48:{f:'b',t:'R4 · 2.0 бензин турбо',n:4,w:'Цепь ГРМ, помпа, течи масла'},
 N52:{f:'b',t:'R6 · 3.0 бензин',n:6,w:'Гидрокомпенсаторы, ванос'},
 N53:{f:'b',t:'R6 · 3.0 бензин',n:6,w:'Форсунки, катушки, NOx'},
 N54:{f:'b',t:'R6 · 3.0 битурбо',n:6,w:'Турбины, ТНВД, форсунки'},
 N55:{f:'b',t:'R6 · 3.0 бензин турбо',n:6,rep:100,buy:230,w:'Ванос, колпачки, течи масла'},
 B58:{f:'b',t:'R6 · 3.0 бензин турбо',n:6,w:'Помпа, сепаратор картерных газов'},
 N63:{f:'b',t:'V8 · 4.4 битурбо',n:8,rep:160,buy:200,w:'Гильзовка, колпачки, цепи ГРМ'},
 N74:{f:'b',t:'V12 · 6.0 битурбо',n:12,w:'Турбины, цепи ГРМ, течи масла'},
 N47:{f:'d',t:'R4 · 2.0 дизель',n:4,rep:170,buy:170,w:'Цепь ГРМ сзади - со снятием ДВС'},
 B47:{f:'d',t:'R4 · 2.0 дизель',n:4,w:'Цепь ГРМ, EGR, сажевый фильтр'},
 N57:{f:'d',t:'R6 · 3.0 дизель',n:6,rep:200,buy:200,w:'Цепь ГРМ, вкладыши, турбины'},
 B57:{f:'d',t:'R6 · 3.0 дизель',n:6,w:'Цепь ГРМ, турбины, EGR'},
 S55:{f:'m',t:'R6 M · 3.0 битурбо',n:6,w:'Ступица коленвала, вкладыши'},
 S63:{f:'m',t:'V8 M · 4.4 битурбо',n:8,rep:180,buy:300,w:'Вкладыши, гильзовка, ремонт ГБЦ'}
};
const ORD={4:[0,2,3,1],6:[0,4,2,5,1,3],8:[0,4,3,7,5,2,6,1],12:[0,6,4,10,2,8,5,11,1,7,3,9]};
const rail=$('#rail');
if(rail){
 const svg=$('#esvg'),bc=$('#bigcode');let cur=null;
 Object.keys(E).forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=k;b.dataset.f=E[k].f;b.onclick=()=>pick(k);rail.appendChild(b)});
 function draw(e){const sp=e.n>=8?.55:e.n===6?.72:.9,o=ORD[e.n];let s='';
  const cyl=(x,y,i,w)=>{const d=(o.indexOf(i)/e.n)*sp,h=w/2;
   return `<g transform="translate(${x} ${y})"><rect x="${-h}" y="-70" width="${w}" height="92" rx="4" fill="#15181c" stroke="#262a30"/>
   <rect class="fire" x="${-h+4}" y="-66" width="${w-8}" height="14" rx="2" fill="url(#fl)" style="--d:-${d}s;--sp:${sp}s"/>
   <g class="pist" style="--d:-${d}s;--sp:${sp}s;--tr:30px"><rect x="${-h+4}" y="-52" width="${w-8}" height="22" rx="2" fill="#dfe3e7"/><rect x="${-h+4}" y="-46" width="${w-8}" height="2" fill="#9aa1a8"/><rect x="${-h+4}" y="-40" width="${w-8}" height="2" fill="#9aa1a8"/><rect x="-3" y="-30" width="6" height="42" rx="3" fill="#6d747b"/></g></g>`};
  const defs=`<defs><linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd8ff"/><stop offset="1" stop-color="#1c69d4"/></linearGradient></defs>`;
  const base=(x,w,y)=>`<rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="#121418"/><g transform="translate(${x} ${y+18})"><rect width="${w/3}" height="4" fill="#5bb6ea"/><rect x="${w/3}" width="${w/3}" height="4" fill="#2b3f94"/><rect x="${2*w/3}" width="${w/3}" height="4" fill="#e1261c"/></g><g transform="translate(${x+w+30} ${y+6})"><circle class="crank" r="18" fill="none" stroke="#3a3f46" stroke-width="3" stroke-dasharray="6 5" style="--sp:${sp}s"/></g>`;
  if(e.n<=6){const st=70,w=e.n*st,x0=(560-w)/2+st/2-20;for(let i=0;i<e.n;i++)s+=cyl(x0+i*st,110,i,50);s+=base(x0-st/2,w,142)}
  else{const per=e.n/2,st=e.n===12?40:56,cw=e.n===12?32:44;let a='',b='';
   for(let i=0;i<per;i++){a+=cyl(30+cw/2+i*st,112,i,cw);b+=cyl(290+cw/2+i*st,112,i+per,cw)}
   s+=`<g transform="rotate(-8 140 140)">${a}</g><g transform="rotate(8 400 140)">${b}</g>`+base(20,500,146)}
  svg.innerHTML=defs+s}
 function setCode(k){if(RM){bc.innerHTML=[...k].map(c=>`<span>${c}</span>`).join('');return}
  bc.classList.add('out');setTimeout(()=>{bc.innerHTML=[...k].map((c,i)=>`<span style="transition-delay:${i*50}ms">${c}</span>`).join('');bc.classList.remove('out');bc.classList.add('pre');bc.offsetHeight;bc.classList.remove('pre')},300)}
 function pick(k){if(k===cur)return;cur=k;$$('button',rail).forEach(b=>b.classList.toggle('on',b.textContent===k));const e=E[k];setCode(k);
  $('#etype').textContent=e.t;$('#ework').textContent=e.w;$('#erep').textContent=e.rep?'от '+e.rep+' 000 ₽':'по запросу';$('#ebuy').textContent=e.buy?'от '+e.buy+' 000 ₽':'по запросу';$('#erpm').textContent=e.n+' цил.';
  $('#eask').dataset.ask='Ремонт / двигатель '+k;$('#eav').href='#avito';draw(e)}
 $('#famt').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#famt button').forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;$$('button',rail).forEach(c=>c.hidden=f!=='all'&&c.dataset.f!==f);const vis=$$('button:not([hidden])',rail);if(!vis.some(v=>v.textContent===cur))pick(vis[0].textContent)});
 const stg=$('.stage');if(FINE)stg.addEventListener('pointermove',e=>{const r=stg.getBoundingClientRect();stg.style.setProperty('--mx',(e.clientX-r.left)/r.width*100+'%');stg.style.setProperty('--my',(e.clientY-r.top)/r.height*100+'%')});
 pick('N63');
}

/* process: scroll-linked progress */
const steps=$$('.steps li');
if(steps.length){const bar=$('.pbar i'),num=$('#pn');
 const upd=()=>{const mid=innerHeight*.55;let a=0;steps.forEach((s,i)=>{if(s.getBoundingClientRect().top<mid)a=i});steps.forEach((s,i)=>s.classList.toggle('act',i===a));
  const box=$('.steps').getBoundingClientRect();const p=Math.min(1,Math.max(0,(mid-box.top)/box.height));bar.style.setProperty('--p',p);num.textContent='0'+(a+1)};
 addEventListener('scroll',upd,{passive:true});upd()}

/* avito track */
const A={
 parts:[['Двигатель BMW N63B44 в сборе','от 200 000 ₽','N63','p5','Проверен · гарантия 60 дней'],['Двигатель BMW S63B44','от 300 000 ₽','S63','p2','Видео работы по запросу'],['ГБЦ N55 в сборе','28 000 ₽','N55','p8','С разборки · проверена'],['Турбина N63 левая','62 000 ₽','N63','p3','С разборки · гарантия'],['Двигатель BMW N57 3.0d','от 200 000 ₽','N57','p4','Работает на 100%'],['Комплект цепей ГРМ N47','14 500 ₽','N47','p1','Новый · в наличии'],['Ванос впуск N20','9 800 ₽','N20','p6','С разборки · проверен'],['Коленвал S63 после шлифовки','45 000 ₽','S63','p7','Мехобработка в своём цехе']],
 serv:[['Замена цепей ГРМ N47 / N57','от 45 000 ₽','N57','p4','Со снятием ДВС · гарантия'],['Гильзовка блока N63','от 120 000 ₽','N63','p5','Своя мехобработка'],['Ремонт ГБЦ, опрессовка','от 25 000 ₽','N55','p8','Шлифовка, сёдла, направляющие'],['Установка контрактного ДВС','от 35 000 ₽','N20','p1','Подбор и диагностика'],['Капремонт S63','от 180 000 ₽','S63','p2','Вкладыши, гильзы, ГБЦ'],['Замена ваносов','по запросу','N55','p6','Оригинал и аналоги'],['Замена МСК (колпачков)','по запросу','N63','p3','Где возможно - без снятия ГБЦ'],['Приём ДВС от СТО','B2B','N57','p7','Снятый мотор или авто целиком']]
};
const track=$('#track');
if(track){let acc='parts',flt='all';
 const avUrl=n=>'https://www.avito.ru/moskva?q='+encodeURIComponent(n);
 const render=()=>{const L=A[acc].filter(x=>flt==='all'||x[2]===flt);
  track.style.opacity=0;setTimeout(()=>{track.innerHTML=L.length?L.map(([n,p,c,img,m],i)=>`<article class="card rv" style="--i:${i%4}"><div class="ph"><img src="../img/${img}.webp" alt="${n}" loading="lazy" width="900" height="675" draggable="false"><span class="tg">${c}</span><span class="av">Авито</span></div><div class="bd"><h4>${n}</h4><div class="mt">${m}</div><div class="pr">${p}</div><div class="ac"><a href="${avUrl(n)}" target="_blank" rel="noopener">На Авито ↗</a><button type="button" data-ask="Объявление: ${n}, ${p}">Спросить</button></div></div></article>`).join(''):`<p style="color:var(--mut);padding:40px 0">По мотору ${flt} сейчас нет объявлений - <a href="#" data-ask="Нужна позиция под мотор ${flt}" style="color:#fff;text-decoration:underline">спросите, найдём</a>.</p>`;
   track.scrollLeft=0;track.style.opacity=1;watch()},RM?0:220)};
 track.style.transition='opacity .25s';render();
 const tabs=$('#avtabs'),gl=$('.glide',tabs);
 const mv=b=>{gl.style.width=b.offsetWidth+'px';gl.style.transform=`translateX(${b.offsetLeft-5}px)`};mv($('button.on',tabs));addEventListener('resize',()=>mv($('button.on',tabs)));
 tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',tabs).forEach(x=>x.classList.toggle('on',x===b));mv(b);acc=b.dataset.a;render()});
 $('#avf').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#avf button').forEach(x=>x.classList.toggle('on',x===b));flt=b.dataset.f;render()});
 $('#prev').onclick=()=>track.scrollBy({left:-track.clientWidth*.8,behavior:'smooth'});$('#next').onclick=()=>track.scrollBy({left:track.clientWidth*.8,behavior:'smooth'});
 let down=false,sx=0,sl=0,moved=false;
 track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=track.scrollLeft});
 addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;track.classList.add('drag')}track.scrollLeft=sl-dx});
 addEventListener('pointerup',()=>{down=false;track.classList.remove('drag')});
 track.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
}

/* wizard form */
const wiz=$('#wiz');
if(wiz){let st=0;const S=$$('.wz-step',wiz),bar=$('.wz-bar i',wiz),nx=$('#wzNext'),bk=$('#wzBack'),cnt=$('#wzN');
 const show=()=>{S.forEach((s,i)=>s.classList.toggle('on',i===st));bar.style.width=((st+1)/S.length*100)+'%';cnt.textContent='0'+(st+1);bk.hidden=st===0;$('span',nx).textContent=st===S.length-1?'Отправить':'Далее'};
 nx.onclick=()=>{if(st<S.length-1){st++;show()}else{const w=$('input[name=way]:checked',wiz).value,d=$('.wz-done',wiz);$('p',d).textContent=w==='Звонок'?'Перезвоним в течение 15 минут. Заявка придёт с пометкой страницы, с которой отправлена.':`Ответим в ${w} в течение 15 минут. Заявка придёт с пометкой страницы, с которой отправлена.`;d.classList.add('on')}};
 bk.onclick=()=>{if(st>0){st--;show()}};
 $('#wzAgain').onclick=()=>{st=0;show();$('.wz-done',wiz).classList.remove('on')};
 show()}

/* page transition fallback (browsers without cross-document view transitions) */
if(!('onpagereveal' in window)&&!RM){const cv=document.createElement('div');cv.style.cssText='position:fixed;inset:0;z-index:120;background:#070708;transform:translateY(100%);transition:transform .55s cubic-bezier(.7,0,.3,1);pointer-events:none';document.body.appendChild(cv);
 document.addEventListener('click',e=>{const a=e.target.closest('a[href$=".html"]');if(!a||a.target||e.metaKey||e.ctrlKey)return;e.preventDefault();cv.style.transform='none';setTimeout(()=>location.href=a.href,520)})}
