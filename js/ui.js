/* ============================================================
   DES2026 — Shared UI helpers: avatar, header, bubble,
   bottom nav, input bar, sheets, toast
   ============================================================ */

/* ── AVATAR ── */
function avColor(name) {
  const colors=['#E53935','#8E24AA','#1E88E5','#00897B','#F4511E','#6D4C41','#546E7A','#C62828'];
  let h=0; for(let c of name) h=(h*31+c.charCodeAt(0))>>>0;
  return colors[h%colors.length];
}
function avInitials(name) {
  const p=name.trim().split(/\s+/);
  return p.length===1?p[0].slice(0,2).toUpperCase():(p[0][0]+p[p.length-1][0]).toUpperCase();
}
function avatar(name,size='md') {
  return `<div class="avatar avatar--${size}" style="background:${avColor(name)}">${avInitials(name)}</div>`;
}

/* ── SHARED UI ── */
const $=id=>document.getElementById(id);
const app=()=>document.getElementById('app');

function mount(html){
  document.getElementById('app').innerHTML=html;
  if(window.lucide) lucide.createIcons();
}

function toast(msg){
  const old=document.querySelector('.toast');if(old)old.remove();
  const t=document.createElement('div');t.className='toast';t.textContent=msg;
  app().appendChild(t);setTimeout(()=>t.remove(),3200);
}

function ftime(ts){const d=new Date(ts);return d.getHours()+':'+(d.getMinutes()+'').padStart(2,'0');}
function fdate(ts){
  const d=new Date(ts),now=new Date(),diff=now-d;
  if(diff<86400000)return ftime(ts);
  if(diff<7*86400000)return d.toLocaleDateString('en-IN',{weekday:'short'});
  return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
}

function scrollBot(el){if(el)setTimeout(()=>{el.scrollTop=el.scrollHeight;},50);}

let _tapCount=0,_tapTimer=null;
function headerTap(){
  _tapCount++;clearTimeout(_tapTimer);
  _tapTimer=setTimeout(()=>{_tapCount=0;},800);
  if(_tapCount>=3){_tapCount=0;showResearcherDialog();}
}
function showResearcherDialog(){
  const cur=S.researcherMode;
  const bk=document.createElement('div');
  bk.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;';
  bk.innerHTML=`<div style="background:#fff;border-radius:12px;padding:1.5rem;width:100%;max-width:320px;gap:1rem;display:flex;flex-direction:column;">
    <h2 style="font-size:1.0625rem;font-weight:700;">Researcher Mode</h2>
    <p style="font-size:0.9375rem;color:#444;line-height:1.5;">${cur?'Disable':'Enable'} researcher mode? ${cur?'AI labels will be hidden.':'AI personas will be labeled in chat.'}</p>
    <div style="display:flex;gap:.75rem;justify-content:flex-end;">
      <button id="rm-no" style="background:none;border:1.5px solid #ddd;border-radius:8px;padding:.625rem 1.25rem;font-size:1rem;cursor:pointer;min-height:44px;font-family:inherit;">Cancel</button>
      <button id="rm-yes" style="background:${cur?'#E53935':'#075E54'};color:#fff;border:none;border-radius:8px;padding:.625rem 1.25rem;font-size:1rem;font-weight:600;cursor:pointer;min-height:44px;font-family:inherit;">${cur?'Disable':'Enable'}</button>
    </div></div>`;
  app().appendChild(bk);
  $('rm-no').onclick=()=>bk.remove();
  $('rm-yes').onclick=()=>{set({researcherMode:!cur});bk.remove();toast(cur?'Researcher Mode off':'Researcher Mode on');render();};
}

function header(title,{back=false,avatarName=null,right=[],subtitle=null,white=false}={}){
  let h=`<div class="${white?'header header--white':'header'}">`;
  if(back) h+=`<button class="header__back" onclick="goBack()" aria-label="Back">${IC.back}</button>`;
  if(avatarName) h+=`<div class="header__avatar">${avatar(avatarName,'sm')}</div>`;
  const subClass=subtitle==='online'?'header__subtitle header__subtitle--online':'header__subtitle';
  h+=`<div class="header__title" onclick="headerTap()"><h1>${title}</h1>${subtitle?`<div class="${subClass}">${subtitle}</div>`:''}</div>`;
  if(right.length) h+=`<div class="header__actions">${right.map(b=>`<button class="header__action-btn" aria-label="${b.label}" onclick="${b.fn}">${b.icon}</button>`).join('')}</div>`;
  h+=`</div>`;
  return h;
}

