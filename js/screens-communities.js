/* ============================================================
   DES2026 — Communities list and community feed
   ============================================================ */

/* ── COMMUNITIES ── */
function renderCommunities(){
  mount(`
    ${resBar()}
    <div class="header header--white">
      <div class="header__title" onclick="headerTap()"><h1 style="color:#111b21;">Communities</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" aria-label="Search">${IC.search}</button>
        <button class="header__action-btn" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="sub-tabs"><button class="sub-tab active" id="ct-joined" onclick="showCommTab('joined')">Joined</button><button class="sub-tab" id="ct-discover" onclick="showCommTab('discover')">Discover</button></div>
    <div class="screen"><div class="screen__scroll" id="comm-content"></div></div>
    ${bottomNav('communities')}
  `);
  showCommTab('joined');
}
function showCommTab(tab){
  ['joined','discover'].forEach(t=>{const b=$('ct-'+t);if(b)b.className='sub-tab'+(t===tab?' active':'');});
  const c=$('comm-content');if(!c)return;c.innerHTML='';
  if(tab==='joined'){
    const joined=S.joinedCommunities||[];
    if(!joined.length){c.innerHTML='<div class="empty-state"><div class="empty-state__icon">👥</div><div class="empty-state__title">No communities yet</div><div class="empty-state__desc">Go to Discover to join communities.</div></div>';return;}
    joined.forEach(id=>{const comm=COMMUNITIES[id];if(!comm)return;c.appendChild(commCard(comm,true));});
    // Also add all available communities with join option
    Object.values(COMMUNITIES).filter(c=>!joined.includes(c.id)).forEach(comm=>c.appendChild(commCard(comm,false)));
  } else {
    c.insertAdjacentHTML('afterbegin','<div class="tag-filter-row" id="tag-row"></div>');
    const tags=[...new Set(Object.values(COMMUNITIES).flatMap(c=>c.tags))];
    const tagRow=$('tag-row');let activeTag=null;
    function renderDiscover(filterTag){
      const existing=c.querySelectorAll('.community-card');existing.forEach(e=>e.remove());
      Object.values(COMMUNITIES).filter(comm=>!filterTag||comm.tags.includes(filterTag)).forEach(comm=>c.appendChild(commCard(comm,S.joinedCommunities.includes(comm.id))));
    }
    tags.forEach(tag=>{const b=document.createElement('button');b.className='tag-chip tag-chip--filter';b.textContent=tag;b.onclick=()=>{activeTag=activeTag===tag?null:tag;tagRow.querySelectorAll('.tag-chip--filter').forEach(x=>x.classList.remove('active'));if(activeTag)b.classList.add('active');renderDiscover(activeTag);};tagRow.appendChild(b);});
    renderDiscover(null);
  }
}
function commCard(comm,joined){
  const div=document.createElement('div');div.className='community-card';
  const groupEmoji=comm.tags[0]==='cricket'?'🏏':comm.tags[0]==='bollywood'?'🎬':comm.tags[0]==='bhajan'||comm.tags[0]==='spirituality'?'🙏':comm.tags[0]==='society'?'🏢':comm.tags[0]==='cooking'||comm.tags[0]==='recipes'?'🍛':'👥';
  div.innerHTML=`<div class="community-card__icon" style="background:${comm.color||'#00897B'}">${groupEmoji}</div><div class="community-card__body"><div class="community-card__name">${comm.name}</div><div class="community-card__meta"><span style="font-size:11.5px;color:#667781;">Group · ${comm.members} members</span></div><div class="community-card__desc">${comm.desc}</div></div><button class="community-card__join-btn${joined?' joined':''}" onclick="toggleJoin(event,'${comm.id}')">${joined?'✓ Joined':'Join'}</button>`;
  div.onclick=e=>{if(e.target.classList.contains('community-card__join-btn'))return;navigate('#/community/'+comm.id);};
  return div;
}
function toggleJoin(e,commId){
  e.stopPropagation();
  const joined=[...S.joinedCommunities];
  const idx=joined.indexOf(commId);
  if(idx>=0)joined.splice(idx,1);else joined.push(commId);
  set({joinedCommunities:joined});
  showCommTab('discover');
}

/* ── COMMUNITY FEED ── */
function renderCommunity(commId){
  const comm=COMMUNITIES[commId];if(!comm){navigate('#/communities');return;}
  const right=[];
  if(comm.voiceRoom) right.push({icon:IC.voiceRoom,label:'Voice Room',fn:`navigate('#/voiceroom/${comm.voiceRoom}')`});
  mount(`
    ${header(comm.name,{back:true,subtitle:`${comm.members} members`,right,white:true})}
    <div class="screen chat-screen" id="comm-wrap">
      <div class="chat-messages" id="comm-msgs"></div>
    </div>
  `);
  const msgs=$('comm-msgs');
  msgs.insertAdjacentHTML('beforeend',`<div style="text-align:center;margin:8px 0;"><div style="display:inline-block;background:#fdf4c5;color:#54656f;font-size:11.5px;padding:5px 10px;border-radius:7px;line-height:1.4;max-width:260px;">🔒 Messages are end-to-end encrypted.</div></div>`);
  let lastDateC='';
  (S.communities[commId]||[]).forEach(m=>{
    const d=new Date(m.timestamp).toDateString();
    if(d!==lastDateC){lastDateC=d;const today=new Date().toDateString();const yday=new Date(Date.now()-86400000).toDateString();const label=d===today?'Today':d===yday?'Yesterday':new Date(m.timestamp).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});msgs.insertAdjacentHTML('beforeend',`<div class="chat-date-divider"><span>${label}</span></div>`);}
    msgs.insertAdjacentHTML('beforeend',bubble(m));
  });
  scrollBot(msgs);
  renderInputBar('comm-wrap',{placeholder:'Message community',onSend:async({type,text})=>{
    const msg=mkMsg('user',type,text);
    addMsg('communities',commId,msg);
    msgs.insertAdjacentHTML('beforeend',bubble(msg));
    scrollBot(msgs);
    msgs.insertAdjacentHTML('beforeend',typingHTML());scrollBot(msgs);
    await delay(1500+Math.random()*1000);
    const ti=$('typing');if(ti)ti.remove();
    const responderId=comm.personas[Math.floor(Math.random()*comm.personas.length)];
    const note=`You are in the "${comm.name}" community group (${comm.tags.join(', ')}). A member just posted: "${text}". Reply naturally as part of this group.`;
    const resp=await claude(responderId,S.communities[commId]||[],note);
    const aiMsg=mkMsg(responderId,'text',resp);
    addMsg('communities',commId,aiMsg);
    msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
    scrollBot(msgs);
  }});
}
