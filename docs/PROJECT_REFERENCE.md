# DES2026 — Project Reference

> **Read this before touching any code.** This file captures the app's purpose, information architecture, UX rules, known broken spots, and Claude API cost constraints. Keep it up to date as the app evolves.

---

## What This App Is

A **WhatsApp-clone PWA** used for UX research. It simulates a WhatsApp-like social experience for older Indian adults (60–75 yrs), populated with 8 AI personas that chat, participate in communities, voice rooms, and games. The app is tested by researchers and participants on Android Chrome.

**This is a testing/research prototype — not a production app.** The goal is realism of UX, not completeness of features. Fake/stub interactions are acceptable as long as they feel plausible and consistent.

---

## Information Architecture

### Screens & Routes

| Route | Screen | Entry Point |
|---|---|---|
| `#/` or `#/chats` | Chats list | Default / bottom nav |
| `#/chat/:personaId` | 1-on-1 chat | Tap chat row or status ring |
| `#/stories` | Stories feed | Bottom nav |
| `#/story/:storyId` | Story thread view | Tap story card |
| `#/communities` | Communities list | Bottom nav |
| `#/community/:commId` | Community feed | Tap community card |
| `#/voicerooms` | Voice rooms list | Bottom nav |
| `#/voiceroom/:roomId` | Live voice room | Tap room card or community voice-room button |
| `#/games` | Games hub | Bottom nav |
| `#/game/:gameId/:gameType` | Active game | Tap active game card or start new game |

### Bottom Nav Tabs (in order)
1. **Chats** — badge shows unread count
2. **Stories** — badge always 0 (no unread tracking)
3. **Comm.** — communities
4. **Voice** — voice rooms
5. **Games**

### Sheets (not screens — overlay, no route change)
- **Settings sheet** — triggered from Chats header "⋮" button (`showSettings()`)
- **Change Name sheet** — triggered from Settings → Your name row
- **Story Compose sheet** — triggered from Stories FAB
- **Game Start sheet** — triggered from Games FAB or chat input game button
- **Status Viewer overlay** — triggered by tapping a persona's avatar ring in Chats list

---

## Personas

8 AI personas, all older Indian adults living in Mumbai society:

| ID | Name | Age | Personality | Language Mix |
|---|---|---|---|---|
| `meenakshiamma` | Meenakshiamma | 68 | Warm, fussy, nurturing | Tamil/English |
| `rameshbhai` | Rameshbhai Patel | 72 | Energetic, opinionated, cricket-obsessed | Gujarati/Hindi/English |
| `krishnaswamy` | Krishnaswamy Uncle | 74 | Precise, dry wit, chess player | Kannada/English |
| `sunitadevi` | Sunita Devi | 65 | Gentle, health-conscious, caring | Hindi-dominant |
| `harbhajan` | Harbhajan Singh Ji | 71 | Disciplined, positive, army veteran | Punjabi/Hindi/English |
| `lalitha` | Lalitha Krishnan | 63 | Retired bank manager | Marathi/English |
| `padmavathi` | Padmavathi | — | — | — |
| `abdulrehman` | Abdul Rehman | — | — | — |

All personas have **photo avatars** (`PERSONA_PHOTOS`) and **status images** (`PERSONA_STATUS_IMAGES`). Every persona with a status image gets a story ring on their chat list avatar.

---

## Communities

| ID | Name | Tags |
|---|---|---|
| `cricket` | Cricket Fans | cricket, sports |
| `bollywood` | Bollywood Buffs | bollywood, movies |
| `bhajan` | Bhajan & Devotional | spirituality, music |
| `society` | Society Matters | society, housing |
| `recipes` | Recipe Exchange | cooking, food |

Communities have `personas[]` (which AI personas participate) and optionally `voiceRoom` (ID of an associated voice room).

---

## Voice Rooms

Each voice room has:
- `personas[]` — which personas are in the room
- `seed` — initial transcript lines (pre-populated)
- `themeTag` — display subtitle
- `quietChips` — prompt suggestions shown after 15s silence
- AI generates new transcript lines every 8–12 seconds while room is open

---

## Games

| Type | Description |
|---|---|
| `antakshari` | Song chain — last letter of each song starts the next |
| `trivia-bollywood` | Bollywood trivia Q&A |

"Word Chain" and "Cricket Trivia" are shown as **Coming Soon** placeholders (intentionally non-functional).

---

## Button & Action Audit

