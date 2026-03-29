/* ============================================================
   DES2026 — Stories feed, story cards, compose, and thread
   ============================================================ */

/* ── STORIES ── */
let _storiesFilter='all';

function renderStories(filter){
  if(filter) _storiesFilter=filter;
  // One-time migration: add likes to stories seeded before likes were introduced
  if((S.stories||[]).some(s=>s.likes===undefined)){
    const defaultLikes=[14,9,18,7,11,6,16,24,8,5];
    let i=0;
    set({stories:S.stories.map(s=>s.likes!==undefined?s:{...s,likes:defaultLikes[i++%defaultLikes.length],likedByUser:false})});
  }
  const now=Date.now();
  const THIRTY_DAYS=30*86400000;
  const myStories=(S.stories||[]).filter(s=>s.authorId==='user'&&(now-s.timestamp)<THIRTY_DAYS);
  const allActive=(S.stories||[]).filter(s=>s.authorId!=='user'&&(now-s.timestamp)<THIRTY_DAYS);

  let feed=allActive;
  if(_storiesFilter==='communities'){
    feed=allActive.filter(s=>s.source==='community');
  } else if(_storiesFilter==='contacts'){
    feed=allActive.filter(s=>s.source!=='community');
  }

  const filters=[
    {id:'all',label:'All'},
    {id:'communities',label:'Communities'},
    {id:'contacts',label:'Contacts'},
  ];

  mount(`
    ${resBar()}
    <div class="header header--white">
      <div class="header__title"><h1 style="color:#111b21;">Stories</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" style="color:#54656f;" aria-label="Search">${IC.search}</button>
        <button class="header__action-btn" style="color:#54656f;" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="screen" style="position:relative;">
      <div class="filter-chips" style="padding:8px 12px 10px;">
        ${filters.map(f=>`<button class="filter-chip${_storiesFilter===f.id?' active':''}" onclick="renderStories('${f.id}')">${f.label}</button>`).join('')}
      </div>
      <div class="screen__scroll" style="background:#f0f2f5;" id="stories-feed">
        <div style="height:8px;"></div>
        <div id="my-stories-section"></div>
        <div id="stories-feed-divider" style="display:none;"></div>
        <div id="stories-cards"></div>
        <div style="height:88px;"></div>
      </div>
      <button class="fab" onclick="showStoryCompose()" aria-label="New story">
        <i data-lucide="pencil-line" style="width:22px;height:22px;color:#fff;"></i>
      </button>
    </div>
    ${bottomNav('stories')}
  `);

  // Always render My Stories at top
  const mySec=$('my-stories-section');
  if(myStories.length>0){
    mySec.innerHTML=`<div class="stories-section-label">My Stories <span class="stories-section-count">${myStories.length}/3</span></div>`;
    myStories.forEach(s=>mySec.appendChild(buildStoryCard(s,true)));
    const divider=$('stories-feed-divider');
    divider.style.display='block';
    divider.innerHTML=`<div class="stories-section-label" style="margin-top:4px;">From Your Network</div>`;
  }

  const cardsEl=$('stories-cards');
  if(!feed.length){
    cardsEl.innerHTML=`<div class="stories-empty-mine" style="margin-top:${myStories.length?'0':'32px'}px;">
      <i data-lucide="book-open" style="width:40px;height:40px;color:#00A884;margin-bottom:8px;"></i>
      <div style="font-size:16px;font-weight:600;color:#111b21;">No stories yet</div>
      <div style="font-size:14px;color:#667781;margin-top:4px;">Be the first to share a memory!</div>
      <button onclick="showStoryCompose()" style="margin-top:14px;padding:8px 20px;background:#00A884;color:#fff;border:none;border-radius:20px;font-size:14px;font-weight:600;cursor:pointer;">Share a Story</button>
    </div>`;
    lucide.createIcons();
    return;
  }
  feed.sort((a,b)=>b.timestamp-a.timestamp).forEach(s=>cardsEl.appendChild(buildStoryCard(s,false)));
  lucide.createIcons();
}