function bottomNav(active){
  const tabs=[
    {id:'chats',label:'Chats',icon:IC.chats,hash:'#/chats',badge:()=>{const t=Object.values(S.unreadChats||{}).reduce((a,b)=>a+b,0);return t>0?t:0;}},
    {id:'stories',label:'Stories',icon:IC.updates,hash:'#/stories',badge:()=>0},
    {id:'communities',label:'Comm.',icon:IC.communities,hash:'#/communities',badge:()=>0},
    {id:'voicerooms',label:'Voice',icon:IC.voiceRoom,hash:'#/voicerooms',badge:()=>0},
    {id:'games',label:'Games',icon:IC.games,hash:'#/games',badge:()=>0},
  ];
  return `<nav class="bottom-nav">${tabs.map(t=>{
    const b=t.badge();
    return`<button class="bottom-nav__tab${active===t.id?' active':''}" onclick="navTo('${t.hash}')" aria-label="${t.label}">
      <div class="bottom-nav__pill">
        <div class="bottom-nav__icon">${t.icon}</div>
        ${b?`<span class="bottom-nav__badge">${b}</span>`:''}
      </div>
      <span class="bottom-nav__label">${t.label}</span>
    </button>`;}).join('')}</nav>`;
}
function navTo(hash){_stack=[hash];navigate(hash);}

function desktopBanner(){
  if(S.desktopBannerDismissed||canSTT())return'';
  return`<div class="banner banner--desktop"><span>For the full voice experience, open this on an Android phone in Chrome.</span><button class="banner__close" onclick="dismissDesktop()">${IC.close}</button></div>`;
}
function dismissDesktop(){set({desktopBannerDismissed:true});render();}

function resBar(){return S.researcherMode?'<div class="researcher-mode-bar">👁 RESEARCHER MODE — AI personas are labeled</div>':'';}

function bubble(msg){
  const sent=msg.from==='user';
  const p=!sent&&PERSONAS[msg.from];
  const aiBadge=(p&&S.researcherMode)?'<span class="ai-badge">AI</span>':'';
  let content='';
  if(msg.type==='voice'){
    const bars=Array.from({length:18},(_,i)=>{const h=4+Math.round(Math.sin(i*.8)*8+10);return`<div class="voice-bubble__bar" style="height:${h}px"></div>`;}).join('');
    content=`<div class="voice-bubble">
      <div class="voice-bubble__controls">
        <button class="voice-bubble__play" onclick="togglePlay(this,'${msg.id}')" aria-label="Play">${IC.play}</button>
        <div class="voice-bubble__waveform">${bars}</div>
      </div>
      ${msg.text?`<div class="voice-bubble__text">${msg.text}</div>`:''}
    </div>`;
  } else {
    content=`${aiBadge}<div>${msg.text}</div>`;
  }
  const spk=canTTS()?`<button class="bubble__speaker" onclick="speakMsg(this,'${msg.id.replace(/'/g,"\\'")}','${(msg.text||'').replace(/'/g,"\\'").replace(/\n/g,' ').slice(0,200)}')" aria-label="Read aloud">${IC.speaker}</button>`:'';
  return`<div class="bubble-wrap bubble-wrap--${sent?'sent':'recv'}">
    <div class="bubble bubble--${sent?'sent':'recv'}">
      ${content}
      <div class="bubble__meta"><span class="bubble__time">${ftime(msg.timestamp)}</span>${sent?`<span class="bubble__ticks bubble__ticks--read">${doubleTick()}</span>`:''}</div>
    </div>
    ${spk}
  </div>`;
}

function doubleTick(){return`<svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><path d="M17.394.606a.75.75 0 0 1 0 1.06L8.9 10.16a.75.75 0 0 1-1.06 0L4.606 6.928a.75.75 0 1 1 1.06-1.06l2.704 2.703 7.963-7.965a.75.75 0 0 1 1.06 0zM1 5.868l2.704 2.704a.75.75 0 1 0 1.06-1.06L2.06 4.806A.75.75 0 0 0 1 5.868z"/></svg>`;}

function typingHTML(){return`<div class="bubble-wrap bubble-wrap--recv" id="typing"><div class="typing-indicator"><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div></div></div>`;}