### Functional (working)
| Location | Button | Action |
|---|---|---|
| Chats header | ⋮ (Settings icon) | Opens Settings sheet |
| Chats header | QR icon | `toast('QR code coming soon')` |
| Chats list | Chat row tap | Navigate to chat |
| Chats list | Avatar ring tap (persona with status) | Open Status Viewer |
| Chats filter | All / Unread / Favourites / Groups chips | Visual selection only — **Unread/Favourites/Groups do not filter** |
| Chat screen | Back button | `goBack()` |
| Chat screen | Phone icon | `toast('Calling...')` |
| Chat screen | Video icon | `toast('Video calling...')` |
| Chat screen | Game controller (input bar) | Opens Game Start sheet |
| Chat screen | Send / Mic | Send message or voice record |
| Status viewer | Heart button | Toast reaction, closes overlay |
| Status viewer | Reply input (Enter) | Sends reply as chat message, navigates to chat |
| Stories FAB | ✏️ | Opens Story Compose sheet |
| Stories | Story card tap | Navigate to story view |
| Story view | Back button | `goBack()` |
| Communities header | Search | **Dead — no action** |
| Communities header | ⋮ | **Dead — no action** |
| Communities | Joined / Discover tabs | Working — filters view |
| Communities | Discover tag chips | Working — filters by tag |
| Communities | Join / ✓ Joined button | Toggle join state |
| Communities | Card tap | Navigate to community feed |
| Community feed | Back button | `goBack()` |
| Community feed | Voice Room button (if comm has voiceRoom) | Navigate to voice room |
| Community feed | Send message | Triggers AI response |
| Voice Rooms header | Search | **Dead — no action** |
| Voice Rooms header | ⋮ | **Dead — no action** |
| Voice Rooms | Card tap | Navigate to voice room |
| Voice Rooms FAB | Phone | `toast('New call coming soon')` |
| Voice Room | Back button | `goBack()` |
| Voice Room | Mic button | Start voice recording (STT) |
| Voice Room | Send input (Enter) | Send message, AI responds |
| Voice Room transcript | Play button | TTS playback |
| Voice Room quiet prompt chips | Tap chip | Send as message |
| Games hub | Start New Game button | Opens Game Start sheet |
| Games hub | Active game card | Navigate to game |
| Games header | ⋮ | **Dead — no action** |
| Game screen | Back button | `goBack()` |
| Game screen | Send | Make game move, AI responds |
| Settings sheet | Text size buttons | Set font size (normal/large/xlarge) |
| Settings sheet | Your name row | Opens Change Name sheet |
| Settings sheet | Researcher Mode row | Opens researcher dialog |
| Header (triple tap) | Hidden | Opens researcher dialog |

### Known Dead Buttons (stub with toast or truly no action)
- Communities Search, ⋮
- Voice Rooms Search, ⋮
- Games ⋮
- Chats QR → toast (intentional stub)
- Voice Rooms FAB → toast (intentional stub)
- Filter chips (Unread, Favourites, Groups) — visual only, no actual filtering logic

---

## UX Rules & Consistency Standards

### Headers
- **White header** (`header--white`, dark text `#111b21`): All screens except Chats list
- **Chats list** is special: white header, teal "WhatsApp" title text (`#00A884`)
- Back button: all detail screens (chat, story, community, voice room, game)
- No back button on top-level tabs

### Bottom Nav
- Present on all 5 top-level tab screens
- **Not present** on any detail screen (chat, story view, community feed, voice room, game)
- Active tab highlighted

### FABs
- Chats list: new chat (→ toast "coming soon")
- Stories: compose new story
- Voice Rooms: new call (→ toast "coming soon")
- Games: no FAB — "Start New Game" button is in the list body

### Input Bar
- Present: chat, community feed, game screen
- Present: voice room (custom input, not the standard `renderInputBar`)
- Not present: chats list, stories, communities list, voice rooms list, games hub

### Sheets vs Screens
Settings, name change, story compose, and game start are **bottom sheets**, not routes. They never change the URL hash.

### Toasts
Use for: stubs ("coming soon"), confirmations ("Name updated"), reactions. Keep short — 1 short phrase.

### Empty States
Every list screen should handle empty state gracefully with icon + title + desc. Currently implemented for: Chats, Communities (joined tab).

---

## Claude API — Cost Controls

**Current config (`api.js`):**
- Model: `claude-sonnet-4-20250514`
- `max_tokens: 200` — keep this low, personas give short conversational replies
- Context window: last **10 messages** only (`messages.slice(-10)`)
- Fallback: each persona has 5 pre-written fallback strings used when API fails

