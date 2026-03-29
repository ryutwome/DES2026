/* ============================================================
   DES2026 — Communities list and community feed
   ============================================================ */

const COMM_ACTIVE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isJoinedComm(id) {
  // Backwards-compat: honour legacy joinedCommunities until communityActivity is seeded
  const act = S.communityActivity?.[id];
  if (act != null) return (Date.now() - act) < COMM_ACTIVE_MS;
  return (S.joinedCommunities||[]).includes(id);
}

function markCommActive(commId) {
  const act = {...(S.communityActivity||{})};
  act[commId] = Date.now();
  set({communityActivity: act});
}

/* ── BACKGROUND COMMUNITY ACTIVITY ── */
let _commBgTimer = null;
let _commBgCount = 0;
const COMM_BG_MAX = 50;

function startCommBgActivity() {
  if (_commBgTimer) return;
  function schedule() {
    _commBgTimer = setTimeout(async () => {
      _commBgTimer = null;
      if (_commBgCount >= COMM_BG_MAX) return; // cap reached
      if (document.visibilityState === 'visible') {
        await commBgTick();
        _commBgCount++;
      }
      schedule();
    }, 10000 + Math.random() * 10000); // every 10–20s, only ticks when visible
  }
  schedule();
}

async function commBgTick() {
  const joined = Object.values(COMMUNITIES).filter(c => isJoinedComm(c.id));
  if (!joined.length) return;
  const comm = joined[Math.floor(Math.random() * joined.length)];

  // Skip if user is currently inside this community
  if (location.hash.includes('/community/' + comm.id)) return;

  const personaId = comm.personas[Math.floor(Math.random() * comm.personas.length)];
  const isMention = Math.random() < 0.2;
  const uname = S.userName || 'everyone';

  const recent = (S.communities[comm.id] || []).slice(-5);
  const ctx = recent.map(m => {
    const who = m.from === 'user' ? (S.userName || 'Member') : (PERSONAS[m.from]?.name?.split(' ')[0] || m.from);
    return `${who}: ${m.text}`;
  }).join('\n');

  const note = isMention
    ? `You are in the "${comm.name}" group chat.\n\nRecent:\n${ctx}\n\nSend a short message that naturally mentions @${uname} — ask their opinion or bring them into the conversation. 1–2 sentences.\nIMPORTANT: Just say it naturally. Do NOT say you're waiting, do NOT mention connection issues.`
    : `You are in the "${comm.name}" group chat (${comm.tags.join(', ')}).\n\nRecent:\n${ctx}\n\nSend one short casual message — a reaction, memory, opinion, or something relevant to the topic. 1–2 sentences.\nIMPORTANT: Just say what's on your mind. Do NOT say you're waiting, do NOT mention connection issues.`;

  const resp = await claude(personaId, [{from:'user', text:'(group chat — your turn)'}], note);
  if (!resp) return;

  const text = (isMention && !resp.includes(`@${uname}`)) ? `@${uname} — ${resp}` : resp;
  addMsg('communities', comm.id, mkMsg(personaId, 'text', text));

  // Update badge — @ wins over a plain number.
  // Skip increment while user is browsing the communities list to avoid
  // badge churn; messages still accumulate and show on next tap-in.
  const onCommList = location.hash === '#/communities' || location.hash === '';
  if (!onCommList) {
    const uc = {...(S.unreadCommunities||{})};
    if (isMention) {
      uc[comm.id] = '@';
    } else if (uc[comm.id] !== '@') {
      uc[comm.id] = ((typeof uc[comm.id] === 'number') ? uc[comm.id] : 0) + 1;
    }
    set({unreadCommunities: uc});
  }

  // Refresh the list if user is currently on it
  if (location.hash === '#/communities' || location.hash === '') renderCommunities();
}

