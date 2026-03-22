# DES2026 — North Star Polish
**Date:** 2026-03-21
**Goals:** North Star 2 (WhatsApp UI fidelity) + North Star 4 (Consistent experience)

---

## Scope

Two independent work streams tackled in one pass. No new features — only fixing broken things and closing visual gaps between the prototype and real WhatsApp.

---

## Stream A — Broken Things (Goal 4)

### A1. Unread badge never increments
`AppState.unreadChats` is only cleared (on chat open), never set. The Chats tab badge always shows 0.

**Fix:** In the AI message handler inside `renderChat` (app.js), when an incoming persona message is appended and `window.location.hash !== '#/chat?id=' + personaId`, increment `AppState.unreadChats[personaId] = (AppState.unreadChats[personaId] || 0) + 1`. Persist via `setState`. The existing clear-on-open logic is correct and stays.

### A2. Story title blank on direct post
`makeStory` in `js/state.js` returns `{ id, authorId, authorName, text, timestamp, replies }` — no `title` or `imageUrl` fields. `app.js` has a separate `mkStory` (line 295) that does have both fields, but the compose sheet in `screens-stories.js` (line 293) calls `makeStory` from state.js, not `mkStory`.

Result: user-posted stories have `undefined` for both `title` and `imageUrl`. The story card falls back to `s.text.slice(0,60)` for display, but the story thread shows no title at all (line 1292: `${s.title ? ...}` is falsy).

**Fix:** In the compose post handler (`screens-stories.js` line 293), generate a title from the first 8 words, and add `imageUrl` defaulting to empty. Replace:
```js
const story = makeStory('user', 'You', text);
```
With:
```js
const words = text.split(' ');
const autoTitle = words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : '');
const story = { ...makeStory('user', 'You', text), title: autoTitle, imageUrl: '' };
```

### A3. Dead code — toggleStoryComments / renderStoryComments
These two functions are vestigial from an old inline comments design. No UI triggers them. Safe to delete.

**Fix:** Remove both `toggleStoryComments` and `renderStoryComments` from `app.js`.

---

## Stream B — WhatsApp UI Fidelity (Goal 2)

### B1. Header colour inconsistency
Real WhatsApp (2024+): white headers everywhere except the main Chats list (which shows `#00A884`-coloured "WhatsApp" text on white). Current prototype: Communities and Voice Rooms screens still render green (`#075E54`) headers with white text.

**Fix:** Switch Communities list, Community detail, Voice Rooms list, Voice Room detail headers to white (`#FFFFFF`) with dark text/icons (`#111B21`). The CSS pattern `.header--white` is already used on Stories screens — extend it to these screens. Override any screen-specific `background` declarations (e.g. `.voice-room-screen .header { background: #1f2c34 }` needs to be removed or adjusted).

### B2. Chat list header — left-align title
Real WhatsApp chat list header: "WhatsApp" title is left-aligned (not centred), with camera + search + three-dot icons on the right.

**Fix:** In the Chats screen header HTML (app.js around line 828), the title div `<h1 style="color:#00A884;">WhatsApp</h1>` needs `flex: 1` on its container and `text-align: left`. Check `.header__title` CSS — if it's `text-align: center`, add a modifier class `.header__title--left` or apply inline style only for the Chats screen.

### B3. Story compose — category image picker
User-posted stories have `imageUrl: ''` so cards look sparse. Add 6 category buttons in the compose sheet. Tapping one sets a preview image.

**Location:** Inside `showStoryComposeSheet()` in `screens-stories.js`, after the `<textarea>` and before the `<div class="compose-actions">`.

**Categories and full Unsplash URLs:**
```
Food     → https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop
Nature   → https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=400&fit=crop
Faith    → https://images.unsplash.com/photo-1507692049790-de6a72a1a862?w=800&h=400&fit=crop
Cricket  → https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop
Music    → https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop
Memory   → https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop
```

**Implementation:**
1. Add a `let selectedImageUrl = ''` variable in the sheet closure.
2. Render 6 small chips with category label. On click: set `selectedImageUrl`, highlight active chip, show a small preview `<img>` in the sheet.
3. In the post handler, use `selectedImageUrl` in the story object: `imageUrl: selectedImageUrl`.
4. CSS: chips in a 2×3 grid, each ~44px tall, with `.active` highlighted in teal.

---

## Implementation Order

1. A1 — Fix unread badge (10 min)
2. A2 — Fix story title on post (10 min)
3. A3 — Remove dead comment functions (5 min)
4. B1 — Fix header colours on Communities + Voice Rooms (20 min)
5. B2 — Left-align chat list title (5 min)
6. B3 — Story compose image picker (25 min)

---

## Out of Scope

- Loading/skeleton states (significant effort, future session)
- Story scroll position fix (low impact)
- Back-stack scroll restoration (navigation concern, future session)
- gameTypes id — already correct in codebase
- filterChats/filterChips naming — already consistent in codebase
