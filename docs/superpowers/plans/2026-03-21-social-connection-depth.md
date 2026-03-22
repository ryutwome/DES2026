# Social Connection Depth — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 8 social features that make the app feel like real people who notice you, remember you, and reach out to you — targeting elderly Indian users aged 60–80.

**Architecture:** Vanilla JS PWA — no build step, no framework. All changes are direct edits to `app.js`, `js/screens-stories.js`, and `style.css`. State lives in `S` (in `app.js:272`), persisted via `set(patch)` → `saveS()` → localStorage.

**Tech Stack:** Plain HTML/CSS/JS, localStorage state, Claude AI via `claude(personaId, msgs, note)`.

---

## File Map

| File | Changes |
|---|---|
| `app.js` | `mkStory` add `reactions:{}`, `seedData` seed reactions, `toggleReaction`/`hasReacted` helpers, `buildStoryCard` reaction button, `triggerStoryReactions` delay fix, community `triggerCommunityReplies`, daily prompt state+logic, voice room entry greeting, voice room card transcript preview, `renderChats` game challenge trigger, `bubble()` game-invite type, `S` initialiser new keys |
| `js/screens-stories.js` | Suggestion chip text fix |

---

## Task 1: Add `reactions` field to story objects

**Files:**
- Modify: `app.js:295` (`mkStory`)
- Modify: `app.js:303–310` (`seedData`)

**Context:** `mkStory` builds story objects. Currently returns `{id,authorId,authorName,text,title,imageUrl,timestamp,replies}`. Reactions need to be a map of `personaId → true` (or `'user' → true`). `seedData` builds seeded stories manually at lines 303–310 and doesn't call `mkStory` — it needs reactions seeded separately.

`PERSONA_LIST` is an array of `{id, name, ...}` objects. Use `PERSONA_LIST.filter(p=>p.id!==story.authorId).slice(0,2)` to pick reactors.

- [ ] **Step 1: Add `reactions:{}` to `mkStory`**

Find at `app.js:295`:
```js
function mkStory(authorId,authorName,text,title,imageUrl) { const name=authorId==='user'?(S.userName||authorName||'You'):authorName; return {id:mkId(),authorId,authorName:name,text,title:title||'',imageUrl:imageUrl||'',timestamp:Date.now(),replies:[]}; }
```

Replace with:
```js
function mkStory(authorId,authorName,text,title,imageUrl) { const name=authorId==='user'?(S.userName||authorName||'You'):authorName; return {id:mkId(),authorId,authorName:name,text,title:title||'',imageUrl:imageUrl||'',timestamp:Date.now(),replies:[],reactions:{}}; }
```

- [ ] **Step 2: Seed 1–2 reactions per AI story in `seedData`**

In `seedData` at `app.js:303–310`, the stories are mapped from `SEED_STORIES` then sorted. Find the sort line:
```js
  S.stories.sort((a,b)=>b.timestamp-a.timestamp);
```

Add reaction seeding immediately after the sort, before the `const joined = new Set()` line:
```js
  S.stories.forEach(story => {
    if (story.authorId === 'user') return;
    const reactors = PERSONA_LIST.filter(p => p.id !== story.authorId).slice(0, 1 + Math.floor(Math.random() * 2));
    story.reactions = {};
    reactors.forEach(p => { story.reactions[p.id] = true; });
  });
```

- [ ] **Step 3: Add `toggleReaction` and `hasReacted` helpers**

Find `triggerStoryReactions` at `app.js:1390`. Insert the two helpers immediately before it:
```js
function hasReacted(storyId) {
  return !!(S.stories.find(s => s.id === storyId)?.reactions?.user);
}
function toggleReaction(storyId) {
  const updated = S.stories.map(s => {
    if (s.id !== storyId) return s;
    const reactions = { ...(s.reactions || {}) };
    if (reactions.user) delete reactions.user;
    else reactions.user = true;
    return { ...s, reactions };
  });
  set({ stories: updated });
}
```

- [ ] **Step 4: Commit**

Proposed message: `feat: add reactions field to story objects and seed AI reactions`

---

## Task 2: Reaction button in story card + reaction summary

**Files:**
- Modify: `app.js:1078–1131` (`buildStoryCard`)

**Context:** The story card footer at lines 1115–1127 has a like button and reply button. Add a 🙏 reaction button beside the reply button. Show reaction summary above the footer.