function migrateCommData() {
  if (S.commDataMigrated) return;
  Object.values(COMMUNITIES).forEach(c => {
    if (!S.communities[c.id] || !S.communities[c.id].length) {
      const isJoined = isJoinedComm(c.id);
      const baseAge = isJoined ? 3 : 30;
      S.communities[c.id] = c.seed.map((m,i) => ({...mkMsg(m.from,'text',m.text), timestamp:Date.now()-((c.seed.length-i)*baseAge*60000+(isJoined?0:6*3600000))}));
    }
  });
  // Seed unread counts for joined communities; bhajan always gets mention badge
  const uc = {...(S.unreadCommunities||{})};
  uc['bhajan'] = '@';
  const demoUnreads = {cricket:12, bollywood:5, society:8, recipes:3};
  Object.entries(demoUnreads).forEach(([id, n]) => {
    if (isJoinedComm(id) && (uc[id] == null || uc[id] === 0)) uc[id] = n;
  });
  set({unreadCommunities: uc, commDataMigrated: true, commMentionSeeded: 2});
}

function commBadge(commId) {
  const val = (S.unreadCommunities||{})[commId];
  if (val === '@') return `<span class="comm-badge comm-badge--mention">@</span>`;
  if (typeof val === 'number' && val > 0) return `<span class="comm-badge">${val}</span>`;
  return '';
}

/* ── COMMUNITIES LIST ── */
function renderCommunities() {
  migrateCommData();
  startCommBgActivity();
  mount(`
    ${resBar()}
    <div class="header header--white">
      <div class="header__title" onclick="headerTap()"><h1 style="color:#111b21;">Communities</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="screen"><div class="screen__scroll" id="comm-content" style="background:#fff;"></div></div>
    ${bottomNav('communities')}
  `);

  const c = $('comm-content');
  const allComms = Object.values(COMMUNITIES);
  const joined = allComms.filter(comm => isJoinedComm(comm.id));
  const recommended = allComms.filter(comm => !isJoinedComm(comm.id));

  if (joined.length) {
    joined.forEach(comm => c.appendChild(commCard(comm)));
    c.insertAdjacentHTML('beforeend', `<div class="section-heading" style="padding:16px 16px 6px;font-size:12px;font-weight:600;color:#667781;text-transform:uppercase;letter-spacing:0.05em;">Recommended</div>`);
  }
  recommended.forEach(comm => c.appendChild(commCard(comm)));
}

