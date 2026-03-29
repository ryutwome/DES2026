/* ============================================================
   DES2026 — Chats list, status viewer, and chat screen
   ============================================================ */

/* ── CHATS LIST ── */
function renderChats(){
  mount(`
    ${desktopBanner()}
    ${resBar()}
    <div class="header header--white">
      <div class="header__title" onclick="headerTap()"><h1 style="color:#00A884;">WhatsApp</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" style="color:#54656f;" aria-label="QR code" onclick="toast('QR code coming soon')">${IC.qr}</button>
        <button class="header__action-btn" style="color:#54656f;" aria-label="Settings" onclick="showSettings()">${IC.more}</button>
      </div>
    </div>
    <div class="screen" style="background:#fff;position:relative;">
      <div class="chats-search-bar">
        <i data-lucide="search" style="width:18px;height:18px;color:#8696a0;flex-shrink:0;"></i>
        <span style="font-size:15px;color:#8696a0;">Ask Meta AI or Search</span>
      </div>
      <div class="filter-chips">
        <button class="filter-chip active" onclick="filterChips(this,'all')">All</button>
        <button class="filter-chip" onclick="filterChips(this,'unread')">Unread</button>
        <button class="filter-chip" onclick="filterChips(this,'favourites')">Favourites</button>
        <button class="filter-chip" onclick="filterChips(this,'groups')">Groups</button>
      </div>
      <div class="screen__scroll" id="chat-list"></div>
      <button class="fab" onclick="toast('New chat coming soon')" aria-label="New chat">
        <i data-lucide="square-pen" style="width:22px;height:22px;color:#fff;"></i>
      </button>
    </div>
    ${bottomNav('chats')}
  `);
  const list=$('chat-list');
  const items=Object.keys(S.chats).filter(id=>PERSONAS[id]).map(id=>{
    const msgs=S.chats[id]||[],last=msgs[msgs.length-1];
    return{id,last,time:last?.timestamp||0};
  }).sort((a,b)=>b.time-a.time);
  if(!items.length){list.innerHTML=`<div class="empty-state"><div class="empty-state__icon">${ej('chat','48px')}</div><div class="empty-state__title">No chats yet</div><div class="empty-state__desc">Join a community to start connecting.</div></div>`;return;}
  items.forEach(({id,last,time})=>{
    const p=PERSONAS[id];
    const unread=S.unreadChats[id]||0;
    const isUserMsg=last?.from==='user';
    const previewText=last?(last.type==='voice'?`${ej('mic')} Voice message`:last.type==='image'?`${IC.image} Photo${last.caption?' '+last.caption:''}`:(last.text||'')):'' ;
    const tickHtml=isUserMsg?`<svg width="16" height="11" viewBox="0 0 18 11" fill="#53bdeb" style="flex-shrink:0;margin-right:2px"><path d="M17.394.606a.75.75 0 0 1 0 1.06L8.9 10.16a.75.75 0 0 1-1.06 0L4.606 6.928a.75.75 0 1 1 1.06-1.06l2.704 2.703 7.963-7.965a.75.75 0 0 1 1.06 0zM1 5.868l2.704 2.704a.75.75 0 1 0 1.06-1.06L2.06 4.806A.75.75 0 0 0 1 5.868z"/></svg>`:'';
    const ai=S.researcherMode?'<span class="ai-badge">AI</span>':'';
    const timeClass=unread?'chat-list-item__time chat-list-item__time--unread':'chat-list-item__time';
    const div=document.createElement('div');div.className='chat-list-item';
    const hasStatus=PERSONA_STATUS_IMAGES[id]!==undefined;
    const viewed=(S.viewedStatuses||[]).includes(id);
    const avatarEl=hasStatus
      ?`<div class="chat-avatar-story-ring${viewed?' chat-avatar-story-ring--viewed':''}" onclick="event.stopPropagation();openStatus('${id}')">${avatar(p.name,'md',id)}</div>`
      :`<div>${avatar(p.name,'md',id)}</div>`;
    div.innerHTML=`<div class="chat-list-item__avatar">${avatarEl}</div><div class="chat-list-item__body"><div class="chat-list-item__top"><div class="chat-list-item__name">${p.name}${ai}</div><div class="${timeClass}">${fdate(time)}</div></div><div class="chat-list-item__bottom"><div class="chat-list-item__preview" style="display:flex;align-items:center;">${tickHtml}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${previewText}</span></div>${unread?`<div class="chat-list-item__badge">${unread}</div>`:''}</div></div>`;
    div.onclick=()=>{const u={...S.unreadChats};delete u[id];set({unreadChats:u});navigate('#/chat/'+id);};
    list.appendChild(div);
  });
}