// Global speak state
const _playing={};
function speakMsg(btn,msgId,text){
  if(_playing[msgId]){stopSpeak();delete _playing[msgId];btn.classList.remove('bubble__speaker--playing');return;}
  Object.keys(_playing).forEach(k=>{delete _playing[k];document.querySelectorAll('.bubble__speaker--playing').forEach(b=>b.classList.remove('bubble__speaker--playing'));});
  speak(text,()=>{delete _playing[msgId];btn.classList.remove('bubble__speaker--playing');});
  _playing[msgId]=true;btn.classList.add('bubble__speaker--playing');
}
function togglePlay(btn,msgId){
  const msg=findMsg(msgId);if(!msg)return;
  speakMsg(btn,msgId,msg.text||'');
}
function findMsg(id){
  for(const k of Object.keys(S.chats)){const m=S.chats[k]?.find(m=>m.id===id);if(m)return m;}
  for(const k of Object.keys(S.communities)){const m=S.communities[k]?.find(m=>m.id===id);if(m)return m;}
  for(const k of Object.keys(S.games)){const m=S.games[k]?.messages?.find(m=>m.id===id);if(m)return m;}
  return null;
}

/* ── INPUT BAR ── */
function renderInputBar(containerId, {onSend,onGame=null,placeholder='Message'}){
  const bar=document.createElement('div');
  bar.className='message-input-bar';
  bar.innerHTML=`
    <div class="message-input-bar__field-wrap">
      ${onGame?`<button class="message-input-bar__game-btn" id="ib-game" aria-label="Start game">${IC.controller}</button>`:''}
      <textarea class="message-input-bar__field" id="ib-field" placeholder="${placeholder}" rows="1"></textarea>
    </div>
    <button class="message-input-bar__send message-input-bar__send--mic" id="ib-send" aria-label="Send or record">${IC.mic}</button>
  `;
  const container=document.getElementById(containerId);
  if(!container)return;
  container.appendChild(bar);

  const field=$('ib-field'), sendBtn=$('ib-send');
  if(onGame&&$('ib-game')) $('ib-game').onclick=onGame;

  field.addEventListener('input',()=>{
    field.style.height='auto';field.style.height=Math.min(field.scrollHeight,120)+'px';
    sendBtn.innerHTML=field.value.trim()?IC.send:IC.mic;
    sendBtn.className='message-input-bar__send '+(field.value.trim()?'':'message-input-bar__send--mic');
  });
  field.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();doSend();}});

  let recording=false, transcript='';

  function doSend(){
    const t=field.value.trim();if(!t)return;
    field.value='';field.style.height='auto';
    sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';
    onSend({type:'text',text:t});
  }

  function showRecOverlay(){
    const ov=document.createElement('div');ov.className='recording-overlay';ov.id='rec-ov';
    const bars=Array.from({length:12},(_,i)=>`<div class="recording-overlay__bar" style="animation-delay:${i*.07}s"></div>`).join('');
    ov.innerHTML=`<div class="recording-overlay__waveform">${bars}</div>
      <div class="recording-overlay__status">Listening...</div>
      <div class="recording-overlay__preview" id="rec-preview"> </div>
      <div class="recording-overlay__actions">
        <button class="recording-overlay__cancel" id="rec-cancel">Cancel</button>
        <button class="recording-overlay__send" id="rec-send" disabled>Send</button>
      </div>`;
    app().appendChild(ov);
    $('rec-cancel').onclick=()=>{stopRec();removeOv();};
    $('rec-send').onclick=()=>{stopRec();const t=transcript.trim();removeOv();if(t)onSend({type:'voice',text:t});};
  }
  function removeOv(){const o=$('rec-ov');if(o)o.remove();recording=false;transcript='';sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';}

  sendBtn.onclick=()=>{
    if(field.value.trim()){doSend();return;}
    if(!canSTT()){toast('Voice not available — please type.');return;}
    if(recording){stopRec();return;}
    recording=true;transcript='';
    sendBtn.className='message-input-bar__send message-input-bar__send--recording';
    sendBtn.innerHTML=IC.micOff;
    showRecOverlay();
    startRec({
      onInterim:t=>{transcript=t;const p=$('rec-preview');if(p)p.textContent=t;},
      onFinal:t=>{transcript=t;const p=$('rec-preview');if(p)p.textContent=t;const s=$('rec-send');if(s&&t.trim())s.disabled=false;},
      onError:()=>{removeOv();toast('Could not hear clearly. Please try again.');},
      onEnd:()=>{recording=false;sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';const s=$('rec-send');if(s&&transcript.trim())s.disabled=false;else if(!transcript.trim())removeOv();}
    });
  };
}

/* ── SHEET HELPERS ── */
function sheet(innerHtml){
  const bk=document.createElement('div');bk.className='bottom-sheet-backdrop';
  bk.onclick=e=>{if(e.target===bk)bk.remove();};
  const sh=document.createElement('div');sh.className='bottom-sheet';sh.innerHTML=innerHtml;
  bk.appendChild(sh);app().appendChild(bk);return bk;
}
function closeSheet(bk){if(bk&&bk.parentNode)bk.remove();}