Reaction summary logic:
- 0 reactions → hidden
- 1 reaction → "[Name] reacted 🙏"
- 2+ reactions → "[Name] and N others reacted 🙏"
- First name shown: if user reacted, show "You"; else show the name of first AI reactor found in `Object.keys(reactions)`.

The button must call `toggleReaction(storyId)` and then re-render just this card in-place. Use `document.getElementById('scard-'+s.id)` to find the card and replace it.

- [ ] **Step 1: Add reaction summary helper function**

Insert before `buildStoryCard` at `app.js:1078`:
```js
function reactionSummary(reactions) {
  const keys = Object.keys(reactions || {});
  if (!keys.length) return '';
  const hasUser = !!reactions.user;
  const aiKeys = keys.filter(k => k !== 'user');
  let firstName = hasUser ? 'You' : (PERSONAS[aiKeys[0]]?.name || 'Someone');
  const total = keys.length;
  const text = total === 1
    ? `${firstName} reacted 🙏`
    : `${firstName} and ${total - 1} other${total - 1 > 1 ? 's' : ''} reacted 🙏`;
  return `<div class="story-reaction-summary">${text}</div>`;
}
```

- [ ] **Step 2: Add reaction button and summary to `buildStoryCard`**

In `buildStoryCard`, find the reaction count setup at the top (after `const liked`):
```js
  const liked=!!(s.likedByUser);
```

Add after it:
```js
  const reacted = hasReacted(s.id);
  const reactionCount = Object.keys(s.reactions || {}).length;
```

Then in the card HTML, find the footer `onclick` stop-propagation div:
```html
      <div class="story-feed-card__footer" onclick="event.stopPropagation()">
```

Replace the entire footer div (lines 1115–1127) with:
```html
      <div class="story-feed-card__footer" onclick="event.stopPropagation()">
        <button class="story-like-btn${liked?' liked':''}" id="slike-${s.id}" onclick="likeStory('${s.id}')">
          <i data-lucide="heart" style="width:18px;height:18px;${liked?'fill:#E53935;color:#E53935;':''}"></i>
          <span id="slike-count-${s.id}">${likeCount>0?likeCount:''}</span>
        </button>
        <button class="story-reaction-btn${reacted?' reacted':''}" id="sreact-${s.id}" onclick="toggleReaction('${s.id}');const c=document.getElementById('scard-${s.id}');if(c){const n=buildStoryCard(${JSON.stringify({}).replace(/"/g,'&quot;')},${isOwn});c.replaceWith(n);feather&&feather.replace&&feather.replace();lucide&&lucide.createIcons&&lucide.createIcons();}" style="min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:4px;background:none;border:none;cursor:pointer;font-size:15px;${reacted?'color:#e91e63;':''}" aria-label="React with folded hands">
          🙏<span style="font-size:13px;">${reactionCount > 0 ? reactionCount : ''}</span>
        </button>
        <button class="story-replies-btn" onclick="navigate('#/story?storyId=${s.id}')">
          <i data-lucide="message-circle" style="width:18px;height:18px;"></i>
          <span>${replyCount>0?replyCount:'Reply'}</span>
        </button>
        ${canTTS()?`<button class="story-tts-btn" onclick="speakStoryCard(this,'${s.id}')" aria-label="Read aloud" style="margin-left:auto;">
          <i data-lucide="volume-2" style="width:18px;height:18px;"></i>
        </button>`:''}
      </div>
```

Wait — the inline onclick with `buildStoryCard` is too complex for a template string (requires passing `s` and `isOwn`). Use a global refresh approach instead.

**Revised approach for reaction button onclick:** Call a new global `reactStory(storyId)` that handles toggle + re-render:

- [ ] **Step 2a: Add `reactStory` global helper**

Insert just after `toggleReaction`:
```js
function reactStory(storyId) {
  toggleReaction(storyId);
  const story = S.stories.find(s => s.id === storyId);
  if (!story) return;
  const card = document.getElementById('scard-' + storyId);
  if (!card) return;
  const isOwn = story.authorId === 'user';
  const newCard = buildStoryCard(story, isOwn);
  card.replaceWith(newCard);
  if (window.lucide) lucide.createIcons();
}
```

- [ ] **Step 2b: Add reaction variables and button to `buildStoryCard`**

