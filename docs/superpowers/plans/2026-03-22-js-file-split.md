# JS File Split — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `app.js` (2031 lines) into 15 focused files. No logic changes — pure extraction. GitHub Pages deployable with multiple `<script>` tags.

**Architecture:** All functions stay global. Load order: data → state → api → voice → icons → router → ui → screens-* → init. Each file is created from exact line ranges in `app.js`, then `index.html` is updated once at the end.

**Tech Stack:** Plain HTML/JS, no build step, no modules.

---

## Strategy

Create all 15 new files first (without touching `index.html`). Then flip `index.html` in one edit. Test. Delete `app.js`. This way the app is never broken mid-way — it runs on old `app.js` until the single flip.

**Special cases handled in the tasks below:**
- `delay()` lives at `app.js:999` (inside the chat section) but belongs in `api.js`. Copy it there; omit from `screens-chats.js`.
- `sheet()`/`closeSheet()` at lines 1471–1478 (labelled `SHEET HELPERS`) belong in `ui.js`. They're used across screens-settings, screens-stories, and screens-communities.
- `MORNING_GREETINGS` const at line 1942 belongs in `data.js` (static data, not init logic).
- `STT_LANGUAGE` const at line 3 belongs at the top of `voice.js`.

---

## Section map (exact cut points from `app.js` section comments)

| app.js lines | Section comment | Destination |
|---|---|---|
| 3 | `const STT_LANGUAGE` | `voice.js` (top) |
| 5–269 | `PERSONAS` through `GAME_DATA` | `data.js` |
| 270–355 | `APP STATE` + `SEED DATA` | `state.js` |
| 356–369 | `AVATAR` | `ui.js` |
| 370–400 | `ICONS` (IC object) | `icons.js` |
| 401–437 | `VOICE` functions | `voice.js` (body) |
| 438–477 | `API` | `api.js` |
| 478–531 | `ROUTER` | `router.js` |
| 532–734 | `SHARED UI` through `renderInputBar` | `ui.js` (continued) |
| 1471–1478 | `SHEET HELPERS` | `ui.js` (append) |
| 735–821 | `SETUP SCREEN` + `ONBOARDING` + `NAME PROMPT` | `screens-setup.js` |
| 822–1000 | `CHATS LIST` + `STATUS VIEWER` + `CHAT SCREEN` (excl. `delay` at 999) | `screens-chats.js` |
| 999 | `delay()` (copy to api.js, omit from screens-chats.js) | `api.js` |
| 1001–1400 | `STORIES` | `screens-stories.js` |
| 1401–1470 | `SETTINGS` | `screens-settings.js` |
| 1479–1570 | `COMMUNITIES` + `COMMUNITY FEED` | `screens-communities.js` |
| 1571–1758 | `VOICE ROOMS LIST` + `VOICE ROOM` | `screens-voicerooms.js` |
| 1759–1920 | `GAMES HUB` + `GAME SCREEN` | `screens-games.js` |
| 1921–1941 | `ICON GENERATION` (`generateIcons`) | `init.js` |
| 1942–2031 | `MORNING CHECK-IN` const + `checkMorningGreeting` + `INIT` | split: `MORNING_GREETINGS` const → `data.js`, rest → `init.js` |

---

## Task 1: Create `js/data.js`

Overwrites existing dead `js/constants.js` approach — write a new `js/data.js`.

- [ ] **Step 1: Create `js/data.js`**

Content: file header comment + lines 5–269 of `app.js` (everything from `const PERSONA_STATUS_IMAGES` through end of `GAME_DATA` section) + `MORNING_GREETINGS` const from line 1942 of `app.js`.

Open `app.js` to confirm: line 5 starts `const PERSONA_STATUS_IMAGES`, and around line 269 is the end of GAME_DATA. `MORNING_GREETINGS` is a large const array starting around line 1942, ending before `function generateIcons`.

File header:
```js
/* ============================================================
   DES2026 — Static data: personas, communities, voice rooms,
   seed stories, game data, morning greetings
   ============================================================ */
```

- [ ] **Step 2: Verify line count is under 400**

`wc -l js/data.js` — should be under 400. If over, check for accidental extra content.

---

## Task 2: Create `js/state.js`

Overwrites existing dead `js/state.js`.

- [ ] **Step 1: Create `js/state.js`**

Content: file header + lines 270–355 of `app.js` (from `/* ── APP STATE ── */` through end of `seedData` function + the `/* ── AVATAR ── */` section? No — avatar goes to ui.js).

Correct range: lines 270–301 (`APP STATE` section: `let S`, `loadS`, `saveS`, `set`, `mkId`, `mkGameId`, `mkMsg`, `mkStory`, `addMsg`) + lines 302–355 (`SEED DATA`: `seedData` function).

