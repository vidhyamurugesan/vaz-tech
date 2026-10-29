/* VAZ Tech website - shared script for every page */
(function(){
  var art0=document.querySelector('.page');
  var PAGE=art0?art0.getAttribute('data-page'):'home';
  var HOME=(art0&&art0.getAttribute('data-home'))||'index.html';
  var MAIN=[['home','Home','01',HOME],['about','About','02','about.html'],['services','Services','03','services.html'],['contact','Contact','04','contact.html']];
  var article=document.querySelector('.page');
  var NUM=article?article.getAttribute('data-num'):'';
  var TITLE=article?article.getAttribute('data-title'):'';

  // ---- right rail (desktop) and menu sheet (mobile) ----
  var railNav=document.getElementById('rail-nav'), sheetNav=document.getElementById('sheet-nav');
  if(railNav) railNav.innerHTML=MAIN.map(function(m){
    var cur=m[0]===PAGE?' aria-current="page"':'';
    return '<a class="ri" href="'+m[3]+'"'+cur+'>'+m[1]+'<span class="n">'+m[2]+'</span><span class="sq"></span></a><div class="subs" data-subs="'+m[0]+'" hidden></div>';
  }).join('');
  if(sheetNav) sheetNav.innerHTML=MAIN.map(function(m){
    var cur=m[0]===PAGE?' aria-current="page"':'';
    return '<a class="big" href="'+m[3]+'"'+cur+'>'+m[1]+'<span class="n">'+m[2]+'</span></a>';
  }).join('');

  // ---- legal page contents lists ----
  [].forEach.call(document.querySelectorAll('[data-toc]'),function(toc){
    var doc=toc.parentNode.querySelector('.doc');
    toc.innerHTML=[].map.call(doc.querySelectorAll('section[id]'),function(s){
      var h=s.querySelector('h2');
      return '<a href="#'+s.id+'" data-jump="'+s.id+'">'+h.textContent.replace(/^\d+/,'').trim()+'</a>';
    }).join('');
  });

  // ---- section sub-menu under the active page in the rail ----
  var secs=[].slice.call(document.querySelectorAll('main [data-sec]'));
  var holder=document.querySelector('[data-subs="'+PAGE+'"]');
  if(holder && secs.length>2){
    holder.innerHTML=secs.map(function(s){return '<a href="#'+s.id+'" data-jump="'+s.id+'">'+s.getAttribute('data-sec')+'</a>';}).join('');
    holder.hidden=false;
  }

  // ---- mobile dock label + progress ----
  var dockLbl=document.getElementById('dock-lbl'), dockBar=document.getElementById('dock-bar');
  function updateDock(sec){
    if(!dockLbl) return;
    dockLbl.innerHTML=(NUM?'<b>'+NUM+'</b>':'')+TITLE.toUpperCase()+(sec&&sec!=='Intro'?' / '+sec.toUpperCase():'');
  }

  // ---- scroll-spy: last section whose top passed 35% of the viewport; bottom of page = last section;
  //      a clicked item stays active until the user scrolls again ----
  var forced=null, forcedAt=0, ticking=false;
  function setActive(sec){
    if(!sec) return;
    [].forEach.call(document.querySelectorAll('.subs a'),function(a){a.classList.toggle('on',a.getAttribute('data-jump')===sec.id);});
    updateDock(sec.getAttribute('data-sec'));
  }
  function spyUpdate(){
    ticking=false;
    if(dockBar){
      var h=document.documentElement.scrollHeight-innerHeight;
      dockBar.style.width=(h>0?Math.min(100,window.pageYOffset/h*100):0)+'%';
    }
    if(!secs.length) return;
    if(forced){ if(Date.now()-forcedAt<500){ setActive(forced); return; } forced=null; }
    var line=innerHeight*0.35, act=secs[0];
    secs.forEach(function(s){ if(s.getBoundingClientRect().top<=line) act=s; });
    var doc=document.documentElement;
    if(window.pageYOffset+innerHeight>=doc.scrollHeight-2 && window.pageYOffset>0) act=secs[secs.length-1];
    setActive(act);
  }
  window.addEventListener('scroll',function(){ if(!ticking){ticking=true; requestAnimationFrame(spyUpdate);} },{passive:true});
  window.addEventListener('resize',spyUpdate);

  // ---- in-page jumps (instant scroll, with a fallback for embedded viewers) ----
  function jumpTo(el){
    if(!el) return;
    if(secs.indexOf(el)>-1){ forced=el; forcedAt=Date.now(); setActive(el); }
    var y=el.getBoundingClientRect().top+window.pageYOffset-16;
    try{window.scrollTo({top:y,behavior:'auto'});}catch(e){window.scrollTo(0,y);}
    setTimeout(function(){ if(Math.abs(el.getBoundingClientRect().top-16)>40){ try{el.scrollIntoView({block:'start'});}catch(e){} } },60);
    try{history.replaceState(null,'','#'+el.id);}catch(e){}
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a');
    if(!a) return;
    var href=a.getAttribute('href')||'';
    if(href.charAt(0)==='#' && href.length>1){
      var el=document.getElementById(href.slice(1));
      if(el){ e.preventDefault(); closeSheet(); jumpTo(el); }
    }
  });
  window.addEventListener('hashchange',function(){ var el=document.getElementById(location.hash.slice(1)); if(el) jumpTo(el); });

  // ---- mobile menu sheet ----
  var sheet=document.getElementById('sheet'), dockBtn=document.getElementById('dock-btn');
  function closeSheet(){ if(sheet && sheet.classList.contains('open')){ sheet.classList.remove('open'); if(dockBtn) dockBtn.focus({preventScroll:true}); } }
  if(dockBtn) dockBtn.addEventListener('click',function(){ sheet.classList.add('open'); var c=sheet.querySelector('[aria-current]')||sheet.querySelector('a'); if(c) c.focus(); });
  var sc=document.getElementById('sheet-close'); if(sc) sc.addEventListener('click',closeSheet);
  if(sheet) sheet.addEventListener('click',function(e){ if(e.target===sheet) closeSheet(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeSheet(); });

  // ---- FAQ expand / collapse ----
  var fo=document.getElementById('faq-open'), fc=document.getElementById('faq-close');
  if(fo) fo.addEventListener('click',function(){[].forEach.call(document.querySelectorAll('.faq details'),function(d){d.open=true;});});
  if(fc) fc.addEventListener('click',function(){[].forEach.call(document.querySelectorAll('.faq details'),function(d){d.open=false;});});

  // ---- enquiry form (front end only: connect to your email / CRM endpoint before launch) ----
  var form=document.getElementById('enquiry');
  if(form){
    var setErr=function(input,msg){ var f=input.closest('.field'); f.classList.toggle('err',!!msg); f.querySelector('.msg').textContent=msg||''; input.setAttribute('aria-invalid',msg?'true':'false'); };
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true, first=null;
      var name=form.querySelector('#f-name'), email=form.querySelector('#f-email'), phone=form.querySelector('#f-phone'), msg=form.querySelector('#f-msg'), consent=form.querySelector('#f-consent');
      function check(el,cond,text){ if(!cond){ ok=false; setErr(el,text); first=first||el; } else setErr(el,''); }
      check(name,name.value.trim().length>1,'Enter your full name.');
      check(email,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()),'Enter an email address like name@firm.com.');
      check(phone,!phone.value.trim()||/^[+()\d\s-]{7,}$/.test(phone.value.trim()),'Use digits, spaces, + or - only.');
      check(msg,msg.value.trim().length>9,'Tell us a little more (at least 10 characters).');
      var cr=document.getElementById('consent-row');
      if(!consent.checked){ ok=false; cr.classList.add('err'); first=first||consent; } else cr.classList.remove('err');
      if(!ok){ first.focus(); return; }
      var esc=function(s){return s.replace(/[<>&"]/g,'');};
      var who=esc(name.value.trim().split(' ')[0]);
      var help=(form.querySelector('input[name=help]:checked')||{}).value||'enquiry';
      var arrow='<svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true" style="display:block"><path d="M0 5h12M8.5 1.5L12 5 8.5 8.5" stroke="currentColor" stroke-width="1.3"/></svg>';
      form.innerHTML='<div class="done"><span class="ring"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M5 11.5l4 4 8-9" stroke="#38A9EA" stroke-width="1.6"/></svg></span><h3>Thank you, '+who+'.</h3><p class="muted">Your '+help.toLowerCase()+' request is with our team. We will reply to '+esc(email.value.trim())+' within <span class="ph">[one business day]</span>.</p><a class="btn ghost" href="'+HOME+'">Back to home <span class="arr">'+arrow+'</span></a></div>';
    });
    form.addEventListener('input',function(e){ var f=e.target.closest('.field'); if(f && f.classList.contains('err')) setErr(e.target,''); });
  }

  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

  // ---- initial state ----
  if(location.hash.length>1){
    var t=document.getElementById(location.hash.slice(1));
    if(t) requestAnimationFrame(function(){ jumpTo(t); });
  }
  if(secs.length) setActive(secs[0]);
  spyUpdate();
})();