function filterChips(btn){document.querySelectorAll('.filter-chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}

/* ── STATUS VIEWER ── */
function openStatus(personaId){
  const p=PERSONAS[personaId];if(!p)return;
  const story=SEED_STORIES.find(s=>s.personaId===personaId);
  const img=story?.imageUrl||PERSONA_STATUS_IMAGES[personaId];
  const caption=story?.text||'';
  const shortCaption=caption.slice(0,120)+(caption.length>120?'...':'');

  const overlay=document.createElement('div');
  overlay.className='status-viewer';
  overlay.innerHTML=`
    <div class="status-viewer__progress">
      <div class="status-viewer__bar"><div class="status-viewer__bar-fill" id="sv-bar"></div></div>
    </div>
    <div class="status-viewer__header">
      <button class="status-viewer__back" onclick="this.closest('.status-viewer').remove()">
        <i data-lucide="arrow-left" style="width:24px;height:24px;color:#fff;"></i>
      </button>
      <div class="status-viewer__avatar">${avatar(p.name,'sm',personaId)}</div>
      <div class="status-viewer__info">
        <div class="status-viewer__name">${p.name}</div>
        <div class="status-viewer__time">Today</div>
      </div>
      <button class="status-viewer__more">
        <i data-lucide="more-vertical" style="width:22px;height:22px;color:#fff;"></i>
      </button>
    </div>
    <img class="status-viewer__image" src="${img}" alt="${p.name}'s status" />
    ${shortCaption?`<div class="status-viewer__caption">${shortCaption}</div>`:''}
    <div class="status-viewer__bottom">
      <div class="status-viewer__reply-wrap">
        <input class="status-viewer__reply-input" id="sv-reply" placeholder="Reply..." />
      </div>
      <button class="status-viewer__heart" onclick="statusReact('${personaId}','${overlay.id}')">
        <i data-lucide="heart" style="width:24px;height:24px;color:#fff;"></i>
      </button>
    </div>
  `;
  overlay.id='sv-'+personaId;
  document.getElementById('app').appendChild(overlay);
  lucide.createIcons();

  // Mark status as viewed and update ring colour immediately
  const vs=new Set(S.viewedStatuses||[]);
  vs.add(personaId);
  set({viewedStatuses:[...vs]});
  document.querySelectorAll(`.chat-avatar-story-ring[onclick*="'${personaId}'"]`)
    .forEach(el=>el.classList.add('chat-avatar-story-ring--viewed'));

  // Auto-progress bar — 5 seconds
  const bar=overlay.querySelector('#sv-bar');
  let start=null;
  function tick(ts){
    if(!start) start=ts;
    const pct=Math.min(100,(ts-start)/5000*100);
    bar.style.width=pct+'%';
    if(pct<100&&overlay.isConnected) requestAnimationFrame(tick);
    else if(overlay.isConnected) overlay.remove();
  }
  requestAnimationFrame(tick);

  // Reply send
  overlay.querySelector('#sv-reply').addEventListener('keydown',async e=>{
    if(e.key!=='Enter') return;
    const text=e.target.value.trim();if(!text)return;
    e.target.value='';
    toast('Replied to '+p.name.split(' ')[0]);
    overlay.remove();
    // Add as chat message
    const msg=mkMsg('user','text',text);
    addMsg('chats',personaId,msg);
    navigate('#/chat/'+personaId);
  });
}

function statusReact(personaId){
  const p=PERSONAS[personaId];
  toast('Reacted to '+p.name.split(' ')[0]+"'s status");
  document.getElementById('sv-'+personaId)?.remove();
}

/* ── CHAT SCREEN ── */
function renderChat(personaId){
  const p=PERSONAS[personaId];if(!p){navigate('#/chats');return;}
  const onlineStatuses=['online','online','last seen today at 10:32 AM','last seen yesterday at 8:14 PM','online'];
  const status=onlineStatuses[Math.abs(personaId.split('').reduce((a,c)=>a+c.charCodeAt(0),0))%onlineStatuses.length];
  mount(`
    ${header(p.name,{back:true,avatarName:p.name,avatarPersonaId:personaId,subtitle:status,right:[
      {icon:IC.phone,label:'Voice call',fn:`toast('Calling ${p.name.split(' ')[0]}...')`},
      {icon:IC.video,label:'Video call',fn:`toast('Video calling ${p.name.split(' ')[0]}...')`},
      {icon:IC.more,label:'More',fn:''}
    ]})}
    <div class="screen chat-screen" id="chat-wrap">
      <div class="chat-messages" id="msgs"></div>
    </div>
  `);
  const msgs=$('msgs');
  msgs.insertAdjacentHTML('beforeend',`<div style="text-align:center;margin:8px 0;"><div style="display:inline-block;background:#fdf4c5;color:#54656f;font-size:11.5px;padding:5px 10px;border-radius:7px;line-height:1.4;max-width:260px;">${ej('lock','11.5px')} Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.</div></div>`);
  let lastDate='';
  const chatMsgs=S.chats[personaId]||[];
  // Find the last user message index — if no persona reply follows it, show grey ticks
  let lastUserIdx=-1;
  chatMsgs.forEach((m,i)=>{if(m.from==='user')lastUserIdx=i;});
  const hasReplyAfterLastUser=chatMsgs.slice(lastUserIdx+1).some(m=>m.from===personaId);
  chatMsgs.forEach((m,i)=>{
    const d=new Date(m.timestamp).toDateString();
    if(d!==lastDate){lastDate=d;const today=new Date().toDateString();const yday=new Date(Date.now()-86400000).toDateString();const label=d===today?'Today':d===yday?'Yesterday':new Date(m.timestamp).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});msgs.insertAdjacentHTML('beforeend',`<div class="chat-date-divider"><span>${label}</span></div>`);}
    const read=m.from!=='user'||i!==lastUserIdx||hasReplyAfterLastUser;
    msgs.insertAdjacentHTML('beforeend',bubble(m,{read}));
  });
  scrollBot(msgs);
  renderInputBar('chat-wrap',{
    placeholder:'Message',
    onGame:()=>showGameSheet(personaId),
    onSend:async(data)=>{
      const {type,text,image,caption}=data;
      const msg=mkMsg('user',type,text||caption||'');
      if(type==='image'){msg.image=image;msg.caption=caption;}
      addMsg('chats',personaId,msg);
      msgs.insertAdjacentHTML('beforeend',bubble(msg));
      scrollBot(msgs);
      msgs.insertAdjacentHTML('beforeend',typingHTML());
      scrollBot(msgs);
      await delay(1500+Math.random()*1000);
      const ti=$('typing');if(ti)ti.remove();
      const resp=await claude(personaId,S.chats[personaId]||[]);
      const aiMsg=mkMsg(personaId,'text',resp);
      addMsg('chats',personaId,aiMsg);
      msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
      scrollBot(msgs);
      // If user has navigated away, mark as unread
      if(!document.getElementById('msgs')){const u={...S.unreadChats};u[personaId]=(u[personaId]||0)+1;set({unreadChats:u});}
    }
  });
}
