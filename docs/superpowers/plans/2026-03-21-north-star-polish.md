# North Star Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix story title bug, remove dead code, make all screen headers consistently white (WhatsApp 2024 style), and add category image picker to story compose.

**Architecture:** Vanilla JS PWA — no build step, no framework. All changes are direct edits to `app.js`, `js/screens-stories.js`, and `style.css`. No new files needed.

**Tech Stack:** Plain HTML/CSS/JS, localStorage state via `AppState`, `setState()` for persistence.

---

## Already Implemented (not in this plan)

- **Spec A1 — Unread badge:** Already working. `app.js` line 993–994 increments `unreadChats[personaId]` whenever an AI response arrives and the user isn't on that chat screen (`!document.getElementById('msgs')`). No fix needed.
- **Spec B2 — Chat list title left-align:** Already correct. `.header__title h1` has no `text-align` set, so it defaults to left-aligned. The "WhatsApp" title on the chats screen is already left-aligned.

---

## File Map

| File | Changes |
|---|---|
| `js/screens-stories.js` | Fix story title on post (line 293) + add image picker UI/logic |
| `app.js` | Remove dead comment functions (lines 1133–1170) + `header()` white option (line 579) + apply white headers to Communities/VoiceRooms list screens (lines 1521, 1613) + apply white to Community/VoiceRoom detail via `header()` calls (lines 1577, 1659) |
| `style.css` | Remove `.voice-room-screen .header { background: #1f2c34; }` override (line 1132) |

---

## Task 1: Fix story title on direct post

**Files:**
- Modify: `js/screens-stories.js:289-302`

**Context:** `makeStory(authorId, authorName, text)` in `js/state.js` returns `{ id, authorId, authorName, text, timestamp, replies }` — no `title` or `imageUrl` fields. The post handler at line 293 calls it directly, so user-posted stories have no title. The story thread screen shows the title conditionally at line 1292 of `app.js` (`${s.title ? ...}`) — so no title means no heading in the thread.

- [ ] **Step 1: Open `js/screens-stories.js` and find the post handler**

Look for `postBtn.addEventListener('click', ...)` around line 289.

- [ ] **Step 2: Replace the story creation line**

Find this block:
```js
postBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;

    const story = makeStory('user', 'You', text);
```

Replace the story creation line only (keep the rest unchanged):
```js
postBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;

    const words = text.split(' ');
    const autoTitle = words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : '');
    const story = { ...makeStory('user', 'You', text), title: autoTitle, imageUrl: selectedImageUrl || '' };
```

Note: `selectedImageUrl` will be declared in Task 5. For now, use `''` as a placeholder if Task 5 isn't done yet:
```js
const story = { ...makeStory('user', 'You', text), title: autoTitle, imageUrl: '' };
```

- [ ] **Step 3: Verify manually**

Open `index.html` in browser. Go to Stories tab. Tap the compose FAB. Type a short sentence without tapping Polish. Post it. Open the story by tapping it. Confirm the first ~8 words appear as a title heading above the body text.

- [ ] **Step 4: Commit**
```bash
git add js/screens-stories.js
git commit -m "fix: auto-generate story title from first 8 words on post"
```

---

## Task 2: Remove dead story comment functions

**Files:**
- Modify: `app.js:1133–1170`

**Context:** `toggleStoryComments` and `renderStoryComments` are vestigial from an old inline comments system. No UI calls either of them — they reference each other internally but are otherwise unreachable. The function `sendStoryReply` (line 1172) looks related but is **not** dead — it is actively called from the live story thread screen (lines 1325–1326) and must be kept.

- [ ] **Step 1: Find and confirm the functions**

Locate in `app.js`:
```js
function toggleStoryComments(storyId){
```
and
```js
function renderStoryComments(storyId){
```
Confirm nothing outside these two functions calls `toggleStoryComments` or `renderStoryComments`. Confirm `sendStoryReply` (line 1172) appears at lines 1325–1326 in the story thread — **do not delete it**.

- [ ] **Step 2: Delete both functions — exact range lines 1133–1170**

Delete from the opening `function toggleStoryComments(storyId){` (line 1133) through the closing `}` of `renderStoryComments` (line 1170). Stop before `async function sendStoryReply`.

- [ ] **Step 3: Verify no runtime errors**

Open `index.html` in browser. Navigate to Stories, open a story thread. No console errors should appear.

