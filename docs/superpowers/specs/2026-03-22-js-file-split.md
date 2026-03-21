# DES2026 — JS File Split
**Date:** 2026-03-22
**Objective:** Split monolithic `app.js` (2031 lines) into focused files so no file exceeds ~450 lines, making AI-assisted editing faster and more accurate. No build step. GitHub Pages deployable. CSS left as-is.

---

## Problem

`app.js` mixes personas data, state management, API calls, routing, shared UI helpers, and all screen render functions in one 2031-line file. An AI reading it must consume the whole context window to find any function. Edits near line 1600 require loading the entire file.

Additionally, `js/*.js` files (api.js, components.js, router.js, etc.) exist but are **not loaded** by `index.html` — they're dead code from a previous abandoned split. They will be replaced.

## Approach

Split `app.js` into 13 files loaded via ordered `<script>` tags in `index.html`. All functions remain global (no modules/imports). Load order must respect dependencies: data → state → api → router → ui → screens → init.

## File Layout

| File | Responsibility | Approx lines |
|---|---|---|
| `js/data.js` | PERSONAS, COMMUNITIES, VOICE_ROOMS, SEED_STORIES, GAME_DATA, PERSONA_LIST, PERSONA_STATUS_IMAGES, MORNING_GREETINGS | ~310 |
| `js/state.js` | `S` initialiser, `loadS`/`saveS`/`set`, `mkId`/`mkMsg`/`mkStory`/`addMsg`, `seedData` | ~90 |
| `js/api.js` | `claude()`, `fallback()`, `delay()` — `delay` lives **only** here, not duplicated in any screen file | ~55 |
| `js/voice.js` | `STT_LANGUAGE`, `canSTT`, `canTTS`, `speak`, `stopSpeak`, `startRec`, `stopRec` | ~50 |
| `js/icons.js` | `IC` icons object | ~35 |
| `js/router.js` | `navigate`, `goBack`, `parseRoute`, `render`, `navTo`, `_stack` | ~70 |
| `js/ui.js` | `mount`, `toast`, `ftime`/`fdate`, `scrollBot`, `headerTap`, `showResearcherDialog`, `header`, `bottomNav`, `dismissDesktop`, `desktopBanner`, `resBar`, `bubble`, `doubleTick`, `typingHTML`, `speakMsg`/`togglePlay`/`findMsg`, `renderInputBar`, `sheet`/`closeSheet`, `avColor`/`avInitials`/`avatar` | ~240 |
| `js/screens-setup.js` | `renderSetup`, `doSetup`, `toggleKeyVis`, `renderOnboarding`, `renderNamePrompt`, `saveUserName` | ~95 |
| `js/screens-chats.js` | `renderChats`, `filterChips`, `openStatus`, `statusReact`, `renderChat` | ~200 |
| `js/screens-stories.js` | `renderStories`, `buildStoryCard`, `sendStoryReply`, `speakStoryCard`, `deleteMyStory`, `likeStory`, `renderStoryView`, `likeStoryThread`, `showStoryCompose`, `triggerStoryReactions` | ~420 |
| `js/screens-communities.js` | `renderCommunities`, `showCommTab`, `commCard`, `toggleJoin`, `renderCommunity` | ~100 |
| `js/screens-voicerooms.js` | `renderVoiceRooms`, `renderVoiceRoom`, `callClaudeForVoiceRoom`, `sendVRMsg`, `transcriptLine`, `transcriptLineUser`, `speakTL`, `showQuietPrompt`, `removeQuietPrompt`, `_vrInterval`/`_vrQuietTimer` | ~175 |
| `js/screens-games.js` | `renderGames`, `gameCard`, `showGameSheet`, `renderGame`, `renderGameStatus`, `buildGameNote`, `updateGameState`, `startGameFirstMove` | ~175 |
| `js/screens-settings.js` | `showSettings`, `applyFontSize`, `setFontSize`, `showChangeNameSheet` | ~70 |
| `js/init.js` | `generateIcons`, `checkMorningGreeting`, app init (`window.onload` / `hashchange`) | ~100 |

**Total: ~2075 lines across 13 files** (slightly more than current due to section comments added).

## index.html Changes

Replace `<script src="./app.js"></script>` with 13 ordered script tags:

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

`app.js` is deleted after extraction is verified.

## Dead Code Cleanup

The following files exist in `js/` but are not loaded. They will be **overwritten** with the extracted content:
- `js/api.js` (150 lines — dead)
- `js/components.js` (518 lines — dead)
- `js/constants.js` (297 lines — dead)
- `js/icons.js` (42 lines — dead)
- `js/router.js` (89 lines — dead)
- `js/screens-chat.js` (117 lines — dead, note: renamed to `screens-chats.js`)
- `js/screens-setup.js` (224 lines — dead)
- `js/state.js` (144 lines — dead)
- `js/voice.js` (110 lines — dead)

`js/components.js`, `js/constants.js`, `js/icons.js`, `js/voice.js` will be deleted (their content is absorbed into the new files listed above).

## Constraints

- No ES module syntax (`import`/`export`) — all globals, all script tags
- No build step — direct file edit, push to GitHub Pages
- Load order matters: each file may only reference globals defined in an earlier-loaded file
- `canSTT`, `canTTS`, `speak`, `stopSpeak`, `startRec`, `stopRec` are currently inline in `app.js` (lines 401–436) and move to `js/ui.js` (or a dedicated `js/voice.js` — voice.js already existed for this purpose, keep it)
- The IC (icons) object and voice functions stay in their own small files since they're referenced across screens

## Load Order Rationale

```
data → state → api → voice → icons → router → ui → screens-* → init
```

- `showResearcherDialog` lives in `ui.js` (not `screens-settings.js`) because `headerTap()` in `ui.js` calls it — placing it in a later-loading file would create a forward reference.
- `dismissDesktop` lives in `ui.js` because it's called from the `desktopBanner()` HTML string (also in `ui.js`).
- `delay()` lives **only** in `api.js`. It was physically located at line 999 of `app.js` inside the chat section — that is dead positioning. All screen files that use `delay` (stories, communities, voice rooms, games) load after `api.js`.
- `MORNING_GREETINGS` (large static array at app.js line 1942) moves to `data.js` — it's static seed data, not init logic.
- `STT_LANGUAGE` constant moves to the top of `voice.js` — it's only used there.

## Out of Scope

- CSS split (style.css stays as-is)
- Changing function signatures or adding modules/imports
- Any feature changes — pure structural refactor only