Find in `buildStoryCard`:
```js
  const liked=!!(s.likedByUser);
```

Add after:
```js
  const reacted = hasReacted(s.id);
  const reactionCount = Object.keys(s.reactions || {}).length;
```

Find the footer block (entire `story-feed-card__footer` div from `onclick="event.stopPropagation()"` through the closing `</div>` at line 1127):
```html
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
```

Replace with:
```html
      ${reactionSummary(s.reactions)}
      <div class="story-feed-card__footer" onclick="event.stopPropagation()">
        <button class="story-like-btn${liked?' liked':''}" id="slike-${s.id}" onclick="likeStory('${s.id}')">
          <i data-lucide="heart" style="width:18px;height:18px;${liked?'fill:#E53935;color:#E53935;':''}"></i>
          <span id="slike-count-${s.id}">${likeCount>0?likeCount:''}</span>
        </button>
        <button class="story-reaction-btn${reacted?' reacted':''}" id="sreact-${s.id}" onclick="reactStory('${s.id}')" style="min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:4px;background:none;border:none;cursor:pointer;font-size:15px;${reacted?'color:#e91e63;font-weight:600;':''}" aria-label="React">
          🙏<span style="font-size:13px;">${reactionCount>0?reactionCount:''}</span>
        </button>
        <button class="story-replies-btn" onclick="navigate('#/story?storyId=${s.id}')">
          <i data-lucide="message-circle" style="width:18px;height:18px;"></i>
          <span>${replyCount>0?replyCount:'Reply'}</span>
        </button>
        ${canTTS()?`<button class="story-tts-btn" onclick="speakStoryCard(this,'${s.id}')" aria-label="Read aloud" style="margin-left:auto;">
          <i data-lucide="volume-2" style="width:18px;height:18px;"></i>
        </button>`:''}
      </div>
```

- [ ] **Step 3: Add CSS for reaction summary**

In `style.css`, find `.story-feed-card__footer` and add after it:
```css
.story-reaction-summary {
  font-size: 12px;
  color: #667781;
  padding: 2px 12px 0;
}
```

- [ ] **Step 4: Commit**

Proposed message: `feat: reaction button and summary on story cards`

---

## Task 3: Fix AI reaction timing

**Files:**
- Modify: `app.js:1387` (setTimeout in compose post handler)
- Modify: `app.js:1393` (delay inside `triggerStoryReactions` loop)

**Context:** `triggerStoryReactions` is called from the story post handler at line 1387 with a `5000+random()*5000` ms initial delay — this is inside `screens-stories.js`'s compose sheet. The live version of `triggerStoryReactions` is in `app.js:1390`. The first reactor fires after `delay(3000+Math.random()*3000)` — suspiciously fast.

Fix: first reaction 45–120s (random), second 3–8 minutes (random).

- [ ] **Step 1: Fix the initial setTimeout in compose post handler**

At `app.js:1387`:
```js
    setTimeout(()=>triggerStoryReactions(s),6000+Math.random()*4000);
```
Replace with:
```js
    setTimeout(()=>triggerStoryReactions(s),45000+Math.random()*75000);
```

- [ ] **Step 2: Fix delays inside `triggerStoryReactions`**

The function at `app.js:1390–1399` loops over 2 reactors with the same delay. Replace the entire function:

Find:
```js
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
```

Replace with:
```js
async function triggerStoryReactions(story){
  const reactors=PERSONA_LIST.slice(0,2);
  // First reaction: 0–75s (already waited 45–120s before this call)
  await delay(Math.random()*75000);
  const p0=reactors[0];
  const t0=await claude(p0.id,[],`React briefly and warmly to this community story: "${story.text.slice(0,120)}"`);
  const m0=mkMsg(p0.id,'text',t0);
  const upd0=S.stories.map(s=>s.id===story.id?{...s,replies:[...(s.replies||[]),m0]}:s);
  set({stories:upd0});
  // Second reaction: 3–8 minutes later
  await delay(180000+Math.random()*300000);
  const p1=reactors[1];
  const t1=await claude(p1.id,[],`React briefly and warmly to this community story: "${story.text.slice(0,120)}"`);
  const m1=mkMsg(p1.id,'text',t1);
  const upd1=S.stories.map(s=>s.id===story.id?{...s,replies:[...(s.replies||[]),m1]}:s);
  set({stories:upd1});
}
```

