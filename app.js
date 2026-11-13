document.documentElement.classList.add('js');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PHONE='79167016393';

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14});
const watch=()=>$$('.rv:not(.in),.steps:not(.in),.mline:not(.in)').forEach(x=>io.observe(x));
watch();

/* mobile nav */
const bg=$('.burger'),mn=$('.mnav');
if(bg){bg.onclick=()=>{const o=mn.classList.toggle('open');bg.setAttribute('aria-expanded',o)};$$('a',mn).forEach(a=>a.onclick=()=>mn.classList.remove('open'))}

/* ask modal: callback or messenger, message carries product + page */
const modal=$('#ask');
function pageName(){return document.title.split(' |')[0]}
function openAsk(topic){
 const t=topic||'Вопрос с сайта';
 const text=`Здравствуйте! ${t}. Страница: ${pageName()}`;
 $('#askCtx').textContent=`${t} · страница «${pageName()}»`;
 $('#mTg').href='https://t.me/+'+PHONE;
 $('#mWa').href='https://wa.me/'+PHONE+'?text='+encodeURIComponent(text);
 $('#mMax').href='#';
 $('#callF').classList.remove('on');$('#done').style.display='none';
 modal.classList.add('open');modal.setAttribute('aria-hidden','false');
 setTimeout(()=>$('.mopts .call',modal).focus(),50);
}
function closeAsk(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
if(modal){
 modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.x'))closeAsk()});
 addEventListener('keydown',e=>{if(e.key==='Escape')closeAsk()});
 $('.mopts .call',modal).onclick=()=>{$('#callF').classList.add('on');$('#callF input').focus()};
 $('#callF').onsubmit=e=>{e.preventDefault();$('#done').style.display='block';$('#done').textContent='Заявка принята - перезвоним в течение 15 минут (в демо заявка не отправляется).'};
 $('#mMax').onclick=e=>{e.preventDefault();$('#done').style.display='block';$('#done').textContent='В рабочей версии откроется ваш чат в MAX с этим текстом.'};
 document.addEventListener('click',e=>{const a=e.target.closest('[data-ask]');if(!a)return;e.preventDefault();openAsk(a.dataset.ask||'')});
}

/* forms on page */
$$('form.form').forEach(f=>f.onsubmit=e=>{e.preventDefault();const b=$('button[type=submit]',f);const w=$('input[name=way]:checked',f);b.textContent=w&&w.value!=='Звонок'?'Готово - ответим в '+w.value:'Готово - перезвоним за 15 минут';b.disabled=true});

/* engine widget */
const E={
 N13:{f:'b',t:'R4 · 1.6 бензин турбо',n:4,rep:'от 60 000 ₽',buy:'от 170 000 ₽',w:'Цепь ГРМ, натяжитель, ванос.'},
 N20:{f:'b',t:'R4 · 2.0 бензин турбо',n:4,rep:'от 60 000 ₽',buy:'от 160 000 ₽',w:'Цепь ГРМ, ванос, маслосъёмные колпачки.'},
 N26:{f:'b',t:'R4 · 2.0 бензин турбо',n:4,w:'Цепь ГРМ, ванос, течи масла.'},
 N46:{f:'b',t:'R4 · 2.0 бензин',n:4,w:'Масложор, колпачки, Valvetronic.'},
 B48:{f:'b',t:'R4 · 2.0 бензин турбо',n:4,w:'Цепь ГРМ, помпа, течи масла.'},
 N52:{f:'b',t:'R6 · 3.0 бензин',n:6,w:'Гидрокомпенсаторы, ванос, масложор.'},
 N53:{f:'b',t:'R6 · 3.0 бензин',n:6,w:'Форсунки, катушки, NOx-датчик.'},
 N54:{f:'b',t:'R6 · 3.0 бензин битурбо',n:6,w:'Турбины, ТНВД, форсунки.'},
 N55:{f:'b',t:'R6 · 3.0 бензин турбо',n:6,rep:'от 100 000 ₽',buy:'от 230 000 ₽',w:'Ванос, маслосъёмные колпачки, течи масла.'},
 B58:{f:'b',t:'R6 · 3.0 бензин турбо',n:6,w:'Помпа, сепаратор картерных газов.'},
 N63:{f:'b',t:'V8 · 4.4 бензин битурбо',n:8,rep:'от 160 000 ₽',buy:'от 200 000 ₽',w:'Гильзовка, маслосъёмные колпачки, цепи ГРМ.'},
 N74:{f:'b',t:'V12 · 6.0 бензин битурбо',n:12,w:'Турбины, цепи ГРМ, течи масла.'},
 N47:{f:'d',t:'R4 · 2.0 дизель',n:4,rep:'от 170 000 ₽',buy:'от 170 000 ₽',w:'Цепь ГРМ сзади - ремонт со снятием ДВС.'},
 B47:{f:'d',t:'R4 · 2.0 дизель',n:4,w:'Цепь ГРМ, EGR, сажевый фильтр.'},
 N57:{f:'d',t:'R6 · 3.0 дизель',n:6,rep:'от 200 000 ₽',buy:'от 200 000 ₽',w:'Цепь ГРМ, вкладыши, турбины.'},
 B57:{f:'d',t:'R6 · 3.0 дизель',n:6,w:'Цепь ГРМ, турбины, EGR.'},
 S55:{f:'m',t:'R6 M · 3.0 битурбо',n:6,w:'Ступица коленвала, вкладыши.'},
 S63:{f:'m',t:'V8 M · 4.4 битурбо',n:8,rep:'от 180 000 ₽',buy:'от 300 000 ₽',w:'Вкладыши, гильзовка, ремонт ГБЦ.'}
};
const ORD={4:[0,2,3,1],6:[0,4,2,5,1,3],8:[0,4,3,7,5,2,6,1],12:[0,6,4,10,2,8,5,11,1,7,3,9]};
const codes=$('#codes');
if(codes){
 const svg=$('#esvg'),sw=$('#eswap');let cur=null;
 Object.keys(E).forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=k;b.dataset.f=E[k].f;b.onclick=()=>pick(k);codes.appendChild(b)});
 function draw(e){
  const sp=e.n>=8?.6:e.n===6?.8:1,o=ORD[e.n];let s='';
  const cyl=(x,y,i,w)=>{const d=(o.indexOf(i)/e.n)*sp,h=w/2;
   return `<g transform="translate(${x} ${y})"><rect x="${-h}" y="-58" width="${w}" height="76" fill="#22262b"/>
   <rect class="fire" x="${-h+3}" y="-55" width="${w-6}" height="11" fill="#5bb6ea" style="--d:-${d}s;--sp:${sp}s"/>
   <g class="pist" style="--d:-${d}s;--sp:${sp}s;--tr:24px"><rect x="${-h+3}" y="-43" width="${w-6}" height="18" fill="#e9ecef"/><rect x="-2.5" y="-25" width="5" height="34" fill="#7c838a"/></g></g>`};
  const base=(x,w,y)=>`<rect x="${x}" y="${y}" width="${w}" height="12" fill="#16181b"/><g transform="translate(${x} ${y+12})"><rect width="${w/3}" height="4" fill="#5bb6ea"/><rect x="${w/3}" width="${w/3}" height="4" fill="#24357a"/><rect x="${2*w/3}" width="${w/3}" height="4" fill="#e1261c"/></g>`;
  if(e.n<=6){const st=52,w=e.n*st,x0=(440-w)/2+st/2;for(let i=0;i<e.n;i++)s+=cyl(x0+i*st,92,i,38);s+=base(x0-st/2,w,122)}
  else{const per=e.n/2,st=e.n===12?33:46,cw=e.n===12?26:34;let a='',b='';
   for(let i=0;i<per;i++){a+=cyl(30+cw/2+i*st,96,i,cw);b+=cyl(250+cw/2+i*st,96,i+per,cw)}
   s+=`<g transform="rotate(-8 115 120)">${a}</g><g transform="rotate(8 330 120)">${b}</g>`+base(20,400,126)}
  svg.innerHTML=s;
 }
 function pick(k){if(k===cur)return;cur=k;$$('button',codes).forEach(b=>b.classList.toggle('on',b.textContent===k));
  sw.classList.add('out');setTimeout(()=>{const e=E[k];$('#ecode').textContent=k;$('#etype').textContent=e.t;$('#erep').textContent=e.rep||'по запросу';$('#ebuy').textContent=e.buy||'по запросу';$('#ework').textContent='Частое: '+e.w;$('#eask').dataset.ask='Ремонт / двигатель '+k;draw(e);sw.classList.remove('out')},RM?0:200)}
 $('#fam').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#fam button').forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;$$('button',codes).forEach(c=>c.hidden=f!=='all'&&c.dataset.f!==f);const first=$$('button:not([hidden])',codes)[0];if(first&&$('button.on',codes)?.hidden!==false)pick(first.textContent)});
 pick('N63');
}