File header:
```js
/* ============================================================
   DES2026 — App state, persistence, and seed data
   ============================================================ */
```

---

## Task 3: Create `js/api.js`

Overwrites existing dead `js/api.js`.

- [ ] **Step 1: Create `js/api.js`**

Content: file header + lines 438–477 of `app.js` (`API` section: `claude()`, `fallback()`) + `delay()` function from line 999 of `app.js`.

The `delay` function at line 999 reads: `function delay(ms){return new Promise(r=>setTimeout(r,ms));}`. Copy it here after `fallback()`.

File header:
```js
/* ============================================================
   DES2026 — Claude API calls and async utilities
   ============================================================ */
```

---

## Task 4: Create `js/voice.js`

Overwrites existing dead `js/voice.js`.

- [ ] **Step 1: Create `js/voice.js`**

Content: file header + `const STT_LANGUAGE = 'en-IN';` (line 3 of app.js) + lines 401–437 of `app.js` (`VOICE` section: `let _recog`, `canSTT`, `canTTS`, `speak`, `stopSpeak`, `startRec`, `stopRec`).

File header:
```js
/* ============================================================
   DES2026 — Speech recognition and text-to-speech
   ============================================================ */
```

---

## Task 5: Create `js/icons.js`

Overwrites existing dead `js/icons.js`.

- [ ] **Step 1: Create `js/icons.js`**

Content: file header + lines 370–400 of `app.js` (`ICONS` section: the `const IC = { ... }` object).

File header:
```js
/* ============================================================
   DES2026 — Inline SVG icon library (IC object)
   ============================================================ */
```

---

## Task 6: Create `js/router.js`

Overwrites existing dead `js/router.js`.

- [ ] **Step 1: Create `js/router.js`**

Content: file header + lines 478–531 of `app.js` (`ROUTER` section: `let _stack`, `navigate`, `goBack`, `parseRoute`, `render`, `navTo`).

File header:
```js
/* ============================================================
   DES2026 — Hash-based router: navigate, goBack, render
   ============================================================ */
```

---

## Task 7: Create `js/ui.js`

This file has content from three non-contiguous sections of `app.js`. Combine them.

- [ ] **Step 1: Create `js/ui.js`**

Content in this order:
1. File header
2. Lines 356–369 of `app.js` (`AVATAR` section: `avColor`, `avInitials`, `avatar`)
3. Lines 532–734 of `app.js` (`SHARED UI` section through `renderInputBar`)
4. Lines 1471–1478 of `app.js` (`SHEET HELPERS` section: `sheet`, `closeSheet`)

Note: lines 532–734 include `mount`, `toast`, `ftime`, `fdate`, `scrollBot`, `headerTap`, `showResearcherDialog`, `header`, `bottomNav`, `navTo` (line 608), `desktopBanner`, `dismissDesktop`, `resBar`, `bubble`, `doubleTick`, `typingHTML`, `speakMsg`, `speakMsg`, `togglePlay`, `findMsg`, and `renderInputBar`.

File header:
```js
/* ============================================================
   DES2026 — Shared UI helpers: avatar, header, bubble,
   bottom nav, input bar, sheets, toast
   ============================================================ */
```

- [ ] **Step 2: Verify `showResearcherDialog` and `dismissDesktop` are included**

These are at lines ~563 and ~614. Grep to confirm they made it into ui.js:
`grep -n "showResearcherDialog\|dismissDesktop" js/ui.js`

---

## Task 8: Create `js/screens-setup.js`

Overwrites existing dead `js/screens-setup.js`.

- [ ] **Step 1: Create `js/screens-setup.js`**

Content: file header + lines 735–821 of `app.js` (from `/* ── SETUP SCREEN ── */` through end of `saveUserName` — just before `/* ── CHATS LIST ── */`).

File header:
```js
/* ============================================================
   DES2026 — Setup, onboarding, and name prompt screens
   ============================================================ */
```

---

## Task 9: Create `js/screens-chats.js`

Overwrites existing dead `js/screens-chat.js` (note: new filename is `screens-chats.js` with an 's').

- [ ] **Step 1: Create `js/screens-chats.js`**

Content: file header + lines 822–998 of `app.js` (from `/* ── CHATS LIST ── */` through line 998, stopping before `delay` at line 999) + lines 1000–1000 (just the blank line, skip `delay`) — actually just go straight to line 1001.

Simplified: lines 822–998 of `app.js`. This includes `renderChats`, `filterChips`, `openStatus`, `statusReact`, `renderChat`.

Do NOT copy line 999 (`delay` function) — it lives in `api.js`.

File header:
```js
/* ============================================================
   DES2026 — Chats list, status viewer, and chat screen
   ============================================================ */
```

---

## Task 10: Create `js/screens-stories.js`

