'use strict';
const currentPage = document.body.dataset.page;
const params = new URLSearchParams(location.search);
const requestedEngine = (params.get('engine') || '').toUpperCase().replace(/^S63B44$/, 'S63');
const engine = Object.hasOwn(E, requestedEngine) ? requestedEngine : '';
const routes = {
  repair: ['Ремонт двигателя', 'repair.html', 'Как проявляется неисправность? Например, стук на холодную или расход масла.'],
  chains: ['Замена цепей ГРМ', 'chains.html', 'Укажите пробег и когда слышен шум.'],
  contract: ['Подбор двигателя', 'contract.html', 'Какой мотор ищете и нужна ли установка?'],
  rebuilt: ['Восстановленный ДВС', 'rebuilt.html', 'Какой мотор нужен и планируется ли обмен старого ДВС?'],
  parts: ['Поиск запчасти', 'parts.html', 'Какая деталь нужна? Если знаете, добавьте маркировку.'],
  buyout: ['Оценка на выкуп', 'buyout.html', 'Что продаёте, в каком состоянии и в каком городе?'],
  partner: ['Заявка от СТО', 'partner.html', 'Снятый ДВС или автомобиль? Что уже проверено?'],
  machining: ['Мехобработка', 'machining.html', 'Какую деталь нужно обработать?'],
  install: ['Установка ДВС', 'install.html', 'Двигатель уже куплен? Уточните модель автомобиля.'],
  gearbox: ['Ремонт и подбор АКПП', 'gearbox.html', 'Укажите маркировку коробки или модель и год автомобиля.']
};
const assistant = $('#assistant');
const conversation = $('#conversation');
const title = $('#assistant-title');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const welcome = $('#robot-welcome');
let greetingAudio;
function dismissWelcome() {
  if (!welcome || welcome.hidden) return;
  welcome.hidden = true;
  $('video', welcome).pause();
  greetingAudio?.pause();
}
motionPreference.addEventListener('change', event => {
  if(event.matches) $('video',assistant).pause();
});
let intent = 'repair', topic = '', draft = '', preferred = '', details = '', model = '', sourceFocus;
let itemUrl = '';
function make(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}
function button(text, action, style = 'secondary') {
  const b = make('button', text, style); b.type = 'button'; b.onclick = action; return b;
}
function link(text, href, className) {
  const a = make('a', text, className); a.href = href; return a;
}
function display(heading) {
  title.textContent = heading; conversation.replaceChildren(); title.focus({preventScroll:true});
}
function track(goal, info = {}) {
  const data = {page:currentPage, ...info};
  document.dispatchEvent(new CustomEvent('bmw:goal', {detail:{goal,...data}}));
  const id = document.documentElement.dataset.metrikaId;
  if (id && typeof window.ym === 'function') window.ym(Number(id), 'reachGoal', goal, data);
}
function openAssistant() {
  if (assistant.open) return;
  sourceFocus = document.activeElement;
  if (welcome?.contains(sourceFocus)) sourceFocus = $('.robot-launch');
  if (sourceFocus?.closest('.master-contact')) sourceFocus = $('.master-contact summary');
  dismissWelcome();
  assistant.showModal(); document.body.classList.add('modal-open');
  if (!motionPreference.matches) {const movie=$('video',assistant); movie.currentTime=0; movie.play().catch(()=>{});}
  track('assistant_open');
}
assistant.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('video',assistant).pause();sourceFocus?.focus({preventScroll:true});});
$('.close-dialog').onclick=()=>assistant.close();
assistant.addEventListener('click',e=>{if(e.target===assistant)assistant.close();});
function reset() {
  intent=routes[currentPage]?currentPage:'repair';
  topic=''; preferred=''; details=''; draft=''; itemUrl='';
  model=engineLabel(engine || $('#codes')?.dataset.selected || '');
}
function start() {
  display('Где болит?');
  conversation.append(make('p','Выберите задачу. Я задам пару вопросов и соберу обращение для моториста.'));
  const choices=make('div','','choices');
  for (const [name,action] of [
    ['Двигатель стучит или дымит',()=>selectIntent('repair')],
    ['Ремонт или другой ДВС?',compare],
    ['Нужна запчасть или АКПП',choosePart],
    ['Хочу продать авто или мотор',()=>selectIntent('buyout')]
  ]) choices.append(button(name+' →',action));
  conversation.append(choices);
}
function choosePart() {
  display('Что ищем?');
  conversation.append(button('Запчасть двигателя',()=>selectIntent('parts')),button('Коробку передач',()=>selectIntent('gearbox')),button('← Назад',start));
}
function compare() {
  display('Для чего нужен мотор?');
  conversation.append(make('p','Учитываем состояние вашего двигателя, сроки и планы на автомобиль.'));
  const choices = make('div','','choices');
  for(const [label,key,note] of [
    ['Оставляю машину себе','repair','Начнём с дефектовки и сметы. Так можно сравнить стоимость ремонта именно вашего двигателя с заменой.'],
    ['Хочу быстрее вернуть авто в строй','contract','Проверим наличие совместимого контрактного мотора, его состояние и время на установку.'],
    ['Нужен восстановленный с перечнем работ','rebuilt','Уточним, какие операции выполнили при сборке, чем это подтверждено и какая гарантия действует.'],
    ['Готовлю машину к продаже','contract','Сравним доступный двигатель с ремонтом по смете, с учётом сроков и задач автомобиля.']
  ]) choices.append(button(label,()=>{intent=key;topic=label;display(routes[key][0]);conversation.append(make('p',note),link('Открыть направление →',routes[key][1]),button('Обсудить с мастером',questions,'btn'),button('← К целям',compare));}));
  conversation.append(choices,button('← Назад',start));
}
function selectIntent(key) {intent=key;topic=routes[key][0];questions();}
function field(labelText, name, value, hint, multiline = false) {
  const label = make('label',labelText);
  const input = make(multiline?'textarea':'input');input.name=name;input.value=value;input.maxLength=multiline?500:90;input.placeholder=hint;
  label.append(input);return label;
}
function questions() {
  display(topic || routes[intent][0]);
  const form=make('form');const modelLabel=field('Модель или двигатель','model',model,'Например, BMW X5 F15, N57');
  const buyoutHints={
    'Автомобиль BMW':'Год, пробег, состояние кузова и двигателя, город осмотра.',
    'Неисправный ДВС':'Код мотора, причина снятия, повреждения и комплектность.',
    'Запчасти':'Название, маркировка, количество, состояние и город.',
    'Остатки разборки':'Какие агрегаты остались, примерное количество и где их можно осмотреть.'
  };
  const item=topic.split(' — ')[1];
  const hint=topic.includes('гарантии')?'По какому мотору, детали или виду ремонта уточнить срок и условия?':buyoutHints[item]||routes[intent][2];
  const detailLabel=field('Что нужно мастеру знать?','details',details,hint,true);
  detailLabel.lastChild.required=true;
  const channelLabel=make('label','Как вам ответить?');
  const channel=make('select');
  for(const option of ['Выберу мессенджер','Перезвонить мне','MAX','Telegram','WhatsApp']) channel.append(new Option(option,option));
  if(['MAX','Telegram','WhatsApp'].includes(preferred)) channel.value=preferred;
  channelLabel.append(channel);
  const phoneLabel=field('Номер для обратного звонка','callback','','+7…');
  const phone=phoneLabel.lastChild;
  phone.type='tel';phone.autocomplete='tel';phone.maxLength=22;
  function toggleCallback() {
    phoneLabel.hidden=channel.value!=='Перезвонить мне';phone.disabled=phoneLabel.hidden;phone.required=!phone.disabled;
  }
  channel.onchange=toggleCallback;toggleCallback();
  phone.oninput=()=>phone.setCustomValidity('');
  const submit=make('button','Собрать обращение →','btn');submit.type='submit';
  form.append(modelLabel,detailLabel,channelLabel,phoneLabel,submit);conversation.append(form,button('← К выбору задачи',start));
  form.onsubmit=e=>{e.preventDefault();model=form.elements.model.value.trim();details=form.elements.details.value.trim();if(!details){form.elements.details.focus();return;}
    if(!phone.disabled && phone.value.replace(/\D/g,'').length<7){phone.setCustomValidity('Проверьте номер телефона.');phone.reportValidity();return;}
    preferred=channel.value==='Перезвонить мне'?'Звонок':channel.value;
    makeDraft([topic||routes[intent][0],model,details,phone.disabled?'':'Перезвоните мне: '+phone.value]);result();};
}
function sourceUrl() {return location.protocol==='file:'?'https://didigood0401.github.io/razbor-bmw-demo/final/'+(location.pathname.split('/').pop()||'index.html')+location.search:location.origin+location.pathname+location.search;}
function makeDraft(lines) {
  draft=['Здравствуйте!',...lines.filter(Boolean),'Страница: '+(itemUrl || sourceUrl())].join('\n');
  track('request_prepared',{direction:intent});
}
async function copyText(text, status) {
  try {await navigator.clipboard.writeText(text);status.textContent='Текст скопирован.';}
  catch {const area=$('textarea',conversation);if(area){area.focus();area.select();}status.textContent='Выделите текст и скопируйте его вручную.';}
}
function result() {
  display('Ваш вопрос готов');
  const intro=make('p',preferred==='Звонок'?'Передайте запрос в удобном чате, чтобы мастер получил номер и мог перезвонить.':'Проверьте текст и выберите, как передать его мастеру.');
  const label=field('Черновик сообщения','message',draft,'',true);const area=label.lastChild;area.maxLength=1800;area.rows=5;
  const status=make('p');status.setAttribute('role','status');
  const channels=make('div','','channel-actions');
  const tag=(a,ch)=>a.addEventListener('click',()=>track('messenger_click',{channel:ch,direction:intent}));
  const wa=link('WhatsApp ↗','https://wa.me/79167016393?text='+encodeURIComponent(area.value));tag(wa,'WhatsApp');
  const tg=link('Telegram ↗','https://t.me/+79167016393?text='+encodeURIComponent(area.value));tag(tg,'Telegram');
  for (const a of [wa,tg]){a.target='_blank';a.rel='noopener';}
  area.oninput=()=>{draft=area.value;wa.href='https://wa.me/79167016393?text='+encodeURIComponent(draft);tg.href='https://t.me/+79167016393?text='+encodeURIComponent(draft);};
  const max=button('MAX',async()=>{
    await copyText(area.value,status);
    status.append(' В MAX найдите сервис по номеру +7 916 701-63-93 и вставьте сообщение. ');
    const open=link('Открыть MAX ↗','https://web.max.ru/');
    open.target='_blank';open.rel='noopener';
    open.onclick=()=>track('messenger_click',{channel:'MAX',direction:intent});
    status.append(open);
  });
  const options = {Telegram:tg, WhatsApp:wa, MAX:max};
  const first = options[preferred];
  if (first) {first.classList.add('preferred-channel'); channels.append(first);}
  for (const option of Object.values(options)) if (option!==first) channels.append(option);
  channels.append(button('Скопировать',()=>copyText(area.value,status)));
  if(preferred==='MAX')status.textContent='Для MAX скопируйте текст и откройте чат сервиса по номеру +7 916 701-63-93.';
  const modelCode = model.trim().toUpperCase().replace(/^S63B44$/, 'S63');
  const serviceUrl = routes[intent][1]+(Object.hasOwn(E,modelCode)?'?engine='+modelCode:'');
  conversation.append(intro,label,channels,status,link('Перейти в раздел «'+routes[intent][0]+'» →',serviceUrl),button('Начать заново',()=>{reset();start();}));
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-help],[data-intent],[data-topic],[data-channel],a[href^="tel:"]');if(!a)return;
  if(a.matches('a[href^="tel:"]')){track('phone_click');return;}
  reset();openAssistant();
  if(a.dataset.channel){preferred=a.dataset.channel;topic=routes[intent][0];questions();}
  else if(a.dataset.topic){topic=a.dataset.topic;intent=a.dataset.direction||'buyout';questions();}
  else if(a.dataset.intent)selectIntent(a.dataset.intent);else start();
});
const requestForm = $('.request-form');
const requestPhone = requestForm.elements.phone;
function updateCallback() {
  const callback = requestForm.elements.channel.value === 'Звонок';
  requestPhone.closest('label').hidden = !callback;
  requestPhone.disabled = !callback;
  requestPhone.required = callback;
  requestPhone.setCustomValidity('');
}
requestForm.elements.channel.onchange = updateCallback;
updateCallback();
requestPhone.oninput = () => requestPhone.setCustomValidity('');
requestForm.elements.task.oninput = e => e.target.setCustomValidity('');
requestForm.addEventListener('submit',e=>{
  e.preventDefault();
  const task = requestForm.elements.task;
  if (!task.value.trim()) {task.setCustomValidity('Опишите, пожалуйста, вашу задачу.');task.reportValidity();return;}
  if (!requestPhone.disabled && requestPhone.value.replace(/\D/g,'').length<7) {
    requestPhone.setCustomValidity('Проверьте номер телефона.');requestPhone.reportValidity();return;
  }
  reset();openAssistant();preferred=requestForm.elements.channel.value;
  model=requestForm.elements.engine.value.trim();details=task.value.trim();
  const subject=currentPage==='home'?'Обращение в моторный цех':$('h1').textContent.trim();
  makeDraft([subject,model,details,requestPhone.disabled?'':'Телефон: '+requestPhone.value,'Предпочитаю: '+preferred]);result();
});
$('.menu-toggle').onclick=e=>{const o=$('.mast').classList.toggle('is-open');e.currentTarget.setAttribute('aria-expanded',String(o));};
$('.mast nav').onclick=()=>{$('.mast').classList.remove('is-open');$('.menu-toggle').setAttribute('aria-expanded','false');};
if(engine && $('#chosen')) {
  $('#chosen').textContent=' '+engineLabel(engine);$('.request-form [name=engine]').value=engineLabel(engine);
  const amount=currentPage==='repair'?E[engine].rep:currentPage==='contract'?E[engine].buy:'';
  if(amount)$('#rate').textContent=engine+' · '+amount;
  for(const a of $$('.related a'))a.href=a.getAttribute('href')+'?engine='+engine;
}
if(currentPage!=='home') track('service_view',{direction:currentPage});
for(const b of $$('[data-step]')) b.onclick=()=>{$$('[data-step]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#step-note').textContent=b.dataset.step;};
const initialItem = params.get('item');
let group = A.serv.some(row=>row[4]===initialItem) ? 'serv' : 'parts';
const pageSize = currentPage==='home'?8:4;
let visibleProducts = initialItem ? Infinity : pageSize;
const filter=$('#filter-engine');
for(const code of [...new Set([...A.parts,...A.serv].map(x=>x[2]))].sort())filter.append(new Option(engineLabel(code),code));
if(engine && currentPage==='parts'){
  if(!Array.from(filter.options).some(option=>option.value===engine))filter.append(new Option(engine,engine));
  filter.value=engine;
}
function renderProducts() {
  const target=$('#products');target.replaceChildren();
  const search=$('#filter-text').value.trim().toLowerCase();
  const rows=A[group].filter(([n,p,code])=>(!filter.value||code===filter.value)&&(!search||(n+' '+engineLabel(code)).toLowerCase().includes(search)));
  const shown = rows.slice(0,visibleProducts);
  $('#catalog-count').textContent=rows.length?'Показано '+shown.length+' из '+rows.length:'Ничего не найдено';
  $('.catalog-more').hidden=shown.length>=rows.length;
  for(const [name,price,code,image,id,route] of shown){
    const card=make('article','','product');const img=make('img');img.src='../img/'+image+'.webp';img.alt='';img.loading='lazy';
    card.id='offer-'+id;
    const inner=make('div');const ask=button('Спросить мастера →',()=>{
      reset();openAssistant();intent=route;topic=name;model=engineLabel(code);
      const url=new URL(sourceUrl());url.search='';url.searchParams.set('item',id);url.hash=card.id;
      itemUrl=url.href;questions();
    },'');
    const avito=link('Профиль на Авито ↗','https://www.avito.ru/user/81631be4df98262c27509e972acbbbc2/profile');avito.target='_blank';avito.rel='noopener';
    avito.onclick=()=>track('avito_click',{item:id});
    inner.append(make('small',engineLabel(code)),make('h3',name),make('b',price),ask);if(group==='parts')inner.append(avito);card.append(img,inner);target.append(card);
  }
  if(!rows.length)target.append(make('p','Сообщите мастеру код двигателя и задачу — он уточнит варианты.','empty'),button('Уточнить у мастера',()=>{reset();openAssistant();intent=group==='parts'?'parts':'repair';topic=search?'Поиск: '+search:routes[intent][0];model=engineLabel(filter.value);questions();}));
}
function filterProducts() {visibleProducts=pageSize;renderProducts();}
for(const b of $$('[data-group]')) {
  b.setAttribute('aria-pressed',String(b.dataset.group===group));
  b.onclick=()=>{group=b.dataset.group;$$('[data-group]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterProducts();};
}
$('.catalog-more').onclick=()=>{visibleProducts+=pageSize;renderProducts();};
filter.onchange=filterProducts;$('#filter-text').oninput=filterProducts;renderProducts();
if(initialItem && location.hash === '#offer-'+initialItem) document.getElementById('offer-'+initialItem)?.scrollIntoView();
if($('#review-body')){
  const area=$('#review-body');
  const showAvitoReviews=()=>area.replaceChildren(make('p','Покупатели запчастей оценили профиль на 5,0 в материалах видеоразбора. Актуальные отзывы и ответы продавца доступны в профиле.'),link('Читать на Авито ↗','https://www.avito.ru/user/81631be4df98262c27509e972acbbbc2/profile'));
  $('[data-avito-reviews]').onclick=showAvitoReviews;
  $('a[href="#avito-reviews"]').addEventListener('click',showAvitoReviews);
  $('[data-review-list]').onclick=()=>area.replaceChildren(make('p','Здесь появятся отзывы клиентов после модерации. В демонстрационной версии опубликованных отзывов нет.'));
  $('[data-review]').onclick=()=>{const f=make('form');const name=field('Ваше имя','name','','Имя');const message=field('Ваш отзыв','text','','Какая работа выполнялась?',true);name.lastChild.required=message.lastChild.required=true;
    const submit=make('button','Предпросмотр отзыва','btn');f.append(name,message,submit);area.replaceChildren(f);f.onsubmit=e=>{e.preventDefault();area.replaceChildren(make('b',f.elements.name.value),make('p',f.elements.text.value),make('small','Предпросмотр. Публикация на рабочем сайте — после модерации.'));};};
}
const maxContact = $('[data-max-contact]');
const contactMenu = $('.master-contact');
const contactToggle = $('summary', contactMenu);
contactMenu.addEventListener('toggle', () => {
  if (contactMenu.open) {
    dismissWelcome();
    track('contact_menu_open');
  }
});
document.addEventListener('click', event => {
  if (contactMenu.open && (!contactMenu.contains(event.target) || event.target.closest('.contact-panel a'))) {
    contactMenu.open = false;
  }
});
contactMenu.addEventListener('keydown', event => {
  if (event.key === 'Escape' && contactMenu.open) {
    contactMenu.open = false;
    contactToggle.focus();
  }
});
contactMenu.addEventListener('focusout', event => {
  if (event.relatedTarget && !contactMenu.contains(event.relatedTarget)) contactMenu.open = false;
});
maxContact.onclick = () => {
  reset(); openAssistant(); display('Написать в MAX');
  conversation.append(make('p','Найдите сервис в MAX по рабочему номеру +7 916 701-63-93. Вопрос по машине можно подготовить здесь.'));
  const openMax = link('Открыть MAX ↗','https://web.max.ru/','secondary');
  openMax.target='_blank'; openMax.rel='noopener';
  openMax.onclick=()=>track('messenger_click',{channel:'MAX'});
  conversation.append(openMax,button('Подготовить вопрос',()=>{preferred='MAX';questions();}));
};
for(const a of $$('a[href^="https://t.me/+"],a[href^="https://wa.me/"]')){
  a.addEventListener('click',()=>track('messenger_click',{channel:a.hostname==='wa.me'?'WhatsApp':'Telegram'}));
  a.href += (a.search?'&':'?')+'text='+encodeURIComponent('Здравствуйте! У меня вопрос по странице '+sourceUrl());
}
const prices = $('#engine-prices');
if(prices){
  const key=currentPage==='repair'?'rep':currentPage==='contract'?'buy':'';
  const codes=engine?[engine]:Object.keys(E);
  for(const k of codes){
    const row=make('div');row.append(make('b',engineLabel(k)),make('span',E[k][key]||'По запросу'));
    prices.append(row);
  }
}

function showWelcome() {
  welcome.hidden = false;
  const movie = $('video', welcome);
  if (!motionPreference.matches) {
    movie.src = 'piston.mp4';
    movie.play().catch(() => {});
  }
  greetingAudio = new Audio('welcome.mp3');
  const sound = $('.welcome-sound', welcome);
  function playGreeting() {
    greetingAudio.currentTime = 0;
    return greetingAudio.play().then(() => {
      sound.textContent = 'Повторить приветствие';
      $('.welcome-status', welcome).textContent = '';
    });
  }
  sound.onclick = () => playGreeting().catch(() => {
    $('.welcome-status', welcome).textContent = 'Не удалось включить звук. Попробуйте ещё раз.';
  });
  $('.welcome-close', welcome).onclick = () => {
    dismissWelcome();
    $('.robot-launch').focus({preventScroll: true});
  };
  window.addEventListener('pagehide', dismissWelcome, {once: true});
  playGreeting().catch(() => {});
}

function playIntro() {
  const intro = $('#ignition');
  if (!intro || location.hash) return;
  try {
    if (sessionStorage.getItem('bmw-intro-v1')) return;
    sessionStorage.setItem('bmw-intro-v1', '1');
  } catch {}
  if (motionPreference.matches) {
    showWelcome();
    return;
  }
  let remaining = 3;
  const digits = $('.ignition-count', intro);
  let timer;
  function finish() {
    if (!intro.open) return;
    clearInterval(timer);
    intro.close();
    showWelcome();
  }
  $('.ignition-skip', intro).onclick = finish;
  intro.addEventListener('cancel', event => { event.preventDefault(); finish(); }, {once: true});
  intro.showModal();
  timer = setInterval(() => {
    remaining -= 1;
    if (remaining === 0) finish();
    else digits.textContent = String(remaining);
  }, 700);
}
playIntro();