function commCard(comm) {
  const div = document.createElement('div');
  div.className = 'community-card';
  const iconMap  = {cricket:'1f3cf', bollywood:'1f3ac', bhajan:'1f64f', society:'1f3e2', recipes:'1f35b', shayari:'1f338', yoga:'1f9d8'};
  const colorMap = {cricket:'#E53935', bollywood:'#FB8C00', bhajan:'#8E24AA', society:'#546E7A', recipes:'#00897B', shayari:'#AD1457', yoga:'#2E7D32'};
  const iconFile  = iconMap[comm.id] || '1f464';
  const groupColor = colorMap[comm.id] || '#667781';
  const joined = isJoinedComm(comm.id);

  const icon = `<div class="community-card__icon" style="background:${groupColor}"><img src="./icons/groups/${iconFile}.svg" style="width:30px;height:30px;" alt=""></div>`;
  const tags = comm.tags.map(t => `<span class="comm-tag">${t}</span>`).join('');

  let bodyHTML;
  if (joined) {
    // Joined: name + badge right, last message preview below, active count
    const msgs = S.communities[comm.id] || [];
    const last = msgs[msgs.length - 1];
    const lastSender = last ? (last.from === 'user' ? 'You' : PERSONAS[last.from]?.name?.split(' ')[0] || '') : '';
    const preview = last ? `${lastSender}: ${last.text}` : comm.desc;
    const badge = commBadge(comm.id);
    const activeCount = (comm.personas || []).length;
    bodyHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span class="community-card__name">${comm.name}</span>
        ${badge}
      </div>
      <div class="community-card__desc">${preview}</div>
      <div style="font-size:11px;color:#667781;margin-top:3px;"><span style="color:#25d366;">&#9679;</span> ${activeCount} active members</div>`;
  } else {
    // Recommended: name + member count right, desc, tags
    bodyHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span class="community-card__name">${comm.name}</span>
        <span style="font-size:12px;color:#667781;flex-shrink:0;">${comm.members.toLocaleString()} members</span>
      </div>
      <div class="community-card__desc">${comm.desc}</div>
      <div class="community-card__tags">${tags}</div>`;
  }

  div.innerHTML = `${icon}<div class="community-card__body">${bodyHTML}</div>`;
  div.onclick = () => navigate('#/community/' + comm.id);
  return div;
}

/* ── GROUP CHAT RENDERING ── */
function speakCommGroup(btn, groupId, text) {
  if (_playing[groupId]) { stopSpeak(); delete _playing[groupId]; btn.classList.remove('comm-tts-btn--playing'); return; }
  Object.keys(_playing).forEach(k => { delete _playing[k]; document.querySelectorAll('.comm-tts-btn--playing').forEach(b => b.classList.remove('comm-tts-btn--playing')); });
  speak(text, () => { delete _playing[groupId]; btn.classList.remove('comm-tts-btn--playing'); });
  _playing[groupId] = true; btn.classList.add('comm-tts-btn--playing');
}

function renderCommMsgs(container, messages) {
  let lastDate = '';
  messages.forEach(msg => {
    // Date divider when day changes
    const d = new Date(msg.timestamp).toDateString();
    if (d !== lastDate) {
      lastDate = d;
      const today = new Date().toDateString(), yday = new Date(Date.now()-86400000).toDateString();
      const label = d===today?'Today':d===yday?'Yesterday':new Date(msg.timestamp).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
      container.insertAdjacentHTML('beforeend', `<div class="chat-date-divider"><span>${label}</span></div>`);
    }

    const sent = msg.from === 'user';
    const p = sent ? null : PERSONAS[msg.from];

    // Wrap each message in a row div so highlight logic can target it
    const row = document.createElement('div');
    row.className = `comm-msg-row${sent?' comm-msg-row--sent':''}`;
    row.dataset.msgId = msg.id;

    // Show sender name above received messages (WhatsApp group style)
    const nameLabel = (!sent && p)
      ? `<div class="comm-sender-name" style="color:${p.color||'#667781'}">${p.name||msg.from}</div>`
      : '';

    row.innerHTML = nameLabel + bubble(msg);
    container.appendChild(row);
  });
}

/* ── COMMUNITY FEED ── */
function renderCommunity(commId) {
  const comm = COMMUNITIES[commId]; if (!comm) { navigate('#/communities'); return; }
  const hasMentionBadge = (S.unreadCommunities||{})[commId] === '@';
  // Personalise @everyone with user's name
  if (hasMentionBadge && S.communities[commId]) {
    const uname = S.userName || 'everyone';
    S.communities[commId].forEach(m => {
      if (m.text && m.text.includes('@everyone')) m.text = m.text.replace('@everyone', `@${uname}`);
    });
  }
  // Clear badge on open
  const uc = {...(S.unreadCommunities||{})}; uc[commId] = 0; set({unreadCommunities: uc});
  // Always show a voice room button; disabled with tooltip when no voice room exists
  const right = comm.voiceRoom
    ? [{icon:IC.voiceRoom, label:'Voice Room', fn:`navigate('#/voiceroom/${comm.voiceRoom}')`}]
    : [{icon:IC.voiceRoom, label:'Voice Room (Coming Soon)', fn:"toast('Voice room is coming soon \u2014 stay tuned!')"}];
  mount(`
    ${header(comm.name, {back:true, subtitle:`${comm.members} members`, right, white:true})}
    <div class="screen chat-screen" id="comm-wrap">
      <div class="chat-messages" id="comm-msgs"></div>
    </div>
  `);

  // Style and label the voice room button as disabled when no voice room is configured
  if (!comm.voiceRoom) {
    const vrBtn = document.querySelector('.header__actions .header__action-btn');
    if (vrBtn) {
      vrBtn.style.opacity = '0.55';
      vrBtn.style.cursor = 'not-allowed';
      vrBtn.title = 'Voice Room (Coming Soon)';
      // Replace icon-only content with a text label so elderly users know it's not broken
      vrBtn.innerHTML = `<span style="font-size:0.72rem;font-weight:600;color:#667781;white-space:nowrap;">Voice Room<br>(Coming Soon)</span>`;
    }
  }

  const msgs = $('comm-msgs');
  msgs.insertAdjacentHTML('beforeend', `<div style="text-align:center;margin:8px 0;"><div style="display:inline-block;background:#fdf4c5;color:#54656f;font-size:11.5px;padding:5px 10px;border-radius:7px;line-height:1.4;max-width:260px;">${ej('lock','11.5px')} Messages are end-to-end encrypted.</div></div>`);
  renderCommMsgs(msgs, S.communities[commId] || []);

  // Scroll to and highlight the mention message
  if (hasMentionBadge) {
    const userName = S.userName || 'everyone';
    const mentionRow = [...msgs.querySelectorAll('.comm-msg-row')].find(r => r.querySelector('.bubble')?.textContent.includes(`@${userName}`));
    if (mentionRow) {
      setTimeout(() => {
        mentionRow.scrollIntoView({behavior:'smooth', block:'center'});
        mentionRow.querySelector('.bubble')?.classList.add('comm-bubble--highlight');
        setTimeout(() => mentionRow.querySelector('.bubble')?.classList.remove('comm-bubble--highlight'), 2500);
      }, 200);
    }
  } else {
    scrollBot(msgs);
  }
  const COMM_PLACEHOLDERS = {
    cricket:   'Talk cricket — matches, players, memories...',
    bollywood: 'Share a Bollywood memory or song...',
    bhajan:    'Share a bhajan or spiritual thought...',
    society:   'Ask your neighbours something...',
    recipes:   'Share a recipe or ask for one...',
    shayari:   'Share a couplet or poem...',
    yoga:      'Share a wellness tip or question...',
  };
  const inputPlaceholder = COMM_PLACEHOLDERS[commId] || 'Say something to the group...';
  renderInputBar('comm-wrap', {placeholder: inputPlaceholder, onSend: async (data) => {
    const {type, text, image, caption} = data;
    markCommActive(commId);
    const msg = mkMsg('user', type, text||caption||'');
    if(type==='image'){ msg.image=image; msg.caption=caption; }
    addMsg('communities', commId, msg);
    // Re-render last few messages so grouping stays correct
    const allMsgs = S.communities[commId] || [];
    const lastRow = msgs.lastElementChild;
    if (lastRow && lastRow.classList.contains('comm-msg-row')) lastRow.remove(); // remove last row before re-appending with updated state
    renderCommMsgs(msgs, allMsgs.slice(-1));
    scrollBot(msgs);
    // Pick 2–3 responders (shuffled, no repeats)
    const shuffled = [...comm.personas].sort(() => Math.random() - 0.5);
    const responderCount = shuffled.length >= 3 ? (Math.random() < 0.4 ? 3 : 2) : Math.min(shuffled.length, 2);
    const responders = shuffled.slice(0, responderCount);

    for (let ri = 0; ri < responders.length; ri++) {
      if (!$('comm-msgs')) break;
      await delay(1800 + Math.random()*1500);
      if (!$('comm-msgs')) break;
      // Show "Name is typing..." above the dots using the upcoming responder's name
      const typingName = PERSONAS[responders[ri]]?.name?.split(' ')[0] || '';
      const namedTypingHTML = typingName
        ? `<div class="bubble-wrap bubble-wrap--recv" id="typing"><div class="comm-sender-name" style="color:${PERSONAS[responders[ri]]?.color||'#667781'}">${typingName}</div><div class="typing-indicator"><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div></div></div>`
        : typingHTML();
      msgs.insertAdjacentHTML('beforeend', namedTypingHTML); scrollBot(msgs);
      await delay(1200 + Math.random()*1000);
      const ti = $('typing'); if (ti) ti.remove();
      if (!$('comm-msgs')) break;

      // Build conversation context as readable text so roles stay clean
      const recent = (S.communities[commId] || []).slice(-8);
      const ctx = recent.map(m => {
        const who = m.from === 'user' ? (S.userName || 'Member') : (PERSONAS[m.from]?.name?.split(' ')[0] || m.from);
        return `${who}: ${m.text}`;
      }).join('\n');

      const note = `You are in the "${comm.name}" group chat (${comm.tags.join(', ')}).

Recent conversation:
${ctx}

Send your next message in this group chat. React to what was just said — agree, disagree, share a memory, ask something, or add a thought. 1–2 sentences only.
IMPORTANT: Just say what's on your mind. Do NOT say you're waiting, do NOT ask others to respond, do NOT mention connection issues.`;

      const resp = await claude(responders[ri], [{from:'user', text:'(group chat — your turn)'}], note);
      if (!$('comm-msgs')) break;
      const aiMsg = mkMsg(responders[ri], 'text', resp);
      addMsg('communities', commId, aiMsg);
      renderCommMsgs(msgs, [aiMsg]);
      scrollBot(msgs);
    }
  }});
}
