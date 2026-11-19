const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
requestAnimationFrame(()=>document.documentElement.classList.add('ready'));

/* хедер: прозрачный над hero, белый ниже; прячется при скролле вниз */
const hd=$('header'),fab=$('.fab');let lastY=0;
function onScroll(){const y=scrollY,solid=!document.querySelector('.hero')||y>innerHeight-90;hd.classList.toggle('solid',solid);
 hd.classList.toggle('hide',y>lastY&&y>300);lastY=y;if(fab)fab.classList.toggle('on',y>innerHeight*.8)}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* reveal со стаггером */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target)}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
$$('.rv,.dr').forEach(el=>{const p=el.parentElement,i=[...p.children].indexOf(el);el.style.transitionDelay=Math.min(i,5)*110+'ms';io.observe(el)});

/* «Спросить»: перезвонить / Telegram / WhatsApp / MAX */
const ov=$('.ov'),dlg=$('.dlg');
function ask(ctx){$('.dlg .ctx').textContent=ctx||'';$('.cb').classList.remove('on');$('.done').classList.remove('on');ov.classList.add('on');dlg.classList.add('on')}
function close(){ov.classList.remove('on');dlg.classList.remove('on')}
document.addEventListener('click',e=>{const a=e.target.closest('[data-ask]');if(a){e.preventDefault();ask(a.dataset.ask)}});
if(ov){ov.onclick=close;$('.dlg .x').onclick=close;addEventListener('keydown',e=>e.key==='Escape'&&close());
 $('#wCall').onclick=()=>{$('.cb').classList.add('on');setTimeout(()=>$('.cb input').focus(),50)};
 $('.cb').onsubmit=e=>{e.preventDefault();$('.cb').classList.remove('on');$('.done').classList.add('on')}}