- [ ] **Step 3: Commit**

Proposed message: `fix: AI story reactions now arrive at human-feeling intervals (45s–8min)`

---

## Task 4: Fix suggestion chip text in compose sheet

**Files:**
- Modify: `js/screens-stories.js:242–253` (chip click handlers)

**Context:** The 4 chips in `showStoryComposeSheet` fill the textarea with `chip + ': '` — a robotic prefix. Replace with a real example sentence the user can edit.

- [ ] **Step 1: Replace chip fill text**

Find in `js/screens-stories.js` around line 247:
```js
    btn.addEventListener('click', () => {
      sheet.querySelector('#story-text').value = chip + ': ';
```

This is inside a `chips.forEach` loop. Replace the entire `chips` array definition and the `forEach` loop.

Find:
```js
  const chips = [
    'Share a recipe memory',
    'Your neighbourhood growing up',
    'A film that changed you',
    'A festival memory'
  ];
```

Replace with:
```js
  const chips = [
    { label: 'Share a recipe memory', fill: 'My mother used to make sambar every Sunday morning. The smell would wake the whole house...' },
    { label: 'Your neighbourhood growing up', fill: 'Our street in those days had a banyan tree at the corner where all the children would play after school...' },
    { label: 'A film that changed you', fill: 'The first time I saw Sholay I must have been twenty. We went as a family to the cinema...' },
    { label: 'A festival memory', fill: 'Every Diwali my father would light the whole terrace with diyas. We children were in charge of the rangoli...' },
  ];
```

Then find the chip render loop:
```js
  const chipsDiv = sheet.querySelector('#story-chips');
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.className = 'compose-chip';
    btn.textContent = chip;
    btn.addEventListener('click', () => {
      sheet.querySelector('#story-text').value = chip + ': ';
      sheet.querySelector('#story-text').focus();
      sheet.querySelector('#story-post').disabled = false;
    });
    chipsDiv.appendChild(btn);
  });
```

Replace with:
```js
  const chipsDiv = sheet.querySelector('#story-chips');
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.className = 'compose-chip';
    btn.textContent = chip.label;
    btn.addEventListener('click', () => {
      sheet.querySelector('#story-text').value = chip.fill;
      sheet.querySelector('#story-text').focus();
      sheet.querySelector('#story-post').disabled = false;
    });
    chipsDiv.appendChild(btn);
  });
```

- [ ] **Step 2: Commit**

Proposed message: `fix: suggestion chips fill real example sentences instead of robotic prefixes`

---

## Task 5: Community multi-persona threading

**Files:**
- Modify: `app.js:1558–1568` (inline reply logic in `renderCommunity`)

**Context:** Current reply block (lines 1558–1568): shows typing, waits 1.5s, picks one random persona, calls `claude()`, appends response. Replace with `triggerCommunityReplies(commId, text, msgs, firstPersonaReply)` that fires 2–3 sequential AI responses.

The `claude(responderId, msgs, note)` function takes persona id, message history array, and a context note string.

- [ ] **Step 1: Add `triggerCommunityReplies` function**

Find `renderCommunity` at `app.js:1534`. Insert the new function immediately before `renderCommunity`:

```js
async function triggerCommunityReplies(commId, userText, msgs, firstPersonaId, firstReplyText) {
  const comm = COMMUNITIES[commId];
  if (!comm) return;
  // Shuffle personas, take up to 3 unique ones
  const shuffled = [...comm.personas].sort(() => Math.random() - 0.5);
  const participants = shuffled.slice(0, Math.min(3, shuffled.length));

  // Second response (25–45s after first)
  await delay(25000 + Math.random() * 20000);
  if (!document.getElementById('comm-msgs')) return;
  const p1 = PERSONAS[participants[1] || participants[0]];
  const note1 = `You are in the "${comm.name}" community. A member posted: "${userText}". ${p1 ? PERSONAS[firstPersonaId]?.name : 'Someone'} just replied: "${firstReplyText}". Add your own warm, brief thought.`;
  const resp1 = await claude(participants[1] || participants[0], S.communities[commId] || [], note1);
  const aiMsg1 = mkMsg(participants[1] || participants[0], 'text', resp1);
  addMsg('communities', commId, aiMsg1);
  const el = document.getElementById('comm-msgs');
  if (el) { el.insertAdjacentHTML('beforeend', bubble(aiMsg1)); scrollBot(el); }

  // Third response (60% chance, 45–70s after second)
  if (Math.random() > 0.4 && participants[2]) {
    await delay(45000 + Math.random() * 25000);
    if (!document.getElementById('comm-msgs')) return;
    const note2 = `You are in the "${comm.name}" community. React briefly to this ongoing discussion about: "${userText}".`;
    const resp2 = await claude(participants[2], S.communities[commId] || [], note2);
    const aiMsg2 = mkMsg(participants[2], 'text', resp2);
    addMsg('communities', commId, aiMsg2);
    const el2 = document.getElementById('comm-msgs');
    if (el2) { el2.insertAdjacentHTML('beforeend', bubble(aiMsg2)); scrollBot(el2); }
  }
}
```