- [ ] **Step 4: Commit**
```bash
git add app.js
git commit -m "chore: remove dead toggleStoryComments and renderStoryComments functions"
```

---

## Task 3: White headers on Communities and Voice Rooms list screens

**Files:**
- Modify: `app.js:1521–1526` (Communities list header)
- Modify: `app.js:1613–1618` (Voice Rooms list header)

**Context:** Real WhatsApp uses white headers on all screens except the main Chats list. Communities and Voice Rooms list screens currently render `<div class="header">` which has `background: #00A884` (green). The `.header--white` CSS class at line 684 of `style.css` already switches to white with dark text.

- [ ] **Step 1: Fix Communities list header**

In `renderCommunities()` around line 1521, find:
```js
    <div class="header">
      <div class="header__title" onclick="headerTap()"><h1>Communities</h1></div>
```

Replace with:
```js
    <div class="header header--white">
      <div class="header__title" onclick="headerTap()"><h1 style="color:#111b21;">Communities</h1></div>
```

- [ ] **Step 2: Fix Voice Rooms list header**

In `renderVoiceRooms()` around line 1613, find:
```js
    <div class="header">
      <div class="header__title" onclick="headerTap()"><h1>Calls</h1></div>
```

Replace with:
```js
    <div class="header header--white">
      <div class="header__title" onclick="headerTap()"><h1 style="color:#111b21;">Voice Rooms</h1></div>
```

(Also update the title text from "Calls" to "Voice Rooms" — this screen shows voice rooms, not calls.)

- [ ] **Step 3: Verify**

Open browser. Navigate to Communities tab — header should be white with dark text. Navigate to Voice tab — same.

- [ ] **Step 4: Commit**
```bash
git add app.js
git commit -m "fix: white headers on Communities and Voice Rooms list screens"
```

---

## Task 4: White headers on Community detail and Voice Room detail screens

**Files:**
- Modify: `app.js:579` — `header()` function
- Modify: `app.js:1577` — `renderCommunity()` header call
- Modify: `app.js:1659` — `renderVoiceRoom()` header call
- Modify: `style.css:1132` — remove dark background override

**Context:** The `header()` helper function always emits `<div class="header">` (green). Detail screens for Community and Voice Room use this function. Adding a `white` parameter lets callers opt into the white style without repeating the CSS class inline.

- [ ] **Step 1: Add `white` option to `header()` function**

Find the `header()` function at line 579:
```js
function header(title,{back=false,avatarName=null,right=[],subtitle=null}={}){
  let h=`<div class="header">`;
```

Change to:
```js
function header(title,{back=false,avatarName=null,right=[],subtitle=null,white=false}={}){
  let h=`<div class="${white?'header header--white':'header'}">`;
```

- [ ] **Step 2: Apply white to Community detail header**

Find the `header()` call in `renderCommunity()` around line 1577:
```js
    ${header(comm.name,{back:true,subtitle:`${comm.members} members`,right})}
```
Replace with:
```js
    ${header(comm.name,{back:true,subtitle:`${comm.members} members`,right,white:true})}
```

- [ ] **Step 3: Apply white to Voice Room detail header**

Find the `header()` call in `renderVoiceRoom()` around line 1659:
```js
      ${header(room.name,{back:true,subtitle:room.themeTag})}
```
Replace with:
```js
      ${header(room.name,{back:true,subtitle:room.themeTag,white:true})}
```

- [ ] **Step 4: Remove the dark background override in CSS**

In `style.css` around line 1132, find and delete:
```css
.voice-room-screen .header { background: #1f2c34; }
```

(The `.header--white { background: #fff !important; }` rule would have overridden it anyway, but removing it is cleaner.)

- [ ] **Step 5: Verify**

Open browser. Tap a community — detail header should be white with dark back arrow and dark title. Tap a voice room — same. Navigate back — list headers still white.

- [ ] **Step 6: Commit**
```bash
git add app.js style.css
git commit -m "fix: white headers on Community and Voice Room detail screens"
```

---

## Task 5: Story compose — category image picker

**Files:**
- Modify: `js/screens-stories.js` — `showStoryComposeSheet()` function

**Context:** User-posted stories currently have `imageUrl: ''`, so they display with no image in the card feed (sparse/bare). Adding a one-tap category picker lets users optionally attach a contextually relevant image. The 6 categories map to curated Unsplash URLs — no API cost.

