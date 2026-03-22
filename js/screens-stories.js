/* ============================================================
   DES2026 — Stories feed, story cards, compose, and thread
   ============================================================ */

/* ── STORIES ── */
let _storiesFilter='all';

function renderStories(filter){
  if(filter) _storiesFilter=filter;
  const now=Date.now();
  const SEVEN_DAYS=7*86400000;
  const myStories=(S.stories||[]).filter(s=>s.authorId==='user'&&(now-s.timestamp)<SEVEN_DAYS);
  const allActive=(S.stories||[]).filter(s=>s.authorId!=='user'&&(now-s.timestamp)<SEVEN_DAYS);

  let feed=allActive;
  if(_storiesFilter==='communities'){
    const communityPersonas=new Set((S.joinedCommunities||[]).flatMap(cId=>{
      const c=COMMUNITIES[cId];return c?c.personas||[]:[];
    }));
    feed=allActive.filter(s=>communityPersonas.has(s.authorId));
  } else if(_storiesFilter==='contacts'){
    feed=allActive.filter(s=>PERSONAS[s.authorId]);
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
      <div class="filter-chips" style="padding:8px 12px 0;">
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
      <i data-lucide="newspaper" style="width:40px;height:40px;color:#00A884;margin-bottom:8px;"></i>
      <div style="font-size:16px;font-weight:600;color:#111b21;">No stories here yet</div>
      <div style="font-size:14px;color:#667781;margin-top:4px;">Stories from your network will appear here</div>
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
  const preview=s.text?s.text.replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27BF]/gu,'').trim().slice(0,100)+(s.text.length>100?'…':''):'';
  const hasImage=!!s.imageUrl;

  const deleteBtn=isOwn?`<button class="story-delete-btn" onclick="deleteMyStory('${s.id}')" aria-label="Delete story" style="margin-left:auto;">
    <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
  </button>`:'';

  const displayName=isOwn?(S.userName||'You'):name;
  card.innerHTML=`
    <div class="story-feed-card__body" onclick="navigate('#/story?storyId=${s.id}')" style="cursor:pointer;">
      <div class="story-feed-card__byline">
        <div class="story-feed-card__avatar-wrap">
          ${isOwn?`<div class="story-feed-card__avatar-mine">${avatar(displayName,'xs')}</div>`
                 :`<div class="chat-avatar-story-ring story-ring--xs">${avatar(name,'xs')}</div>`}
        </div>
        <span class="story-feed-card__name">${displayName}</span>
        <span class="story-feed-card__dot">·</span>
        <span class="story-feed-card__time">${fdate(s.timestamp)}</span>
        ${deleteBtn}
      </div>
      <div class="story-feed-card__content-row">
        <div class="story-feed-card__text-col">
          <div class="story-feed-card__title">${title}</div>
        </div>
        ${hasImage?`<div class="story-feed-card__thumb-wrap"><img class="story-feed-card__thumb" src="${s.imageUrl}" alt="" loading="lazy"/></div>`:''}
      </div>
      <div class="story-feed-card__footer" onclick="event.stopPropagation()">
        <button class="story-like-btn${liked?' liked':''}" id="slike-${s.id}" onclick="likeStory('${s.id}')">
          <i data-lucide="heart" style="width:18px;height:18px;${liked?'fill:#E53935;color:#E53935;':''}"></i>
          <span id="slike-count-${s.id}">${likeCount>0?likeCount:''}</span>
        </button>
        <button class="story-replies-btn" onclick="navigate('#/story?storyId=${s.id}')">
          <i data-lucide="message-circle" style="width:18px;height:18px;"></i>
          <span>${replyCount>0?replyCount:'Reply'}</span>
        </button>
        ${canTTS()?`<button class="story-tts-btn" onclick="speakStoryCard(this,'${s.id}')" aria-label="Read aloud" style="margin-left:auto;">
          <i data-lucide="volume-2" style="width:18px;height:18px;"></i>
        </button>`:''}
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
    // Remove "be first to reply" if present
    const empty=repliesEl.querySelector('.story-comments__empty');
    if(empty) empty.remove();
    const myName=S.userName||'You';
    repliesEl.insertAdjacentHTML('beforeend',`
      <div class="story-comment" style="padding:12px 16px;">
        <div class="story-comment__avatar">${avatar(myName,'sm')}</div>
        <div class="story-comment__body">
          <div class="story-comment__name">${myName}</div>
          <div class="story-comment__text">${text}</div>
        </div>
      </div>`);
    const scroll=$('story-thread-scroll');
    if(scroll) scroll.scrollTop=scroll.scrollHeight;
    // Update divider count
    const div=document.querySelector('.story-thread-divider span');
    const s0=(S.stories||[]).find(x=>x.id===storyId);
    if(div&&s0) div.textContent=`${s0.replies.length} repl${s0.replies.length===1?'y':'ies'}`;
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
    const p=PERSONAS[story.authorId];
    repliesEl2.insertAdjacentHTML('beforeend',`
      <div class="story-comment" style="padding:12px 16px;">
        <div class="story-comment__avatar">${avatar(p?.name||story.authorName,'sm')}</div>
        <div class="story-comment__body">
          <div class="story-comment__name">${p?.name||story.authorName}</div>
          <div class="story-comment__text">${aiText}</div>
        </div>
      </div>`);
    const scroll=$('story-thread-scroll');
    if(scroll) scroll.scrollTop=scroll.scrollHeight;
    const div=document.querySelector('.story-thread-divider span');
    const s2=(S.stories||[]).find(x=>x.id===storyId);
    if(div&&s2) div.textContent=`${s2.replies.length} repl${s2.replies.length===1?'y':'ies'}`;
  }
}

function speakStoryCard(btn,storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);if(!s)return;
  speakMsg(btn,storyId,s.text);
}

function deleteMyStory(storyId){
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
function renderStoryView(storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);
  if(!s){navigate('#/stories');return;}
  const p=PERSONAS[s.authorId];
  const isOwn=s.authorId==='user';
  const name=s.authorName||(p?p.name:(isOwn?'You':'Unknown'));
  const liked=!!s.likedByUser;
  const likeCount=s.likes||0;

  mount(`
    ${resBar()}
    <div class="header header--white">
      <button class="header__back" onclick="navigate('#/stories')">${IC.back}</button>
      <div class="header__title"><h1 style="color:#111b21;font-size:17px;">Story</h1></div>
      <div class="header__actions">
        ${s.authorId!=='user'?`<button class="header__action-btn" style="color:#54656f;" onclick="navigate('#/chat?id=${s.authorId}')" title="Message ${name}"><i data-lucide="message-square" style="width:22px;height:22px;"></i></button>`:''}
        ${s.authorId==='user'?`<button class="header__action-btn" style="color:#E53935;" onclick="deleteMyStory('${s.id}')" aria-label="Delete"><i data-lucide="trash-2" style="width:22px;height:22px;"></i></button>`:''}
      </div>
    </div>
    <div class="screen story-thread-screen">
      <div class="screen__scroll" id="story-thread-scroll">
        <!-- Story body -->
        <div class="story-thread-post">
          <div class="story-thread-byline">
            <div class="story-thread-avatar">
              ${isOwn?`<div style="padding:3px;border-radius:50%;background:conic-gradient(#00A884 0deg 360deg);display:inline-flex;">${avatar('You','sm')}</div>`
                     :`<div class="chat-avatar-story-ring">${avatar(name,'sm')}</div>`}
            </div>
            <div>
              <div style="font-size:15px;font-weight:700;color:#111b21;">${isOwn?(S.userName||'You'):name}</div>
              <div style="font-size:12px;color:#8696a0;">${fdate(s.timestamp)}</div>
            </div>
          </div>
          ${s.title?`<div class="story-thread-title">${s.title}</div>`:''}
          ${s.imageUrl?`<div class="story-thread-img-wrap"><img src="${s.imageUrl}" class="story-thread-img" alt="" loading="lazy"/></div>`:''}
          <div class="story-thread-body">${s.text}</div>
          <div class="story-thread-actions">
            <button class="story-like-btn${liked?' liked':''}" id="slike-${s.id}" onclick="likeStoryThread('${s.id}')">
              <i data-lucide="heart" style="width:18px;height:18px;${liked?'fill:#E53935;color:#E53935;':''}"></i>
              <span id="slike-count-${s.id}">${likeCount>0?likeCount:''}</span>
            </button>
            ${canTTS()?`<button class="story-tts-btn" onclick="speakStoryCard(this,'${s.id}')" aria-label="Read aloud">
              <i data-lucide="volume-2" style="width:18px;height:18px;"></i>
            </button>`:''}
          </div>
        </div>
        <!-- Divider -->
        <div class="story-thread-divider">
          <span>${(s.replies||[]).length} repl${(s.replies||[]).length===1?'y':'ies'}</span>
        </div>
        <!-- Replies -->
        <div id="story-thread-replies">
          ${(s.replies||[]).length===0?`<div class="story-comments__empty" style="padding:24px 16px;">Be the first to reply!</div>`
            :(s.replies||[]).map(r=>`
            <div class="story-comment" style="padding:12px 16px;">
              <div class="story-comment__avatar">${avatar(r.from==='user'?'You':(PERSONAS[r.from]?.name||r.from),'sm')}</div>
              <div class="story-comment__body">
                <div class="story-comment__name">${r.from==='user'?'You':(PERSONAS[r.from]?.name||r.from)}</div>
                <div class="story-comment__text">${r.text}</div>
              </div>
            </div>`).join('')}
        </div>
        <div style="height:80px;"></div>
      </div>
      <!-- Fixed reply bar -->
      <div class="story-thread-reply-bar">
        <input class="story-thread-reply-input" id="thread-reply-input" placeholder="Write a reply…" onkeydown="if(event.key==='Enter')sendStoryReply('${s.id}','thread')" />
        <button class="story-thread-reply-send" onclick="sendStoryReply('${s.id}','thread')">
          ${IC.send}
        </button>
      </div>
    </div>
  `);
  lucide.createIcons();
  // Scroll replies to bottom
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

  const bk=sheet(`<div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Share a Story</div>
    <div class="compose-chips" id="sc-chips"></div>
    <textarea class="compose-textarea" id="sc-text" placeholder="What would you like to share? Speak or type..." rows="4" style="font-size:16px;line-height:1.6;"></textarea>
    <div style="display:flex;gap:10px;margin-top:8px;">
      <button class="compose-mic-btn" id="sc-mic" title="Speak your story">${IC.mic}</button>
      <button class="story-ai-btn" id="sc-ai" title="Polish with AI" style="display:none;">
        <i data-lucide="sparkles" style="width:18px;height:18px;"></i> Polish
      </button>
      <button class="compose-post-btn" id="sc-post" disabled style="flex:1;">Post Story</button>
    </div>
    <div id="sc-title-row" style="display:none;margin-top:10px;">
      <input id="sc-title" class="compose-title-input" placeholder="Story title (tap to edit)" style="width:100%;box-sizing:border-box;" />
    </div>
    <div style="font-size:12px;color:#8696a0;margin-top:8px;text-align:center;">Stories visible to community members · Expire after 7 days · ${3-myCount} slot${3-myCount===1?'':'s'} remaining</div>
  `);
  lucide.createIcons();

  const chips=['A recipe I love','A childhood memory','My opinion on...','Something I learned'];
  const chipsDiv=$('sc-chips');
  chips.forEach(c=>{const b=document.createElement('button');b.className='compose-chip';b.textContent=c;b.onclick=()=>{$('sc-text').value=c+': ';$('sc-text').focus();$('sc-post').disabled=false;$('sc-ai').style.display='flex';};chipsDiv.appendChild(b);});

  $('sc-text').oninput=()=>{
    const has=!!$('sc-text').value.trim();
    $('sc-post').disabled=!has;
    $('sc-ai').style.display=has?'flex':'none';
  };

  let scRec=false,scTxt='';
  $('sc-mic').onclick=()=>{
    if(!canSTT()){toast('Voice input not available on this browser');return;}
    if(scRec){stopRec();scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;return;}
    scRec=true;scTxt=$('sc-text').value;$('sc-mic').classList.add('recording');$('sc-mic').innerHTML=IC.micOff;
    startRec({
      onInterim:t=>{$('sc-text').value=scTxt+t;},
      onFinal:t=>{scTxt+=t+' ';$('sc-text').value=scTxt.trim();$('sc-post').disabled=false;$('sc-ai').style.display='flex';},
      onError:()=>{scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;},
      onEnd:()=>{scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;}
    });
  };

  $('sc-ai').onclick=async()=>{
    const raw=$('sc-text').value.trim();if(!raw)return;
    $('sc-ai').disabled=true;$('sc-ai').innerHTML='<i data-lucide="loader-2" style="width:18px;height:18px;"></i> Polishing...';
    lucide.createIcons();
    const [polished,titleResp]=await Promise.all([
      claude('meenakshiamma',[],`You are a gentle writing assistant for elderly users. Take this rough draft and make it warm, clear and readable — keeping the person's own voice and all the personal details. Keep it under 150 words. Raw text: "${raw}"`),
      claude('meenakshiamma',[],`Generate a short, compelling story title (max 8 words) for this text. Return ONLY the title, no quotes, no explanation. Text: "${raw.slice(0,200)}"`)
    ]);
    $('sc-text').value=polished;
    $('sc-title-row').style.display='block';
    $('sc-title').value=titleResp.trim().replace(/^["']|["']$/g,'');
    $('sc-ai').disabled=false;$('sc-ai').innerHTML='<i data-lucide="sparkles" style="width:18px;height:18px;"></i> Polish';
    lucide.createIcons();
  };

  $('sc-post').onclick=()=>{
    const t=$('sc-text').value.trim();if(!t)return;
    // Use typed title, or derive one from the text
    let title=$('sc-title')?.value?.trim()||'';
    if(!title){
      // Extract first sentence or first 60 chars, strip emoji
      const clean=t.replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27BF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]/gu,'').trim();
      const firstSentence=clean.split(/[.!?]/)[0].trim();
      title=(firstSentence.length>8?firstSentence:clean).slice(0,72);
    }
    const s=mkStory('user','You',t,title,'');
    set({stories:[s,...S.stories]});
    closeSheet(bk);toast('Story shared! ✨');renderStories();
    setTimeout(()=>triggerStoryReactions(s),6000+Math.random()*4000);
  };
}
async function triggerStoryReactions(story){
  const reactors=PERSONA_LIST.slice(0,2);
  for(const p of reactors){
    await delay(3000+Math.random()*3000);
    const t=await claude(p.id,[],`React briefly and warmly to this community story: "${story.text.slice(0,120)}"`);
    const m=mkMsg(p.id,'text',t);
    const upd=S.stories.map(s=>s.id===story.id?{...s,replies:[...(s.replies||[]),m]}:s);
    set({stories:upd});
  }
}