- [ ] **Step 2: Update the inline reply block to call `triggerCommunityReplies`**

Find the existing reply block in `renderCommunity` (lines 1558–1568):
```js
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
```

Replace with:
```js
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
    // Trigger additional delayed responses from other personas
    triggerCommunityReplies(commId, text, S.communities[commId]||[], responderId, resp);
```

- [ ] **Step 3: Commit**

Proposed message: `feat: community multi-persona threading — 2–3 AI replies in sequence`

---

## Task 6: Community daily prompt

**Files:**
- Modify: `app.js:272` (`S` initialiser)
- Modify: `app.js:1534` (`renderCommunity` — add daily prompt check at top)

**Context:** `S` at line 272 currently ends with `unreadChats:{}`. Add two new keys. Then at the top of `renderCommunity`, after fetching `comm`, check if today's prompt has been generated for this community. If not, call `claude()` to generate one and prepend it as an AI message.

Date comparison pattern used elsewhere in app: `new Date().toDateString()` (no `today()` helper).

- [ ] **Step 1: Add new state keys to `S` initialiser**

Find at `app.js:272`:
```js
let S = { apiKey:'HARDCODED', proxyUrl:DEFAULT_PROXY, onboardingDone:false, interests:[], userName:'', fontSize:'normal', lastMorningGreeting:'', joinedCommunities:[], chats:{}, communities:{}, games:{}, stories:[], voiceRooms:{}, researcherMode:false, installBannerDismissed:false, desktopBannerDismissed:false, unreadChats:{} }
```

Replace with (adding `lastDailyPrompt` and `dailyPrompts`):
```js
let S = { apiKey:'HARDCODED', proxyUrl:DEFAULT_PROXY, onboardingDone:false, interests:[], userName:'', fontSize:'normal', lastMorningGreeting:'', joinedCommunities:[], chats:{}, communities:{}, games:{}, stories:[], voiceRooms:{}, researcherMode:false, installBannerDismissed:false, desktopBannerDismissed:false, unreadChats:{}, lastDailyPrompt:{}, dailyPrompts:{} }
```

- [ ] **Step 2: Add daily prompt logic to `renderCommunity`**

In `renderCommunity`, after the `scrollBot(msgs)` call at line 1552 (after rendering existing messages) and before `renderInputBar`, add the async daily prompt trigger. Find:
```js
  scrollBot(msgs);
  renderInputBar('comm-wrap',{placeholder:'Message community',onSend:async({type,text})=>{
```

Replace with:
```js
  scrollBot(msgs);

  // Daily prompt: once per community per day
  if (S.apiKey && S.lastDailyPrompt[commId] !== new Date().toDateString()) {
    const firstPersona = PERSONAS[comm.personas[0]];
    if (firstPersona) {
      set({ lastDailyPrompt: { ...S.lastDailyPrompt, [commId]: new Date().toDateString() } });
      const promptNote = `You are ${firstPersona.name} in the "${comm.name}" community (topics: ${comm.tags.join(', ')}). Post one warm, open-ended question to spark conversation among Indian elders. One sentence only, conversational, culturally rooted.`;
      claude(comm.personas[0], [], promptNote).then(promptText => {
        const promptMsg = mkMsg(comm.personas[0], 'text', promptText);
        addMsg('communities', commId, promptMsg);
        const el = document.getElementById('comm-msgs');
        if (el) { el.insertAdjacentHTML('beforeend', bubble(promptMsg)); scrollBot(el); }
        set({ dailyPrompts: { ...S.dailyPrompts, [commId]: promptText } });
      });
    }
  }

  renderInputBar('comm-wrap',{placeholder:'Message community',onSend:async({type,text})=>{
```

