const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const PHONE='79167016393',MAXURL='https://max.ru/channel_MRZclub_engine',TGURL='https://t.me/+'+PHONE;
requestAnimationFrame(()=>document.documentElement.classList.add('ready'));

/* демо-плашка можно закрыть */
const demo=$('.demo');
if(demo){if(sessionStorage.getItem('demoX'))demo.remove();else{const x=document.createElement('button');x.type='button';x.textContent='×';x.setAttribute('aria-label','Скрыть плашку');x.onclick=()=>{demo.remove();sessionStorage.setItem('demoX','1')};demo.append(x)}}

/* шапка + прогресс чтения + плавающая кнопка: один rAF-обработчик скролла */
const hd=$('header'),fab=$('.fab'),hero=$('.hero');
const spb=document.createElement('div');spb.className='spb';document.body.prepend(spb);
let lastY=0,tick=false;
function onScroll(){tick=false;const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
 hd.classList.toggle('solid',!hero||y>innerHeight-90);
 hd.classList.toggle('hide',y>lastY+4&&y>300&&!hd.classList.contains('menu-open'));
 if(y<lastY-4||y<300)hd.classList.remove('hide');
 lastY=y;if(fab)fab.classList.toggle('on',y>innerHeight*.8);
 spb.style.transform='scaleX('+(max>0?Math.min(1,y/max):0)+')'}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* появление блоков */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target)}),{threshold:.1,rootMargin:'0px 0px -30px 0px'});
$$('.rv,.dr,.s4').forEach(el=>{const i=[...el.parentElement.children].indexOf(el);el.style.transitionDelay=Math.min(i,5)*70+'ms';io.observe(el)});

/* ---------- Поршень: «Где болит?» + короткая форма ---------- */
const ov=$('.ov'),dlg=$('.dlg');
const TOPICS=[
 ['Двигатель стучит, дымит, ест масло','Это ремонт: дефектовка, смета и фотоотчёт до начала работ.','index.html#process','Как проходит ремонт и сколько стоит','Ремонт двигателя'],
 ['Ремонт или другой двигатель?','Сравним ремонт вашего мотора с контрактным и восстановленным ДВС.','index.html#engines','Выбрать мотор по коду','Ремонт или замена ДВС'],
 ['Нужна запчасть','Каталог с Авито: сначала запчасти, затем услуги. Есть поиск.','index.html#offers','Открыть каталог','Запчасть'],
 ['Хочу продать авто или мотор','Оценка по фото за 15 минут, оплата сразу.','vykup.html','Страница выкупа','Выкуп']
];
const VIA=['Перезвонить','Telegram','WhatsApp','MAX'];
let ctxBase='',topic='',via='Перезвонить',lastFocus=null;
if(dlg){
 dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');dlg.setAttribute('aria-hidden','true');dlg.setAttribute('aria-labelledby','dt');
 dlg.innerHTML=`<button class="x" aria-label="Закрыть" type="button">×</button>
 <div class="pst"><video class="av" src="../final/piston.mp4" poster="../final/piston.webp" muted loop playsinline preload="none" width="76" height="76" aria-hidden="true"></video><div class="say" aria-live="polite"><span class="tx"></span><span class="wv" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div></div>
 <h3 id="dt">Где <b style="font-weight:700">болит?</b></h3>
 <div class="ctx"></div>
 <div class="pq">${TOPICS.map((t,i)=>`<button type="button" data-i="${i}">${t[0]}<span aria-hidden="true">→</span></button>`).join('')}</div>
 <div class="hint" role="status"></div>
 <form class="cb" novalidate>
  <label>Двигатель или модель<input name="m" maxlength="80" autocomplete="off" placeholder="Например: N55, X5 F15"></label>
  <label>Что случилось<textarea name="t" maxlength="500" placeholder="Симптомы, пробег, что уже делали"></textarea></label>
  <label>Как ответить<div class="via">${VIA.map((v,i)=>`<button type="button" data-v="${v}"${i?'':' class="on"'}>${v}</button>`).join('')}</div></label>
  <label class="ph">Телефон<input name="p" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__"></label>
  <button class="btn btn-d" type="submit">Отправить вопрос мастеру</button>
 </form>
 <div class="done" role="status"></div>
 <button class="snd" type="button">Звук: вкл</button>
 <p class="src">Демо: заявка соберётся в текст со ссылкой на страницу.</p>`;
}
const F=()=>$('form.cb',dlg);
function setVia(v){via=v;$$('.via button',dlg).forEach(b=>b.classList.toggle('on',b.dataset.v===v));const ph=$('.ph',dlg);ph.hidden=v!=='Перезвонить';$('input',ph).required=v==='Перезвонить'}
function ask(ctx,model){
 if(!dlg)return;lastFocus=document.activeElement;ctxBase=ctx||'';topic='';
 $('.ctx',dlg).textContent=ctxBase;$('.hint',dlg).classList.remove('on');$('.done',dlg).style.display='none';
 $$('.pq button',dlg).forEach(b=>b.classList.remove('on'));F().style.display='';F().reset();setVia('Перезвонить');
 if(model)F().m.value=model;
 ov.classList.add('on');dlg.classList.add('on');dlg.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
 setTimeout(()=>$('.pq button',dlg).focus({preventScroll:true}),60);setTimeout(()=>say(HELLO,$('.say',dlg),$('.pst .av',dlg),true),250)}