function buildStoryCard(s, isOwn){
  const p=PERSONAS[s.authorId];
  const name=s.authorName||(p?p.name:(isOwn?'You':'Unknown'));
  const replyCount=(s.replies||[]).length;
  const likeCount=(s.likes||0);
  const liked=!!(s.likedByUser);
  const card=document.createElement('div');
  card.className='story-feed-card';
  card.id='scard-'+s.id;

  const title=s.title||s.text.slice(0,60);
  // Keep emoji in previews — they are semantic and part of the story text
  const preview=s.text?s.text.trim().slice(0,100)+(s.text.length>100?'…':''):'';
  const hasImage=!!s.imageUrl;
  // Days remaining until story expires (7-day TTL from timestamp)
  const daysLeft=Math.ceil((s.timestamp+7*86400000-Date.now())/86400000);
  const expiryLabel=daysLeft<=1?'Expires today':`Expires in ${daysLeft} days`;
  // Urgent red for ≤2 days remaining, muted gray otherwise
  const expiryColor=daysLeft<=2?'#E53935':'#667781';
  const unreadReplies=isOwn?((S.unreadStoryReplies||{})[s.id]||0):0;

  const deleteBtn=isOwn?`<button class="story-delete-btn" onclick="deleteMyStory('${s.id}')" aria-label="Delete story" style="margin-left:auto;">
    <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
  </button>`:'';

  const displayName=isOwn?(S.userName||'You'):name;
  card.innerHTML=`
    <div class="story-feed-card__body" onclick="navigate('#/story/${s.id}')" style="cursor:pointer;">
      <div class="story-feed-card__byline">
        <div class="story-feed-card__avatar-wrap">
          ${isOwn?`<div class="story-feed-card__avatar-mine">${avatar(displayName,'xs')}</div>`
                 :`<div class="chat-avatar-story-ring story-ring--xs">${avatar(name,'xs',s.authorId)}</div>`}
        </div>
        <span class="story-feed-card__name">${displayName}</span>
        <span class="story-feed-card__dot">·</span>
        <span class="story-feed-card__time">${fdate(s.timestamp)}</span>
        ${deleteBtn}
      </div>
      <div class="story-feed-card__content-row">
        <div class="story-feed-card__text-col">
          <div class="story-feed-card__title">${renderEmoji(title)}</div>
          ${preview?`<div class="story-feed-card__preview">${renderEmoji(preview)}</div>`:''}
        </div>
        ${hasImage?`<div class="story-feed-card__thumb-wrap"><img class="story-feed-card__thumb" src="${s.imageUrl}" alt="" loading="lazy"/></div>`:''}
      </div>
      <div class="story-feed-card__footer" onclick="event.stopPropagation()">
        <button class="story-replies-btn${replyCount>0?' has-replies':''}" id="sreplybtn-${s.id}" onclick="navigate('#/story/${s.id}')">
          <i data-lucide="message-circle" style="width:18px;height:18px;"></i>
          Reply${replyCount>0?` <span id="sreplycount-${s.id}" class="story-reply-count">${replyCount}</span>`:`<span id="sreplycount-${s.id}" style="display:none;"></span>`}
          ${unreadReplies>0?`<span class="story-reply-badge">${unreadReplies} ${unreadReplies===1?'reply':'replies'}</span>`:''}
        </button>
        <button class="story-like-btn${liked?' liked':''}" id="slike-${s.id}" onclick="likeStory('${s.id}')">
          <i data-lucide="heart" style="width:18px;height:18px;${liked?'fill:#E53935;color:#E53935;':''}"></i>
          <span id="slike-count-${s.id}">${likeCount>0?likeCount:''}</span>
        </button>
        <span style="flex:1;"></span>
        ${canTTS()?`<button class="story-tts-btn" onclick="speakStoryCard(this,'${s.id}')" title="Read aloud" aria-label="Read aloud">
          <i data-lucide="volume-2" style="width:16px;height:16px;"></i><span>${S.userLang==='mr'?'मोठ्याने वाचा / Read aloud':'ज़ोर से पढ़ें / Read aloud'}</span>
        </button>`:''}
        <span class="story-expiry-label" style="font-size:0.78rem;color:${expiryColor};">
          <i data-lucide="clock" style="width:12px;height:12px;vertical-align:-2px;margin-right:2px;"></i>${expiryLabel}
        </span>
      </div>
    </div>
  `;
  return card;
}