Overwrites existing dead `js/screens-stories.js`.

- [ ] **Step 1: Create `js/screens-stories.js`**

Content: file header + lines 1001–1400 of `app.js` (from `/* ── STORIES ── */` through end of `triggerStoryReactions` — just before `/* ── SETTINGS ── */`).

File header:
```js
/* ============================================================
   DES2026 — Stories feed, story cards, compose, and thread
   ============================================================ */
```

---

## Task 11: Create `js/screens-settings.js`

- [ ] **Step 1: Create `js/screens-settings.js`**

Content: file header + lines 1401–1469 of `app.js` (from `/* ── SETTINGS ── */` through end of `showChangeNameSheet` — just before `/* ── SHEET HELPERS ── */`).

Note: `sheet`/`closeSheet` (lines 1471–1478) go to `ui.js` (already handled in Task 7), not here.

File header:
```js
/* ============================================================
   DES2026 — Settings sheet: font size, name, researcher mode
   ============================================================ */
```

---

## Task 12: Create `js/screens-communities.js`

- [ ] **Step 1: Create `js/screens-communities.js`**

Content: file header + lines 1479–1570 of `app.js` (from `/* ── COMMUNITIES ── */` through end of `renderCommunity` — just before `/* ── VOICE ROOMS LIST ── */`).

File header:
```js
/* ============================================================
   DES2026 — Communities list and community feed
   ============================================================ */
```

---

## Task 13: Create `js/screens-voicerooms.js`

- [ ] **Step 1: Create `js/screens-voicerooms.js`**

Content: file header + lines 1571–1758 of `app.js` (from `/* ── VOICE ROOMS LIST ── */` through end of `removeQuietPrompt` — just before `/* ── GAMES HUB ── */`).

File header:
```js
/* ============================================================
   DES2026 — Voice rooms list and live voice room screen
   ============================================================ */
```

---

## Task 14: Create `js/screens-games.js`

- [ ] **Step 1: Create `js/screens-games.js`**

Content: file header + lines 1759–1920 of `app.js` (from `/* ── GAMES HUB ── */` through end of `startGameFirstMove` — just before `/* ── ICON GENERATION ── */`).

File header:
```js
/* ============================================================
   DES2026 — Games hub, game sheet, and game screen
   ============================================================ */
```

---

## Task 15: Create `js/init.js`

- [ ] **Step 1: Create `js/init.js`**

Content: file header + lines 1921–1941 of `app.js` (`generateIcons` function) + lines 1985–2031 of `app.js` (`checkMorningGreeting` function + `/* ── INIT ── */` section with `window.onload`/`hashchange`).

Do NOT copy `MORNING_GREETINGS` const (lines ~1942–1984) — it goes in `data.js` (already handled in Task 1).

File header:
```js
/* ============================================================
   DES2026 — App init: icon rendering, morning greeting, boot
   ============================================================ */
```

---

## Task 16: Update `index.html` and delete dead files

This is the flip. Do all of this in one step.

- [ ] **Step 1: Update `index.html`**

Find:
```html
<script src="./app.js"></script>
```

Replace with:
```html
<script src="./js/data.js"></script>
<script src="./js/state.js"></script>
<script src="./js/api.js"></script>
<script src="./js/voice.js"></script>
<script src="./js/icons.js"></script>
<script src="./js/router.js"></script>
<script src="./js/ui.js"></script>
<script src="./js/screens-setup.js"></script>
<script src="./js/screens-chats.js"></script>
<script src="./js/screens-stories.js"></script>
<script src="./js/screens-communities.js"></script>
<script src="./js/screens-voicerooms.js"></script>
<script src="./js/screens-games.js"></script>
<script src="./js/screens-settings.js"></script>
<script src="./js/init.js"></script>
```

- [ ] **Step 2: Delete dead files that are now replaced**

Delete: `js/components.js`, `js/constants.js`, `js/screens-chat.js` (old filename, replaced by `screens-chats.js`)

Keep `app.js` until Step 4 (safety net).

- [ ] **Step 3: Open `index.html` in browser and verify the app loads**

Check:
- Chats tab loads with persona list
- Tap a chat — messages appear
- Stories tab loads
- Communities tab loads
- Voice Rooms tab loads
- Browser console — no `Uncaught ReferenceError` errors

- [ ] **Step 4: Delete `app.js`**

Only after Step 3 passes. `rm app.js` or delete via file tool.

- [ ] **Step 5: Verify once more**

Hard-reload browser. Confirm no 404s for `app.js`. Console clean.

- [ ] **Step 6: Commit**

Proposed message: `refactor: split app.js into 15 focused files — max ~450 lines each`

---

## Final file size check

Run `wc -l js/*.js` — no file should exceed 500 lines. If any does, inspect for accidental duplication.