- [ ] **Step 3: Commit**

Proposed message: `feat: community daily prompt — one AI-generated question per community per day`

---

## Task 7: Voice room entry greeting

**Files:**
- Modify: `app.js:1681` (after `scheduleNextLine();setQuietTimer();` in `renderVoiceRoom`)

**Context:** After `scheduleNextLine()` and `setQuietTimer()` are called at line 1681, the room is fully mounted and the transcript loop is running. Add a one-time greeting from the first persona 3–5s after entry. Use a module-scoped `_vrGreetingTriggered` flag to prevent re-triggering on re-renders.

The transcript line format is `{id,personaId,text,timestamp}`. `transcriptLine(line)` renders it. The spec says to add `isGreeting:true` for a teal highlight style.

- [ ] **Step 1: Add `_vrGreetingTriggered` flag**

Find near line 1612:
```js
let _vrInterval=null,_vrQuietTimer=null;
```

Replace with:
```js
let _vrInterval=null,_vrQuietTimer=null,_vrGreetingTriggered=false;
```

- [ ] **Step 2: Reset the flag when entering a new room**

In `renderVoiceRoom`, find the existing flag resets at line 1615:
```js
  if(_vrInterval)clearInterval(_vrInterval);
  if(_vrQuietTimer)clearTimeout(_vrQuietTimer);
```

Replace with:
```js
  if(_vrInterval)clearInterval(_vrInterval);
  if(_vrQuietTimer)clearTimeout(_vrQuietTimer);
  _vrGreetingTriggered=false;
```

- [ ] **Step 3: Add greeting timeout after `scheduleNextLine();setQuietTimer();`**

Find at `app.js:1681`:
```js
  scheduleNextLine();setQuietTimer();
```

Replace with:
```js
  scheduleNextLine();setQuietTimer();

  // Entry greeting: one persona acknowledges the user by name
  if (!_vrGreetingTriggered && S.apiKey && S.userName) {
    _vrGreetingTriggered = true;
    setTimeout(async () => {
      if (!document.getElementById('vr-transcript')) return;
      const greeterId = room.personas[0];
      const recentLines = S.voiceRooms[roomId].transcript.slice(-2).map(l => `${PERSONAS[l.personaId]?.name||'?'}: ${l.text}`).join(' | ');
      const greetNote = `The user ${S.userName} has just joined the voice room. Greet them warmly and briefly by name, reference the topic being discussed (recent lines: ${recentLines}). One sentence only.`;
      const greetText = await claude(greeterId, [], greetNote);
      if (!document.getElementById('vr-transcript')) return;
      const line = { id: mkId(), personaId: greeterId, text: greetText, timestamp: Date.now(), isGreeting: true };
      S.voiceRooms[roomId].transcript.push(line); saveS();
      $('vr-transcript').insertAdjacentHTML('beforeend', transcriptLine(line, true));
      scrollBot($('vr-transcript'));
    }, 3000 + Math.random() * 2000);
  }
```

- [ ] **Step 4: Update `transcriptLine` to accept `isGreeting` param**

Find `transcriptLine` function (search for `function transcriptLine`). Add an optional second param and apply a teal highlight style when `isGreeting` is true:

Find the function definition (likely something like):
```js
function transcriptLine(line){
```

Replace the opening with:
```js
function transcriptLine(line, isGreeting=false){
```

And in the returned HTML, add a conditional style/class to the outermost element. If it currently returns a div with class `transcript-line`, change it to add `transcript-line--greeting` when `isGreeting`:

Look for the return statement and add `${isGreeting ? ' transcript-line--greeting' : ''}` to the class.

Then in `style.css`, add:
```css
.transcript-line--greeting { background: rgba(0,168,132,0.08); border-left: 3px solid #00a884; padding-left: 8px; }
```

- [ ] **Step 5: Commit**

Proposed message: `feat: voice room entry greeting — persona welcomes user by name on join`

---

## Task 8: Voice room card transcript preview

**Files:**
- Modify: `app.js:1591–1603` (room card HTML in `renderVoiceRooms`)