async function sendStoryReply(storyId, mode){
  const inputId=mode==='thread'?'thread-reply-input':'creply-'+storyId;
  const input=$(inputId);
  const text=input?.value?.trim();
  if(!text) return;
  input.value='';

  const msg=mkMsg('user','text',text);
  const upd=S.stories.map(x=>x.id===storyId?{...x,replies:[...(x.replies||[]),msg]}:x);
  set({stories:upd});

  const repliesEl=$('story-thread-replies');
  if(repliesEl){
    const empty=repliesEl.querySelector('.sv-empty');
    if(empty) empty.remove();
    repliesEl.insertAdjacentHTML('beforeend',_storyBubble(msg));
    const scroll=$('story-thread-scroll');
    if(scroll) scroll.scrollTop=scroll.scrollHeight;
  }

  const story=(S.stories||[]).find(x=>x.id===storyId);
  if(!story||story.authorId==='user') return;
  await delay(1500+Math.random()*1000);
  const aiText=await claude(story.authorId,[msg],`React warmly and briefly to this reply on your story. Story: "${story.text.slice(0,100)}". Reply: "${text}"`);
  const aiMsg=mkMsg(story.authorId,'text',aiText);
  const upd2=S.stories.map(x=>x.id===storyId?{...x,replies:[...(x.replies||[]),aiMsg]}:x);
  set({stories:upd2});
  const repliesEl2=$('story-thread-replies');
  if(repliesEl2){
    repliesEl2.insertAdjacentHTML('beforeend',_storyBubble(aiMsg));
    const scroll=$('story-thread-scroll');
    if(scroll) scroll.scrollTop=scroll.scrollHeight;
  }
}

function speakStoryCard(btn,storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);if(!s)return;
  speakMsg(btn,storyId,s.text);
}

function deleteMyStory(storyId){
  if(!confirm('Delete this story? It cannot be undone.')) return;
  set({stories:S.stories.filter(s=>s.id!==storyId)});
  renderStories();
  toast('Story deleted');
}
function likeStory(storyId){
  const updated=S.stories.map(s=>{
    if(s.id!==storyId) return s;
    const liked=!s.likedByUser;
    return {...s,likedByUser:liked,likes:(s.likes||0)+(liked?1:-1)};
  });
  set({stories:updated});
  const s=updated.find(x=>x.id===storyId);
  if(!s) return;
  const btn=$('slike-'+storyId);
  const countEl=$('slike-count-'+storyId);
  if(btn){
    const icon=btn.querySelector('i');
    if(s.likedByUser){btn.classList.add('liked');if(icon){icon.style.fill='#E53935';icon.style.color='#E53935';}}
    else{btn.classList.remove('liked');if(icon){icon.style.fill='none';icon.style.color='';}}
  }
  if(countEl) countEl.textContent=s.likes>0?s.likes:'';
}
function _storyBubble(r){
  const isUser=r.from==='user';
  const rName=isUser?(S.userName||'You'):(PERSONAS[r.from]?.name||r.from);
  if(isUser){
    return `<div class="sv-bubble-row sv-bubble-row--user">
      <div class="sv-bubble sv-bubble--user"><div class="sv-bubble__text">${renderEmoji(r.text)}</div></div>
    </div>`;
  }
  return `<div class="sv-bubble-row">
    <div class="sv-bubble__avatar">${avatar(rName,'xs',r.from)}</div>
    <div class="sv-bubble sv-bubble--other">
      <div class="sv-bubble__name">${rName}</div>
      <div class="sv-bubble__text">${renderEmoji(r.text)}</div>
    </div>
  </div>`;
}

