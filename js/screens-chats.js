/* ============================================================
   DES2026 — Chats list, status viewer, and chat screen
   ============================================================ */

/* ── CHATS LIST ── */
function renderChats(){
  mount(`
    ${desktopBanner()}
    ${resBar()}
    <div class="header header--white">
      <div class="header__title" onclick="headerTap()"><h1 style="color:#00A884;">Saathi${S.userName?` · <span style="font-size:0.75em;color:#54656f;">${S.userName}</span>`:''}</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" style="color:#54656f;" aria-label="QR code" onclick="toast('QR code coming soon')">${IC.qr}</button>
        <button class="header__action-btn" style="color:#54656f;" aria-label="Settings" onclick="showSettings()">${IC.more}</button>
      </div>
    </div>
    <div class="screen" style="background:#fff;position:relative;">
      <div class="chats-search-bar">
        <i data-lucide="search" style="width:18px;height:18px;color:#8696a0;flex-shrink:0;"></i>
        <input id="chat-search" type="search" placeholder="Search" style="flex:1;border:none;outline:none;font-size:15px;color:#111;background:transparent;" oninput="filterChatSearch(this.value)">
      </div>
      <div class="filter-chips">
        <button class="filter-chip active" onclick="filterChips(this,'all')">All</button>
        <button class="filter-chip" onclick="filterChips(this,'unread')">Unread</button>
      </div>
      <div class="screen__scroll" id="chat-list"></div>
    </div>
    ${bottomNav('chats')}
  `);
  buildChatList('all');
}

/* Build (or rebuild) the visible chat list rows for the given filter tab.
   Called once on render and again whenever a filter chip is tapped. */
function buildChatList(filter){
  // Build persona items
  const personaItems=Object.keys(S.chats).filter(id=>PERSONAS[id]).map(id=>{
    const msgs=S.chats[id]||[],last=msgs[msgs.length-1];
    return{kind:'persona',id,last,time:last?.timestamp||0};
  });

  // Sort persona items by recency
  const allItems=[...personaItems].sort((a,b)=>b.time-a.time);

  // Apply filter
  const visible=allItems.filter(item=>{
    if(filter==='unread') return (S.unreadChats[item.id]||0)>0;
    return true; // 'all'
  });

  const list=$('chat-list');
  list.innerHTML='';

  if(!visible.length){
    // Context-aware empty state — message depends on which filter is active
    let icon='chat', title='', desc='', btn='';
    if(filter==='unread'){
      title='All caught up!';
      desc='No unread messages — you\'re up to date.';
    } else {
      // 'all' — shouldn't normally be empty since personas are always seeded
      title='आपका स्वागत है! / Swagat!';
      desc='Open a chat to get started.';
    }
    list.innerHTML=`<div class="empty-state">
      <div class="empty-state__icon">${ej(icon,'48px')}</div>
      <div class="empty-state__title">${title}</div>
      <div class="empty-state__desc">${desc}</div>
      ${btn}
    </div>`;
    return;
  }

  visible.forEach(item=>{
    const div=document.createElement('div');
    div.className='chat-list-item';

    if(item.kind==='persona'){
      const {id,last,time}=item;
      const p=PERSONAS[id];
      const unread=S.unreadChats[id]||0;
      const isUserMsg=last?.from==='user';
      const previewText=last?(last.type==='voice'?`${ej('mic')} Voice message`:last.type==='image'?`${IC.image} Photo${last.caption?' '+last.caption:''}`:(last.text||'')):'' ;
      const tickHtml=isUserMsg?`<svg width="16" height="11" viewBox="0 0 18 11" fill="#53bdeb" style="flex-shrink:0;margin-right:2px"><path d="M17.394.606a.75.75 0 0 1 0 1.06L8.9 10.16a.75.75 0 0 1-1.06 0L4.606 6.928a.75.75 0 1 1 1.06-1.06l2.704 2.703 7.963-7.965a.75.75 0 0 1 1.06 0zM1 5.868l2.704 2.704a.75.75 0 1 0 1.06-1.06L2.06 4.806A.75.75 0 0 0 1 5.868z"/></svg>`:'';
      const ai='';
      const timeClass=unread?'chat-list-item__time chat-list-item__time--unread':'chat-list-item__time';
      const hasStatus=PERSONA_STATUS_IMAGES[id]!==undefined;
      const viewed=(S.viewedStatuses||[]).includes(id);
      const avatarEl=hasStatus
        ?`<div class="chat-avatar-story-ring${viewed?' chat-avatar-story-ring--viewed':''}" onclick="event.stopPropagation();openStatus('${id}')">${avatar(p.name,'md',id)}</div>`
        :`<div>${avatar(p.name,'md',id)}</div>`;
      // Presence dot marks every persona as online
      div.dataset.name=p.name.toLowerCase();
      div.innerHTML=`<div class="chat-list-item__avatar">${avatarEl}<span class="presence-dot"></span></div><div class="chat-list-item__body"><div class="chat-list-item__top"><div class="chat-list-item__name">${p.name}${ai}</div><div class="${timeClass}">${fdate(time)}</div></div><div class="chat-list-item__bottom"><div class="chat-list-item__preview" style="display:flex;align-items:center;">${tickHtml}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${previewText}</span></div>${unread?`<div class="chat-list-item__badge">${unread}</div>`:''}</div></div>`;
      div.onclick=()=>{const u={...S.unreadChats};delete u[id];set({unreadChats:u});navigate('#/chat/'+id);};
    }

    list.appendChild(div);
  });
}

/* Toggle the active chip and re-render the list with the selected filter. */
function filterChips(btn,filter){
  document.querySelectorAll('.filter-chip').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  buildChatList(filter);
  // Re-apply any active search query after rebuilding
  const q=document.getElementById('chat-search')?.value.trim().toLowerCase();
  if(q) filterChatSearch(q);
}

/* Filter visible chat rows by name without re-rendering — called on search input. */
function filterChatSearch(q){
  const term=q.trim().toLowerCase();
  document.querySelectorAll('#chat-list .chat-list-item').forEach(row=>{
    row.style.display=!term||row.dataset.name?.includes(term)?'':'none';
  });
}

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

  // Auto-progress bar — 8 seconds
  const bar=overlay.querySelector('#sv-bar');
  let start=null;
  function tick(ts){
    if(!start) start=ts;
    const pct=Math.min(100,(ts-start)/8000*100);
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

/* Returns a dynamic "last seen" string — 50% online, otherwise a recent time. */
function relativeStatus(){
  const r=Math.random();
  if(r<0.5) return 'online';
  // Pick a random time 5–125 minutes ago
  const minsAgo=Math.floor(Math.random()*120)+5;
  const t=new Date(Date.now()-minsAgo*60000);
  const hh=t.getHours(),mm=t.getMinutes().toString().padStart(2,'0');
  const ampm=hh>=12?'PM':'AM';
  const h12=hh%12||12;
  if(minsAgo<1440) return `last seen today at ${h12}:${mm} ${ampm}`;
  return 'last seen yesterday';
}

/* ── CHAT SCREEN ── */
function renderChat(personaId){
  const p=PERSONAS[personaId];if(!p){navigate('#/chats');return;}
  const status=relativeStatus();
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