function closeDlg(){if(!dlg||!dlg.classList.contains('on'))return;stopSay();ov.classList.remove('on');dlg.classList.remove('on');dlg.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus&&lastFocus.focus&&lastFocus.focus({preventScroll:true})}
function draft(){const f=F();return ['Здравствуйте!',topic||ctxBase,f.m.value.trim()&&'Двигатель/модель: '+f.m.value.trim(),f.t.value.trim()&&'Вопрос: '+f.t.value.trim(),via==='Перезвонить'&&'Перезвоните: '+f.p.value.trim(),'Страница: '+location.href.split('#')[0]].filter(Boolean).join('\n')}
if(dlg){
 ov.onclick=closeDlg;$('.x',dlg).onclick=closeDlg;
 dlg.addEventListener('click',e=>{const t=e.target.closest('.pq button');
  if(t){const T=TOPICS[+t.dataset.i];topic=T[4];$$('.pq button',dlg).forEach(b=>b.classList.toggle('on',b===t));const h=$('.hint',dlg);h.innerHTML=`${T[1]}<br><a href="${T[2]}">${T[3]} →</a>`;h.classList.remove('on');void h.offsetWidth;h.classList.add('on')}
  const v=e.target.closest('.via button');if(v)setVia(v.dataset.v);
  if(e.target.closest('.hint a'))closeDlg();
  if(e.target.closest('[data-copy]')){navigator.clipboard&&navigator.clipboard.writeText(draft()).then(()=>{e.target.textContent='Скопировано ✓'})}});
 dlg.addEventListener('submit',e=>{e.preventDefault();const f=F(),p=f.p.value.replace(/\D/g,'');
  if(via==='Перезвонить'&&p.length<10){f.p.setCustomValidity('Введите номер полностью');f.p.reportValidity();f.p.oninput=()=>f.p.setCustomValidity('');return}
  const text=draft(),enc=encodeURIComponent(text),d=$('.done',dlg);
  let go='';if(via==='WhatsApp')go=`https://wa.me/${PHONE}?text=${enc}`;else if(via==='Telegram')go=TGURL;else if(via==='MAX')go=MAXURL;
  d.innerHTML=`<b>${via==='Перезвонить'?'Спасибо! Перезвоним в течение 15 минут в рабочее время.':'Обращение собрано'}</b><pre></pre>`+(go?`<a class="btn btn-d" href="${go}" target="_blank" rel="noopener">Открыть ${via}</a> `:'')+`<button class="btn btn-l" type="button" data-copy>Скопировать текст</button>`;
  $('pre',d).textContent=text;d.style.display='block';f.style.display='none';
  document.dispatchEvent(new CustomEvent('bmw:goal',{detail:{goal:'request_prepared',via}}));d.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'})});
 document.addEventListener('click',e=>{const a=e.target.closest('[data-ask]');if(a){e.preventDefault();ask(a.dataset.ask,a.dataset.model)}});
 addEventListener('keydown',e=>{if(!dlg.classList.contains('on'))return;
  if(e.key==='Escape')closeDlg();
  if(e.key==='Tab'){const f=$$('button,a[href],input,textarea,select',dlg).filter(x=>!x.disabled&&x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];
   if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}})}

/* бургер-меню */
const burger=$('.burger');
function toggleMenu(open){hd.classList.toggle('menu-open',open);hd.classList.remove('hide');burger.setAttribute('aria-expanded',String(open))}
burger.onclick=()=>toggleMenu(burger.getAttribute('aria-expanded')!=='true');
document.addEventListener('click',e=>{if(!hd.contains(e.target)||e.target.closest('a,[data-ask]'))toggleMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&hd.classList.contains('menu-open')){toggleMenu(false);burger.focus()}});
matchMedia('(max-width:1100px)').addEventListener('change',()=>toggleMenu(false));
/* Поршень говорит: живая запись приветствия, анимация персонажа, печать текста */
const HELLO='Привет! Чем помочь?';const VOICE_SPEED=1.45;
const reduced=RM;
let sndOn=localStorage.getItem('snd')!=='0',typeT=0,voiceAu=null;
function getAu(){if(!voiceAu){voiceAu=new Audio('../final/welcome.mp3');voiceAu.preload='auto'}return voiceAu}
function fallbackTTS(text){if(!window.speechSynthesis)return;try{speechSynthesis.cancel();const s=new SpeechSynthesisUtterance(text);s.lang='ru-RU';s.rate=1.5;s.pitch=2;speechSynthesis.speak(s)}catch(e){}}
function playClip(el){if(el&&el.play){el.currentTime=0;el.playbackRate=1.4;el.play().catch(()=>{})}}
function say(text,box,av,voice){
 const tx=box.querySelector('.tx');clearTimeout(typeT);tx.textContent='';
 if(voiceAu)voiceAu.pause();
 if(reduced){tx.textContent=text;return}
 let delay=60;
 if(voice&&sndOn){const a=getAu();a.currentTime=0;a.preservesPitch=false;a.mozPreservesPitch=false;a.webkitPreservesPitch=false;a.playbackRate=VOICE_SPEED;const dur=(isFinite(a.duration)&&a.duration>0?a.duration:2.2)/VOICE_SPEED;delay=Math.max(40,dur*880/text.length);
  const p=a.play();if(p&&p.catch)p.catch(()=>fallbackTTS(text))}
 box.classList.add('typing','talking');if(av){av.classList.add('talk');if(av.play)playClip(av)}
 let i=0;(function step(){tx.textContent=text.slice(0,++i);
  if(i<text.length){typeT=setTimeout(step,delay)}else{box.classList.remove('typing');typeT=setTimeout(()=>{box.classList.remove('talking');if(av){av.classList.remove('talk');if(av.pause)av.pause()}},500)}})()}
function stopSay(){clearTimeout(typeT);if(voiceAu)voiceAu.pause();if(window.speechSynthesis)speechSynthesis.cancel();if(dlg){const av=$('.pst .av',dlg);$('.say',dlg).classList.remove('typing','talking');av.classList.remove('talk');av.pause()}}
if(dlg){const sb=$('.snd',dlg);sb.textContent=sndOn?'Звук: вкл':'Звук: выкл';
 sb.onclick=()=>{sndOn=!sndOn;localStorage.setItem('snd',sndOn?'1':'0');sb.textContent=sndOn?'Звук: вкл':'Звук: выкл';if(!sndOn&&voiceAu)voiceAu.pause()};
 $('.pst .av',dlg).onclick=()=>say(HELLO,$('.say',dlg),$('.pst .av',dlg),true)}
/* подсказка у кнопки: один раз через 5 секунд */
const pis=$('.pis');
if(pis&&dlg&&!sessionStorage.getItem('pbub')){const b=document.createElement('div');b.className='pbub';b.setAttribute('aria-hidden','true');b.innerHTML='<span class="tx"></span>';pis.parentElement.append(b);
 setTimeout(()=>{if(dlg.classList.contains('on'))return;sessionStorage.setItem('pbub','1');b.classList.add('on');const im=$('img',pis),t=b.querySelector('.tx');let i=0;im.classList.add('talk');
  (function s(){t.textContent=HELLO.slice(0,++i);if(i<HELLO.length)setTimeout(s,70);else{im.classList.remove('talk');setTimeout(()=>b.classList.remove('on'),4500)}})()},5000)}