function renderStoryView(storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);
  if(!s){navigate('#/stories');return;}
  const p=PERSONAS[s.authorId];
  const isOwn=s.authorId==='user';
  const name=s.authorName||(p?p.name:(isOwn?'You':'Unknown'));
  const displayName=isOwn?(S.userName||'You'):name;
  const liked=!!s.likedByUser;
  const likeCount=s.likes||0;

  mount(`
    ${resBar()}
    <div class="header header--white">
      <button class="header__back" onclick="navigate('#/stories')">${IC.back}</button>
      <div class="header__title" style="display:flex;align-items:center;gap:10px;">
        ${isOwn?`<div style="padding:2px;border-radius:50%;background:conic-gradient(#00A884 0deg 360deg);display:inline-flex;">${avatar(displayName,'sm')}</div>`
               :`<div class="chat-avatar-story-ring" style="transform:scale(0.85);transform-origin:center;">${avatar(name,'sm',s.authorId)}</div>`}
        <div>
          <div style="font-size:15px;font-weight:700;color:#111b21;line-height:1.2;">${displayName}</div>
          <div style="font-size:12px;color:#8696a0;font-weight:400;">${fdate(s.timestamp)}</div>
        </div>
      </div>
      <div class="header__actions">
        ${!isOwn?`<button class="header__action-btn" style="color:#54656f;" onclick="navigate('#/chat/${s.authorId}')" title="Message ${name}"><i data-lucide="message-square" style="width:22px;height:22px;"></i></button>`:''}
        ${isOwn?`<button class="header__action-btn" style="color:#E53935;" onclick="deleteMyStory('${s.id}')" aria-label="Delete"><i data-lucide="trash-2" style="width:22px;height:22px;"></i></button>`:''}
      </div>
    </div>
    <div class="screen story-thread-screen" style="background:#efeae2;">
      <div class="screen__scroll" id="story-thread-scroll" style="background:#efeae2;">
        <!-- Pinned story post -->
        <div class="sv-post">
          ${s.title?`<div class="sv-post__title">${s.title}</div>`:''}
          ${s.imageUrl?`<div class="story-thread-img-wrap" style="margin-bottom:10px;"><img src="${s.imageUrl}" class="story-thread-img" alt="" loading="lazy"/></div>`:''}
          <div class="sv-post__body">${renderEmoji(s.text)}</div>
          <div class="sv-post__actions">
            <button class="story-like-btn${liked?' liked':''}" id="slike-${s.id}" onclick="likeStoryThread('${s.id}')">
              <i data-lucide="heart" style="width:18px;height:18px;${liked?'fill:#E53935;color:#E53935;':''}"></i>
              <span id="slike-count-${s.id}">${likeCount>0?likeCount:''}</span>
            </button>
            ${canTTS()?`<button class="story-tts-btn" onclick="speakStoryCard(this,'${s.id}')" aria-label="Read aloud"><i data-lucide="volume-2" style="width:18px;height:18px;"></i></button>`:''}
          </div>
        </div>
        <!-- Chat-style replies -->
        <div id="story-thread-replies" style="padding:8px 10px;">
          ${(s.replies||[]).length===0
            ?`<div class="sv-empty">Be the first to reply! ${ej('wave')}</div>`
            :(s.replies||[]).map(r=>_storyBubble(r)).join('')}
        </div>
        <div style="height:80px;"></div>
      </div>
      <!-- Reply bar -->
      <div class="story-thread-reply-bar">
        <input class="story-thread-reply-input" id="thread-reply-input" placeholder="Reply…" onkeydown="if(event.key==='Enter')sendStoryReply('${s.id}','thread')" />
        <button class="story-thread-reply-send" onclick="sendStoryReply('${s.id}','thread')">${IC.send}</button>
      </div>
    </div>
  `);
  lucide.createIcons();
  // Clear unread badge for this story when user opens it
  if(isOwn&&(S.unreadStoryReplies||{})[storyId]){
    const u={...S.unreadStoryReplies};
    delete u[storyId];
    set({unreadStoryReplies:u});
  }
  const scroll=$('story-thread-scroll');
  if(scroll) setTimeout(()=>scroll.scrollTop=scroll.scrollHeight,50);
}

