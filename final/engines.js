const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
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
 S58:{f:'m',t:'S58B30 · R6 M · 3.0 битурбо',n:6,w:'Диагностика, проверка цилиндров и привода ГРМ.'},
 S55:{f:'m',t:'R6 M · 3.0 битурбо',n:6,w:'Ступица коленвала, вкладыши.'},
 S63:{f:'m',t:'S63B44 · V8 M · 4.4 битурбо',n:8,rep:'от 180 000 ₽',buy:'от 300 000 ₽',w:'Вкладыши, гильзовка, ремонт ГБЦ.'}
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
   <rect class="fire" x="${-h+3}" y="-55" width="${w-6}" height="11" fill="#ffcc50" style="--d:-${d}s;--sp:${sp}s"/>
   <g class="pist" style="--d:-${d}s;--sp:${sp}s;--tr:24px"><rect x="${-h+3}" y="-43" width="${w-6}" height="18" fill="#e9ecef"/><rect x="-2.5" y="-25" width="5" height="34" fill="#7c838a"/></g></g>`};
  const base=(x,w,y)=>`<rect x="${x}" y="${y}" width="${w}" height="12" fill="#16181b"/><g transform="translate(${x} ${y+12})"><rect width="${w/3}" height="4" fill="#ffcc50"/><rect x="${w/3}" width="${w/3}" height="4" fill="#24357a"/><rect x="${2*w/3}" width="${w/3}" height="4" fill="#e1261c"/></g>`;
  if(e.n<=6){const st=52,w=e.n*st,x0=(440-w)/2+st/2;for(let i=0;i<e.n;i++)s+=cyl(x0+i*st,92,i,38);s+=base(x0-st/2,w,122)}
  else{const per=e.n/2,st=e.n===12?33:46,cw=e.n===12?26:34;let a='',b='';
   for(let i=0;i<per;i++){a+=cyl(30+cw/2+i*st,96,i,cw);b+=cyl(250+cw/2+i*st,96,i+per,cw)}
   s+=`<g transform="rotate(-8 115 120)">${a}</g><g transform="rotate(8 330 120)">${b}</g>`+base(20,400,126)}
  svg.innerHTML=s;
 }
 function pick(k){if(k===cur)return;cur=k;$$('button',codes).forEach(b=>b.classList.toggle('on',b.textContent===k));
  sw.classList.add('out');setTimeout(()=>{const e=E[k];$('#ecode').textContent=k;$('#etype').textContent=e.t;$('#erep').textContent=e.rep||'по запросу';$('#ebuy').textContent=e.buy||'по запросу';$('#ework').textContent='Частое: '+e.w;$('#eask').href='repair.html?engine='+k;$('#ebrowse').href='contract.html?engine='+k;$('#eparts').href='parts.html?engine='+k;draw(e);sw.classList.remove('out')},RM?0:200)}
 $('#fam').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#fam button').forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;$$('button',codes).forEach(c=>c.hidden=f!=='all'&&c.dataset.f!==f);const first=$$('button:not([hidden])',codes)[0];if(first&&$('button.on',codes)?.hidden!==false)pick(first.textContent)});
 pick('N63');
}

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