**Context:** Each room card is built inside `Object.values(VOICE_ROOMS).forEach(room => {...})` at lines 1587–1605. The card HTML is at lines 1591–1603. The theme tag is at line 1599. Add a last-transcript-line preview below the theme tag.

`AppState` is not defined in this codebase — use `S.voiceRooms[room.id]`. Transcript is an array of `{personaId, text, ...}`. Take the last entry.

- [ ] **Step 1: Update room card HTML to include transcript preview**

Find in `renderVoiceRooms` the room card content div (lines 1594–1601):
```js
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div class="voice-room-card__name">${room.name}</div>
            <div class="voice-room-card__live"><div class="live-dot"></div>LIVE</div>
          </div>
          <div class="voice-room-card__theme">${room.themeTag}</div>
          <div class="voice-room-card__participants" style="margin-top:4px;">${parts}</div>
        </div>
```

Before the `forEach` loop, add a helper to extract the preview text:

Actually, just compute it inline per room. Replace the above block with:
```js
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div class="voice-room-card__name">${room.name}</div>
            <div class="voice-room-card__live"><div class="live-dot"></div>LIVE</div>
          </div>
          <div class="voice-room-card__theme">${room.themeTag}</div>
          ${(()=>{const tr=S.voiceRooms[room.id]?.transcript;if(tr&&tr.length){const last=tr[tr.length-1];const pname=PERSONAS[last.personaId]?.name?.split(' ')[0]||'?';const preview=last.text.slice(0,60)+(last.text.length>60?'…':'');return`<div style="font-size:12px;color:#8696a0;font-style:italic;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">"${pname}: ${preview}"</div>`;}return`<div style="font-size:12px;color:#8696a0;font-style:italic;margin-top:2px;">${room.themeTag}</div>`;})()}
          <div class="voice-room-card__participants" style="margin-top:4px;">${parts}</div>
        </div>
```

- [ ] **Step 2: Commit**

Proposed message: `feat: voice room cards show last transcript line as preview`

---

## Task 9: Daily game challenge

**Files:**
- Modify: `app.js:272` (`S` initialiser — add `lastGameChallenge`)
- Modify: `app.js:618` (`bubble()` — add `game-invite` type)
- Modify: `app.js:875` (after `renderChats` chat list render — add challenge trigger)

**Context:**
- `S.lastGameChallenge` should be a string (date string) — compare with `new Date().toDateString()`
- `mkMsg` creates messages: `mkMsg(from, type, text)` returns `{id,from,type,text,timestamp,isAI}`
- Additional fields (`gameType`, `gamePersonaId`) must be spread onto the msg after creation
- Game object structure from existing code: `{id, type, opponentId, status:'active', currentLetter:'', score:{user:0,ai:0}, questionNumber:1, lastQuestion:'', messages:[], createdAt:Date.now(), completedAt:null}`
- Navigation: `navigate('#/game/'+gameId+'/'+gameType)`
- `PERSONA_LIST` is array of `{id,name,...}` — pick persona user has chatted with
- `bubble()` at line 618 handles `voice` type and default text; add `game-invite` type handler

- [ ] **Step 1: Add `lastGameChallenge` to `S` initialiser**

Find at `app.js:272` (already modified in Task 6 to include `lastDailyPrompt` and `dailyPrompts`):
```js
let S = { ..., unreadChats:{}, lastDailyPrompt:{}, dailyPrompts:{} }
```

Add `lastGameChallenge:''` at the end:
```js
let S = { ..., unreadChats:{}, lastDailyPrompt:{}, dailyPrompts:{}, lastGameChallenge:'' }
```

- [ ] **Step 2: Add `game-invite` type to `bubble()`**

Find in `bubble()` at `app.js:623`:
```js
  if(msg.type==='voice'){
    ...
  } else {
    content=`${aiBadge}<div>${msg.text}</div>`;
  }
```