function likeStoryThread(storyId){
  likeStory(storyId);
  // Re-sync button in thread view
  const s=(S.stories||[]).find(x=>x.id===storyId);
  if(!s) return;
  const btn=$('slike-'+storyId);
  const countEl=$('slike-count-'+storyId);
  if(btn){
    const icon=btn.querySelector('i');
    if(s.likedByUser){btn.classList.add('liked');if(icon){icon.style.fill='#E53935';icon.style.color='#E53935';}}
    else{btn.classList.remove('liked');if(icon){icon.style.fill='none';icon.style.color='';}}
  }
  if(countEl) countEl.textContent=s.likes>0?s.likes:'';
}
function showStoryCompose(){
  const myCount=(S.stories||[]).filter(s=>s.authorId==='user'&&(Date.now()-s.timestamp)<7*86400000).length;
  if(myCount>=3){toast('You have 3 active stories. Delete one to post a new one.');return;}

  let scImageUrl='';

  const bk=sheet(`<div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Share a Story</div>
    <div class="compose-chips" id="sc-chips"></div>
    <div id="sc-img-preview" style="display:none;margin-bottom:8px;position:relative;">
      <img id="sc-img" style="width:100%;max-height:160px;object-fit:cover;border-radius:10px;" />
      <button onclick="document.getElementById('sc-img-preview').style.display='none';scImageUrl='';" style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.5);border:none;border-radius:50%;width:28px;height:28px;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;">✕</button>
    </div>
    <textarea class="compose-textarea" id="sc-text" placeholder="${S.userLang==='mr'?'काय शेअर करायचे आहे? / What would you like to share?':'क्या साझा करना चाहते हैं? / What would you like to share?'}" rows="4" style="font-size:16px;line-height:1.6;"></textarea>
    <div id="sc-hint" style="font-size:12px;color:#8696a0;margin:4px 0 2px;">Start typing or speak to share your story</div>
    <div id="sc-status" style="font-size:13px;color:#8696a0;min-height:18px;margin:4px 0 6px;display:flex;align-items:center;gap:6px;"></div>
    <div style="display:flex;gap:10px;align-items:center;margin-top:2px;">
      <button class="sc-attach-btn" id="sc-attach" title="Add photo">${IC.attach}</button>
      <input type="file" id="sc-file" accept="image/*" style="display:none;" />
      <button class="compose-post-btn" id="sc-post" disabled style="flex:1;">${S.userLang==='mr'?'पोस्ट करा / Post':'पोस्ट करें / Post'}</button>
      <button class="sc-mic-btn" id="sc-mic" title="Speak your story">${IC.mic}</button>
    </div>
    <div id="sc-title-row" style="display:none;margin-top:10px;">
      <input id="sc-title" class="compose-title-input" placeholder="Story title (tap to edit)" style="width:100%;box-sizing:border-box;" />
    </div>
    <div style="font-size:12px;color:#8696a0;margin-top:8px;text-align:center;">Stories expire after 7 days · ${3-myCount} slot${3-myCount===1?'':'s'} remaining</div>
  `);
  lucide.createIcons();

  const mr = S.userLang === 'mr';
  const chips = mr
    ? ['माझी आवडती रेसिपी / A recipe I love','बालपणीची आठवण / A childhood memory','माझे मत... / My opinion on...','एक माणूस जो आठवतो / A person I still think about']
    : ['मेरी पसंदीदा रेसिपी / A recipe I love','बचपन की याद / A childhood memory','मेरी राय... / My opinion on...','एक इंसान जो याद आता है / A person I still think about'];
  const chipsDiv=$('sc-chips');
  chips.forEach(c=>{const b=document.createElement('button');b.className='compose-chip';b.textContent=c;b.onclick=()=>{$('sc-text').value=c+': ';$('sc-text').focus();$('sc-post').disabled=false;};chipsDiv.appendChild(b);});

  $('sc-text').oninput=()=>{
    const hasText=!!$('sc-text').value.trim();
    $('sc-post').disabled=!hasText;
    $('sc-hint').style.display=hasText?'none':'';
  };

  // Attachment
  $('sc-attach').onclick=()=>$('sc-file').click();
  $('sc-file').onchange=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      // Resize to max 1024px JPEG before storing — keeps API payload small
      const img=new Image();
      img.onload=()=>{
        const MAX=1024;
        let w=img.width,h=img.height;
        if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;}}
        const canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        scImageUrl=canvas.toDataURL('image/jpeg',0.82);
        $('sc-img').src=scImageUrl;
        $('sc-img-preview').style.display='block';
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Auto-polish after voice ends (Wispr Flow style)
  async function autoPolish(raw){
    if(!raw||raw.split(' ').length<6) return; // too short to polish
    const status=$('sc-status');
    status.innerHTML=`<i data-lucide="sparkles" style="width:14px;height:14px;color:#00A884;"></i> Polishing your story…`;
    lucide.createIcons();
    $('sc-post').disabled=true;
    try{
      const [polished,titleResp]=await Promise.all([
        claude('meenakshiamma',[],`You are a gentle writing assistant for elderly users. Take this rough voice transcript and make it warm, clear and readable — keeping the person's own voice and all personal details. Fix grammar and filler words. Keep it under 150 words. Raw text: "${raw}"`),
        claude('meenakshiamma',[],`Generate a short, compelling story title (max 8 words) for this text. Return ONLY the title, no quotes, no explanation. Text: "${raw.slice(0,200)}"`)
      ]);
      $('sc-text').value=polished;
      $('sc-title-row').style.display='block';
      $('sc-title').value=titleResp.trim().replace(/^["']|["']$/g,'');
      status.innerHTML=`<i data-lucide="check" style="width:14px;height:14px;color:#00A884;"></i> Polished`;
      lucide.createIcons();
      setTimeout(()=>{if(status)status.innerHTML='';},2500);
    }catch(e){status.innerHTML='';}
    $('sc-post').disabled=!$('sc-text').value.trim();
  }

  let scRec=false,scTxt='';
  $('sc-mic').onclick=()=>{
    if(!canSTT()){toast('Voice input not available on this browser');return;}
    if(scRec){
      stopRec();scRec=false;
      $('sc-mic').classList.remove('recording');
      return;
    }
    scRec=true;scTxt=$('sc-text').value;
    $('sc-mic').classList.add('recording');
    $('sc-hint').style.display='none';
    startRec({
      onInterim:t=>{$('sc-text').value=scTxt+t;},
      onFinal:t=>{scTxt+=t+' ';$('sc-text').value=scTxt.trim();$('sc-post').disabled=false;},
      onError:()=>{scRec=false;$('sc-mic').classList.remove('recording');},
      onEnd:()=>{
        scRec=false;$('sc-mic').classList.remove('recording');
        const raw=$('sc-text').value.trim();
        if(raw) autoPolish(raw);
      }
    });
  };

  $('sc-post').onclick=()=>{
    const t=$('sc-text').value.trim();if(!t)return;
    let title=$('sc-title')?.value?.trim()||'';
    if(!title){
      const clean=t.replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27BF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]/gu,'').trim();
      const firstSentence=clean.split(/[.!?]/)[0].trim();
      title=(firstSentence.length>8?firstSentence:clean).slice(0,72);
    }
    const s=mkStory('user','You',t,title,scImageUrl);
    set({stories:[s,...S.stories]});
    closeSheet(bk);toast(`Story shared! ${ej('sparkles')}`);renderStories();
    setTimeout(()=>triggerStoryReactions(s),6000+Math.random()*4000);
  };
}
function _refreshStoryCardCounts(storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);
  if(!s) return;
  const replyCount=(s.replies||[]).length;
  const btn=$('sreplybtn-'+storyId);
  const countEl=$('sreplycount-'+storyId);
  if(btn){
    if(replyCount>0) btn.classList.add('has-replies');
    else btn.classList.remove('has-replies');
  }
  // Show count badge when replies exist; hide span when 0 (button always shows "Reply" text)
  if(countEl){ countEl.textContent=replyCount>0?replyCount:''; countEl.style.display=replyCount>0?'':'none'; }
}