**Cost rules — never change these without discussion:**
1. `max_tokens` stays at 200 or lower. Personas reply in 1–3 short messages.
2. Context slice stays at `slice(-10)` or fewer.
3. Voice room AI lines: scheduled every 8–12s. Do not shorten this interval.
4. Do NOT add new auto-triggered AI calls (e.g. timed chat messages, background polling).
5. Any new AI feature must use the existing `claude()` function and the fallback chain.
6. Community AI: one AI response per user message. No multi-turn auto-conversation.

**Fallback chain behaviour:**
- If API call fails → `fallback(personaId)` cycles through `persona.fallbacks[]` in order
- Each persona has 5 fallbacks — rotates with `_fallbackIdx`

---

## State Shape (`state.js`)

```js
S = {
  userName: string,          // user's display name
  onboardingDone: bool,
  interests: string[],       // seeded on first load
  chats: { [personaId]: Message[] },
  communities: { [commId]: Message[] },
  voiceRooms: { [roomId]: { transcript: Line[] } },
  games: { [gameId]: GameState },
  unreadChats: { [personaId]: number },
  joinedCommunities: string[],
  researcherMode: bool,      // shows AI badge on chat list items
  fontSize: 'normal'|'large'|'xlarge',
  proxyUrl: string,          // optional override for Claude API proxy
}
```

State is persisted to `localStorage` via `saveS()`. `set({...})` merges and saves.

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | App shell, loads all JS/CSS |
| `style.css` | All styles |
| `js/data.js` | PERSONAS, COMMUNITIES, VOICE_ROOMS, SEED_STORIES, game data |
| `js/state.js` | State shape, `makeStory`, `makeMsg` factories |
| `js/api.js` | `claude()`, `fallback()`, `delay()` |
| `js/router.js` | `navigate()`, `goBack()`, `render()`, `parseRoute()` |
| `js/ui.js` | `header()`, `bottomNav()`, `avatar()`, `bubble()`, `renderInputBar()`, `toast()`, `sheet()` |
| `js/icons.js` | `IC` icon map (Lucide SVG strings) |
| `js/init.js` | App bootstrap, `seedData()` |
| `js/screens-chats.js` | `renderChats()`, `renderChat()`, `openStatus()` |
| `js/screens-stories.js` | `renderStories()`, `renderStoryView()`, `showStoryComposeSheet()` |
| `js/screens-communities.js` | `renderCommunities()`, `renderCommunity()` |
| `js/screens-voicerooms.js` | `renderVoiceRooms()`, `renderVoiceRoom()` |
| `js/screens-games.js` | `renderGames()`, `showGameSheet()`, `renderGame()` |
| `js/screens-settings.js` | `showSettings()`, `showChangeNameSheet()` |
| `js/voice.js` | STT (`startRec`/`stopRec`) and TTS (`speak`/`stopSpeak`) |
| `app.js` | Legacy — check before adding code here; most logic now in js/* |

---

## Outstanding Issues (as of 2026-03-22)

From `docs/superpowers/specs/2026-03-21-north-star-polish.md`:
- **A1** Unread badge — may be fixed (check `screens-chats.js:177`)
- **A2** Story title blank on direct post — fix in `screens-stories.js`
- **A3** Dead code `toggleStoryComments` / `renderStoryComments` in `app.js` — delete
- **B1/B2** Header colour/alignment — may be fixed (white headers now in communities, voicerooms)
- **B3** Story compose category image picker — implemented

**Ongoing UX debt:**
- Filter chips (Unread, Favourites, Groups) are visual only — no filtering logic
- Communities Search and ⋮ buttons are dead
- Voice Rooms Search and ⋮ buttons are dead
- Games ⋮ button is dead
- Chat screen "More" (⋮) button has `fn:''` — dead

---

## Design Principles

1. **Feel like WhatsApp** — layouts, header colours, font sizes, and interaction patterns should match WhatsApp 2024 on Android closely enough to be credible to a 65-year-old participant.
2. **Stub > broken** — a dead button is worse than a toast saying "coming soon." Every tappable element must do *something*.
3. **No empty fn handlers** — `fn:''` in header actions is a bug. Use `toast('...')` as minimum.
4. **Consistency over completeness** — it's fine if Search doesn't work, but it must at least show a toast. Silence feels broken.
5. **Minimal API surface** — add AI only where it meaningfully serves the research scenario. Don't burn tokens on cosmetic interactions.