Replace with:
```js
  if(msg.type==='voice'){
    const bars=Array.from({length:18},(_,i)=>{const h=4+Math.round(Math.sin(i*.8)*8+10);return`<div class="voice-bubble__bar" style="height:${h}px"></div>`;}).join('');
    content=`<div class="voice-bubble">
      <div class="voice-bubble__controls">
        <button class="voice-bubble__play" onclick="togglePlay(this,'${msg.id}')" aria-label="Play">${IC.play}</button>
        <div class="voice-bubble__waveform">${bars}</div>
      </div>
      ${msg.text?`<div class="voice-bubble__text">${msg.text}</div>`:''}
    </div>`;
  } else if(msg.type==='game-invite'){
    const gameNames={'antakshari':'Antakshari','trivia-bollywood':'Bollywood Trivia'};
    const gameName=gameNames[msg.gameType]||'a game';
    content=`${aiBadge}<div>${msg.text}</div>
    <button onclick="(function(){const gid='game_'+Date.now()+'_'+Math.random().toString(36).slice(2,4);const gs={id:gid,type:'${msg.gameType}',opponentId:'${msg.gamePersonaId}',status:'active',currentLetter:'',score:{user:0,ai:0},questionNumber:1,lastQuestion:'',messages:[],createdAt:Date.now(),completedAt:null};const games={...S.games};games[gid]=gs;set({games});navigate('#/game/'+gid+'/${msg.gameType}');})()" style="margin-top:8px;display:inline-block;background:#00a884;color:#fff;border:none;border-radius:20px;padding:8px 18px;font-size:14px;font-weight:600;cursor:pointer;min-height:44px;">Play ${gameName} →</button>`;
  } else {
    content=`${aiBadge}<div>${msg.text}</div>`;
  }
```

- [ ] **Step 3: Add game challenge trigger after `renderChats` renders the list**

Find at `app.js:875`:
```js
}

function filterChips(btn,type){
```

The closing `}` at line 875 ends `renderChats`. Insert the game challenge trigger just before the closing brace (after the `items.forEach` block). Find the last line of `renderChats`:
```js
  if(!items.length){list.innerHTML=`<div class="empty-state">...</div>`;return;}
  items.forEach(({id,last,time})=>{
    ...
    list.appendChild(div);
  });
}
```

Replace the closing `}` of `renderChats` with:
```js
  // Daily game challenge: one persona invites user to a game once per day
  if (S.apiKey && S.lastGameChallenge !== new Date().toDateString()) {
    const chatPersonaIds = Object.keys(S.chats).filter(id => PERSONAS[id]);
    const challengerId = chatPersonaIds.length > 0
      ? chatPersonaIds[Math.floor(Math.random() * chatPersonaIds.length)]
      : 'rameshbhai';
    const gameTypes = ['antakshari', 'trivia-bollywood'];
    const gameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
    const gameNames = { 'antakshari': 'Antakshari', 'trivia-bollywood': 'Bollywood Trivia' };
    set({ lastGameChallenge: new Date().toDateString() });
    claude(challengerId, S.chats[challengerId] || [], `You are ${PERSONAS[challengerId]?.name}. Invite your friend ${S.userName||'friend'} to play ${gameNames[gameType]} with you. One casual, warm sentence. End with a question.`)
      .then(text => {
        const msg = mkMsg(challengerId, 'game-invite', text);
        msg.gameType = gameType;
        msg.gamePersonaId = challengerId;
        addMsg('chats', challengerId, msg);
        const u = { ...S.unreadChats, [challengerId]: (S.unreadChats[challengerId] || 0) + 1 };
        set({ unreadChats: u });
      });
  }
}
```

- [ ] **Step 4: Commit**

Proposed message: `feat: daily game challenge — persona invites user to Antakshari or Bollywood Trivia`

---

## Final Verification

- [ ] Open `index.html` in browser
- [ ] Stories feed: seeded AI stories show 🙏 count on cards
- [ ] Tap 🙏 on a story — button highlights, count increments, reaction summary appears
- [ ] Post a story — 🙏 reaction arrives after ~45s, not instantly
- [ ] Tap a suggestion chip in compose sheet — full sentence appears (not "chip label: ")
- [ ] Post in a community — first AI reply arrives, then 2nd after 25–45s, optional 3rd
- [ ] Open a community for the first time today — daily prompt question appears at bottom
- [ ] Enter a voice room — after 3–5s, a persona greets you by name
- [ ] Voice Rooms list — each card shows last transcript line in grey italic
- [ ] Navigate to Chats tab — a game challenge arrives in one chat (after ~1s API call)
- [ ] Game invite message shows a "Play [Game Name] →" teal button
- [ ] Tap Play button — navigates directly to game screen
- [ ] Console: no JS errors

- [ ] **Final commit**

Proposed message: `feat: social connection depth — reactions, threading, greetings, game challenges`