/* price table */
const P={
 rep:[['N13','от 60 000 ₽'],['N20','от 60 000 ₽'],['N55','от 100 000 ₽'],['N63','от 160 000 ₽'],['S63','от 180 000 ₽'],['N47','от 170 000 ₽'],['N57','от 200 000 ₽'],['Другие','по запросу']],
 buy:[['N13','от 170 000 ₽'],['N20','от 160 000 ₽'],['N55','от 230 000 ₽'],['N63','от 200 000 ₽'],['S63','от 300 000 ₽'],['N47','от 170 000 ₽'],['N57','от 200 000 ₽'],['Другие','по запросу']],
 to:[['Замена ДВС','по запросу'],['Замена цепи ГРМ','по запросу'],['Замена масла','от 500 ₽'],['Замена колодок','от 500 ₽'],['Сайлентблоки','от 500 ₽'],['Дооснащение F/G','от 120 000 ₽'],['M Power / M Стиль','комплект'],['Рулевые рейки','по запросу']]
};
const pt=$('#ptable');
if(pt){
 const lab={rep:'Ремонт двигателя',buy:'Двигатель б/у с гарантией',to:'Работа'};
 const render=k=>{pt.innerHTML=P[k].map(([a,b])=>`<div class="pcell"><span>${lab[k]}</span><b>${a}</b><em>${b}</em></div>`).join('')};
 render('rep');
 $('#ptabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#ptabs button').forEach(x=>x.classList.toggle('on',x===b));render(b.dataset.k)});
}