function _appendReplyToThread(m){
  const repliesEl=$('story-thread-replies');
  if(!repliesEl) return;
  const empty=repliesEl.querySelector('.sv-empty');
  if(empty) empty.remove();
  repliesEl.insertAdjacentHTML('beforeend',_storyBubble(m));
  const scroll=$('story-thread-scroll');
  if(scroll) scroll.scrollTop=scroll.scrollHeight;
}

async function triggerStoryReactions(story){
  const chatContacts=Object.keys(S.chats||{}).filter(id=>PERSONAS[id]);
  // Shuffle and pick 2 distinct reactors
  const shuffled=[...chatContacts].sort(()=>Math.random()-0.5);
  const reactors=shuffled.slice(0,2);
  if(!reactors.length) return;

  const imgNote=story.imageUrl?'There is an image attached to this story — describe what you see in it briefly as part of your reaction, if relevant.':'';
  const prompts=[
    `You are ${PERSONAS[reactors[0]]?.name}. A friend just posted this story. React warmly and personally — pick up on something specific from the text${story.imageUrl?' or the photo':''}. 1-2 sentences, your own voice. ${imgNote} Story: "${story.text.slice(0,200)}"`,
    `You are ${PERSONAS[reactors[1]]?.name}. A friend posted this story and someone already reacted. Add your own warm, distinct reaction — don't just agree, bring your own perspective or memory. 1-2 sentences. ${imgNote} Story: "${story.text.slice(0,200)}"`
  ];

  for(let i=0;i<reactors.length;i++){
    await delay(4000+Math.random()*3000);
    const reactorId=reactors[i];
    const t=await claude(reactorId,[{from:'user',text:'React to my story'}],prompts[i],story.imageUrl||'');
    const m=mkMsg(reactorId,'text',t);
    const upd=S.stories.map(s=>s.id===story.id?{...s,replies:[...(s.replies||[]),m]}:s);
    set({stories:upd});
    // Badge: only count replies on the user's own stories
    if(story.authorId==='user'){
      const u={...S.unreadStoryReplies};
      u[story.id]=(u[story.id]||0)+1;
      set({unreadStoryReplies:u});
    }
    _refreshStoryCardCounts(story.id);
    _appendReplyToThread(m);
  }
}
