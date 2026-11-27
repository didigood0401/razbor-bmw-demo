const E=[
 ['N13','N13B16','b','R4 · 1.6 турбо','F20 116i/118i · F30 316i',60000,170000,'Цепь ГРМ, натяжитель, ванос'],
 ['N20','N20B20','b','R4 · 2.0 турбо','F30 320i/328i · F10 520i/528i · X3 F25',60000,160000,'Цепь ГРМ, ванос, маслосъёмные колпачки'],
 ['N52','N52B30','b','R6 · 3.0','E90 325i/330i · E60 525i/530i · X3 E83',0,0,'Гидрокомпенсаторы, ванос, масложор'],
 ['N54','N54B30','b','R6 · 3.0 битурбо','E92 335i · F07 535i · Z4 E89',0,0,'Турбины, ТНВД, форсунки'],
 ['N55','N55B30','b','R6 · 3.0 турбо','F10 535i · F30 335i · X5 F15 35i',100000,230000,'Ванос, колпачки, течи масла'],
 ['B58','B58B30','b','R6 · 3.0 турбо','G30 540i · G11 740i · X5 G05',0,0,'Помпа, сепаратор картерных газов'],
 ['N63','N63B44','b','V8 · 4.4 битурбо','F10 550i · X5 F15 50i · X6 F16',160000,200000,'Гильзовка, колпачки, цепи ГРМ'],
 ['N47','N47D20','d','R4 · 2.0 дизель','F30 320d · F10 520d · X3 F25 20d',170000,170000,'Цепь ГРМ сзади - со снятием ДВС'],
 ['B47','B47D20','d','R4 · 2.0 дизель','G20 320d · G30 520d · X3 G01',0,0,'Цепь ГРМ, EGR, сажевый фильтр'],
 ['N57','N57D30','d','R6 · 3.0 дизель','F10 530d · X5 F15 30d · X6 30d',200000,200000,'Цепь ГРМ, вкладыши, турбины'],
 ['B57','B57D30','d','R6 · 3.0 дизель','G30 530d · X5 G05 30d · X6 G06',0,0,'Цепь ГРМ, турбины, EGR'],
 ['S55','S55B30','m','M · R6 3.0 битурбо','M3 F80 · M4 F82',0,0,'Ступица коленвала, вкладыши'],
 ['S58','S58B30','m','M · R6 3.0 битурбо','M3 G80 · M4 G82 · X3 M',0,0,'Диагностика цилиндров и привода ГРМ'],
 ['S63','S63B44','m','M · V8 4.4 битурбо','M5 F10/F90 · X5 M · X6 M',180000,300000,'Вкладыши, гильзовка, ГБЦ']
];
const rub=n=>n?'от '+n.toLocaleString('ru-RU')+' ₽':'по запросу';
const LAB={b:'Бензин',d:'Дизель',m:'M'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const smooth=RM?'auto':'smooth';
const card=(e,i)=>`<article class="eng" data-code="${e[0]}" style="--i:${i}"><div class="ty"><span>${LAB[e[2]]}</span>${e[2]==='m'?'<i>M</i>':''}</div><b>${e[0]}</b><div class="full">${e[1]} · ${e[3]}</div><div class="md">${e[4]}</div><div class="pp"><span>Ремонт: <b>${rub(e[5])}</b></span><span>ДВС: <b>${rub(e[6])}</b></span></div><div class="ea"><button data-ask="${e[1]}: ремонт" data-model="${e[1]}">Ремонт</button><button data-ask="${e[1]}: купить ДВС" data-model="${e[1]}">Купить ДВС</button><button data-q="${e[0]}">Запчасти</button></div></article>`;
const et=$('#etrack');
function eprog(){const m=et.scrollWidth-et.clientWidth,w=et.scrollWidth?et.clientWidth/et.scrollWidth*100:100;$('#eprog').style.width=Math.min(100,w)+'%';$('#eprog').style.left=(m>0?et.scrollLeft/m*(100-w):0)+'%'}
function dropNF(){const n=$('#nf');if(n)n.parentNode.removeChild(n)}
function engines(t){const L=E.filter(e=>t==='all'||e[2]===t);et.innerHTML=L.map(card).join('');et.scrollLeft=0;eprog()}
function pick(code){const c=String(code||'').trim().toUpperCase();if(!c)return;dropNF();
 const hit=E.filter(e=>e[0].startsWith(c)||e[1].startsWith(c));
 $$('#etabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==='all'));engines('all');
 $('#engines').scrollIntoView({behavior:smooth});
 if(!hit.length){et.insertAdjacentHTML('beforebegin','<p class="eng-empty" id="nf">Кода «'+esc(c)+'» пока нет в списке - <a class="lnk bl" href="#" data-ask="Двигатель '+esc(c)+'">спросите нас</a>, подберём.</p>');return}
 const el=$('.eng[data-code="'+hit[0][0]+'"]',et);el.classList.add('hl');
 setTimeout(()=>et.scrollTo({left:el.offsetLeft-et.offsetLeft-8,behavior:smooth}),RM?0:450);setTimeout(()=>el.classList.remove('hl'),3500);
 $('#pe').value=hit[0][0];price()}
et.addEventListener('scroll',eprog,{passive:true});addEventListener('resize',eprog);
$('#etabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;dropNF();$$('#etabs button').forEach(x=>x.classList.toggle('on',x===b));engines(b.dataset.t)};
et.onclick=e=>{const q=e.target.closest('[data-q]');if(!q)return;$('#oq').value=q.dataset.q;OA='all';$$('#oacc button').forEach(x=>x.classList.toggle('on',x.dataset.a==='all'));offers();$('#offers').scrollIntoView({behavior:smooth})};
const epx=()=>(et.firstElementChild?et.firstElementChild.offsetWidth+16:300);
$('#enx').onclick=()=>et.scrollBy({left:epx(),behavior:'smooth'});$('#epv').onclick=()=>et.scrollBy({left:-epx(),behavior:'smooth'});
engines('all');

/* поиск по коду в hero */
$('#dl').innerHTML=E.map(e=>`<option value="${e[0]}">${e[1]}</option>`).join('');
$('#chs').innerHTML=['N55','N63','S63','N20','N47','N57'].map(c=>`<button type="button" data-c="${c}">${c}</button>`).join('');
$('#chs').onclick=e=>{const b=e.target.closest('button');if(b){$('#fq').value=b.dataset.c;pick(b.dataset.c)}};
$('#find').onsubmit=e=>{e.preventDefault();pick($('#fq').value)};
$$('footer [data-e]').forEach(a=>a.onclick=ev=>{ev.preventDefault();pick(a.dataset.e)});
/* ориентировочная цена + раскрывающийся прайс */
$('#pe').innerHTML=E.map(e=>`<option value="${e[0]}">${e[1]} · ${e[3]}</option>`).join('');$('#pe').value='N55';
function price(){const e=E.find(x=>x[0]===$('#pe').value);$('#pp').innerHTML=e[5]?`<em>от</em> ${e[5].toLocaleString('ru-RU')} ₽`:'По смете';$('#pw').textContent='Типичные работы: '+e[7].toLowerCase()+'.';$('#pask').dataset.ask='Расчёт ремонта '+e[1];$('#pask').dataset.model=e[1]}
$('#pe').onchange=price;price();
const P=[['Компьютерная диагностика, эндоскопия, компрессия','от 5 000 ₽'],['Дефектовка с разборкой: фото и видео износа','от 15 000 ₽'],...E.filter(e=>e[5]).map(e=>[e[1]+' · '+e[7],rub(e[5])]),['Мехобработка: гильзовка блока, ремонт ГБЦ, постели','по запросу'],['Обкатка, адаптации, тест-драйв','входит в ремонт']];
$('#rows').innerHTML=P.map((r,i)=>`<div class="rw" style="--i:${i}"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')+'<div class="rw sub">Демо-цены ориентировочные, боевой прайс согласуем с заказчиком.</div>';

/* Авито: сначала запчасти, потом услуги */
const O=[['z','Двигатель N55 B30 в сборе','230 000 ₽','F10 · пробег 84 000 км','p2'],['z','ГБЦ N63 в сборе','65 000 ₽','проверена, опрессована','p4'],['z','Двигатель S63 B44','300 000 ₽','M5 F10 · гарантия 60 дней','p7'],['z','Турбина N57 левая','38 000 ₽','X5 F15 30d','p5'],['z','Блок цилиндров N20','45 000 ₽','без задиров','p6'],['s','Ремонт двигателя N63','от 60 000 ₽','дефектовка, смета, фотоотчёт','p3'],['s','Гильзовка блока цилиндров','по запросу','мехобработка на своём оборудовании','p1'],['s','Выкуп неисправного ДВС','оценка за 15 мин','BMW, Haval, Exeed','p8'],['s','Установка контрактного ДВС','по запросу','для разборок и частных лиц','p2']];
const ot=$('#otrack');let OA='all';
function offers(){const q=($('#oq').value||'').trim().toLowerCase();const L=O.filter(o=>(OA==='all'||o[0]===OA)&&(!q||(o[1]+' '+o[3]).toLowerCase().includes(q)));
 ot.innerHTML=L.length?L.map(o=>`<div class="of"><div class="im"><img src="../img/${o[4]}.webp" alt="${esc(o[1])}" width="640" height="480" loading="lazy" decoding="async"><span>${o[0]==='s'?'Услуги':'Запчасти'} · Авито</span></div><h3>${esc(o[1])}</h3><div class="pr">${o[2]}</div><div class="sm">${esc(o[3])}</div><div class="ob"><a class="btn btn-d" href="https://www.avito.ru/${o[0]==='s'?'brands/razborbmw.msk':'user/81631be4df98262c27509e972acbbbc2/profile'}" target="_blank" rel="noopener">Купить на Авито</a><button class="btn btn-l" data-ask="Вопрос по товару: ${esc(o[1])}">Спросить</button></div></div>`).join(''):'<p class="avn">Ничего не найдено - <a href="#" data-ask="Поиск запчасти">спросите нас</a>, подберём.</p>';
 ot.scrollLeft=0;prog()}
function prog(){const m=ot.scrollWidth-ot.clientWidth,w=ot.scrollWidth?ot.clientWidth/ot.scrollWidth*100:100;$('#oprog').style.width=Math.min(100,w)+'%';$('#oprog').style.left=(m>0?ot.scrollLeft/m*(100-w):0)+'%'}
ot.addEventListener('scroll',prog,{passive:true});addEventListener('resize',prog);offers();
$('#oacc').onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('#oacc button').forEach(x=>x.classList.toggle('on',x===b));OA=b.dataset.a;offers()};
let qt;$('#oq').oninput=()=>{clearTimeout(qt);qt=setTimeout(offers,120)};
const ost=()=>(ot.firstElementChild?ot.firstElementChild.offsetWidth+16:300);
$('#onx').onclick=()=>ot.scrollBy({left:ost(),behavior:'smooth'});$('#opv').onclick=()=>ot.scrollBy({left:-ost(),behavior:'smooth'});
/* этапы: горизонтальная линия, шаги загораются по очереди */
const st=$$('.stp'),sw=$('#steps');let cur=-1,run=0;
function setStep(n){cur=n;st.forEach((s,k)=>{s.classList.toggle('on',k===n);s.classList.toggle('done',k<n)});sw.style.setProperty('--p',n<=0?0:n/(st.length-1))}
function play(id){if(id!==run||cur>=st.length-1)return;setStep(cur+1);
 if(sw.scrollWidth>sw.clientWidth)sw.scrollTo({left:st[cur].offsetLeft-sw.offsetLeft-12,behavior:'smooth'});
 setTimeout(()=>play(id),700)}st.forEach((s,k)=>{s.onclick=()=>{run++;setStep(k)}});
setStep(0);const watcher=new IntersectionObserver(list=>{
 run++;
 if(!list.some(x=>x.isIntersecting))return;
 setTimeout(()=>play(run),300)
},{threshold:.35});
watcher.observe(sw);
RM&&setStep(5);