/* avito showcase (sample cards) */
const A={
 parts:[
  ['Двигатель BMW N63B44 в сборе','от 200 000 ₽','N63','p5','Проверен · гарантия 60 дней'],
  ['Двигатель BMW S63B44 контрактный','от 300 000 ₽','S63','p2','Видео работы по запросу'],
  ['ГБЦ N55 в сборе','28 000 ₽','N55','p8','С разборки · проверена'],
  ['Турбина N63 левая','62 000 ₽','N63','p3','С разборки · гарантия'],
  ['Двигатель BMW N57 3.0d','от 200 000 ₽','N57','p4','Работает на 100%'],
  ['Комплект цепей ГРМ N47','14 500 ₽','N47','p1','Новый · в наличии'],
  ['Ванос впуск N20','9 800 ₽','N20','p6','С разборки · проверен'],
  ['Коленвал S63 после шлифовки','45 000 ₽','S63','p7','Мехобработка в своём цехе']],
 serv:[
  ['Замена цепей ГРМ N47 / N57','от 45 000 ₽','N57','p4','Со снятием ДВС · гарантия'],
  ['Гильзовка блока N63','от 120 000 ₽','N63','p5','Своя мехобработка'],
  ['Ремонт ГБЦ, опрессовка','от 25 000 ₽','N55','p8','Шлифовка, сёдла, направляющие'],
  ['Установка контрактного ДВС','от 35 000 ₽','N20','p1','Подбор и диагностика'],
  ['Капремонт S63','от 180 000 ₽','S63','p2','Вкладыши, гильзы, ГБЦ'],
  ['Замена ваносов','по запросу','N55','p6','Оригинал и аналоги'],
  ['Замена МСК (колпачков)','по запросу','N63','p3','Без снятия ГБЦ где возможно'],
  ['Приём ДВС от СТО','B2B','N57','p7','Снятый мотор или авто целиком']]
};
const items=$('#items');
if(items){
 let acc='parts',flt='all';
 const render=()=>{const list=A[acc].filter(x=>flt==='all'||x[2]===flt);
  items.innerHTML=list.length?list.map(([n,p,c,img,m],i)=>`<article class="item rv" style="--i:${i%4}"><div class="ph"><img src="img/${img}.webp" alt="${n}" loading="lazy" width="900" height="675"><span class="tag">${c}</span></div><div class="bd"><h4>${n}</h4><div class="meta">${m}</div><div class="pr">${p}</div><div class="act"><a href="#" onclick="return false">На Авито</a><button type="button" data-ask="Объявление: ${n}, ${p}">Спросить</button></div></div></article>`).join(''):`<p class="note">По этому мотору сейчас нет объявлений - <a href="#" data-ask="Нужна позиция под мотор ${flt}">спросите, найдём</a>.</p>`;
  watch()};
 render();
 $('#acc').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#acc button').forEach(x=>x.classList.toggle('on',x===b));acc=b.dataset.a;render()});
 $('#flt').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#flt button').forEach(x=>x.classList.toggle('on',x===b));flt=b.dataset.f;render()});
}