**Category URLs:**
```
Food    → https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop
Nature  → https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=400&fit=crop
Faith   → https://images.unsplash.com/photo-1507692049790-de6a72a1a862?w=800&h=400&fit=crop
Cricket → https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop
Music   → https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop
Memory  → https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop
```

- [ ] **Step 1: Add `selectedImageUrl` variable and category map**

At the top of `showStoryComposeSheet()`, after `const backdrop = ...`, add:
```js
let selectedImageUrl = '';
const STORY_IMAGES = {
  '🍲 Food':    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop',
  '🌿 Nature':  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=400&fit=crop',
  '🙏 Faith':   'https://images.unsplash.com/photo-1507692049790-de6a72a1a862?w=800&h=400&fit=crop',
  '🏏 Cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop',
  '🎵 Music':   'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
  '📸 Memory':  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop',
};
```

- [ ] **Step 2: Update sheet HTML to add image picker section**

In `sheet.innerHTML = ...`, add the image picker between the textarea and the actions div. Find:
```html
    <textarea class="compose-textarea" id="story-text" placeholder="What would you like to share?" rows="4"></textarea>
    <div class="compose-actions">
```

Replace with:
```html
    <textarea class="compose-textarea" id="story-text" placeholder="What would you like to share?" rows="4"></textarea>
    <div class="compose-image-label" style="font-size:13px;color:#667781;margin:8px 0 6px;font-weight:500;">Add a photo (optional)</div>
    <div class="compose-image-chips" id="image-chips" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;"></div>
    <div id="image-preview" style="display:none;margin-bottom:10px;border-radius:8px;overflow:hidden;height:100px;">
      <img id="image-preview-img" src="" style="width:100%;height:100%;object-fit:cover;" alt="Preview"/>
    </div>
    <div class="compose-actions">
```

- [ ] **Step 3: Wire up the image chip buttons**

After the `chips.forEach(...)` block (the text prompt chips), add:
```js
const imageChipsDiv = sheet.querySelector('#image-chips');
Object.entries(STORY_IMAGES).forEach(([label, url]) => {
  const btn = document.createElement('button');
  btn.className = 'compose-chip';
  btn.style.cssText = 'font-size:13px;padding:6px 12px;';
  btn.textContent = label;
  btn.addEventListener('click', () => {
    // toggle selection
    if (selectedImageUrl === url) {
      selectedImageUrl = '';
      btn.classList.remove('active');
      const preview = sheet.querySelector('#image-preview');
      preview.style.display = 'none';
    } else {
      selectedImageUrl = url;
      imageChipsDiv.querySelectorAll('.compose-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preview = sheet.querySelector('#image-preview');
      const previewImg = sheet.querySelector('#image-preview-img');
      previewImg.src = url;
      preview.style.display = 'block';
    }
  });
  imageChipsDiv.appendChild(btn);
});
```

- [ ] **Step 4: Use `selectedImageUrl` in the post handler**

In the post handler, find the story creation from Task 1:
```js
const story = { ...makeStory('user', 'You', text), title: autoTitle, imageUrl: '' };
```

Replace with:
```js
const story = { ...makeStory('user', 'You', text), title: autoTitle, imageUrl: selectedImageUrl };
```

- [ ] **Step 5: Verify**

Open browser. Go to Stories tab. Tap compose FAB. Confirm 6 image category chips appear below the text area. Tap one — a small image preview appears and the chip highlights. Tap the same chip again — preview hides and selection clears. Post a story with an image selected. Confirm the story card in the feed shows the image. Open the story thread — image visible above the text.

- [ ] **Step 6: Commit**
```bash
git add js/screens-stories.js
git commit -m "feat: category image picker in story compose sheet"
```

---

## Final Verification

- [ ] Open `index.html` in browser
- [ ] Navigate through all 5 tabs — all headers white except Chats (which shows teal "WhatsApp" text)
- [ ] Post a story without Polish — thread shows auto-generated title
- [ ] Post a story with an image category selected — card and thread both show the image
- [ ] Open a Community detail — white header with back button
- [ ] Open a Voice Room — white header with back button
- [ ] Check browser console — no JS errors

- [ ] **Final commit (if any cleanup)**
```bash
git add -A
git commit -m "fix: north star polish — white headers, story title, image picker"
```
