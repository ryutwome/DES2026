# WhatsApp PWA — DES Research Prototype
**Date:** 2026-03-18
**Project:** IDC School of Design, IIT Bombay — Design Exploration Study (DES2026)
**Deployment:** https://ryutwome.github.io/DES2026/

---

## 1. Project Overview

A mobile-first PWA that simulates WhatsApp for usability research with elderly Indian users (ages 60–80). Tests 4 new social features: Stories, Publishable Communities, Games, and Ambient Voice Rooms. AI personas (powered by Anthropic claude-sonnet-4-20250514) simulate other elderly Indian users responding realistically in conversation.

---

## 2. Tech Stack & Constraints

- **No build step** — pure HTML/CSS/JS, GitHub Pages deployable
- **File structure:** `index.html`, `manifest.json`, `service-worker.js`, `app.js`, `style.css`, `/icons/`
- **Multiple script files permitted** — to keep `app.js` manageable, additional JS files may be added in `/js/` and loaded via plain `<script>` tags in `index.html`. No bundler required.
- **All paths relative** — no absolute `/` paths, works from `https://ryutwome.github.io/DES2026/`
- **AI:** Anthropic API (`claude-sonnet-4-20250514`) called from browser via CORS proxy (see Section 2a)
- **API key:** stored in `localStorage['researcher_api_key']`, never hardcoded
- **Voice input:** Web Speech API (`SpeechRecognition`, `lang: 'en-IN'`)
- **Voice output:** Web Speech API (`speechSynthesis`, `lang: 'en-IN'`)
- **STT language constant:** `const STT_LANGUAGE = 'en-IN'` at top of `app.js`

### 2a. CORS Proxy for Anthropic API

Direct browser-to-Anthropic API calls are blocked by CORS. The solution: use a **Cloudflare Worker** as a thin proxy. The worker forwards requests to `api.anthropic.com`, adds the required headers, and returns the response. The worker URL is stored as `const PROXY_URL` in `app.js` and can be swapped out. All `fetch()` calls to Claude go through this proxy.

The Cloudflare Worker (free tier, ~10 lines of code) is deployed separately by the researcher. Its URL is entered alongside the API key on the researcher setup screen. This adds one setup step but requires no server beyond what GitHub Pages already provides.

**Researcher setup screen collects:**
1. Anthropic API key
2. Cloudflare Worker proxy URL

Both stored in `localStorage`. All AI calls use: `fetch(PROXY_URL, { body: { ...claudePayload, apiKey } })`.

---

## 3. PWA Requirements

- `manifest.json`: `display: "standalone"`, `start_url: "./"`, `scope: "./"`, `theme_color: "#075E54"`, `orientation: "portrait"`, icons array
- `service-worker.js`: basic install/fetch handler to trigger browser install prompt
- Meta tags: `mobile-web-app-capable`, `apple-mobile-web-app-capable`, `theme-color`, `viewport` with `viewport-fit=cover`
- Root container: `height: 100dvh`
- Header: `padding-top: env(safe-area-inset-top)`
- Bottom nav: `padding-bottom: env(safe-area-inset-bottom)`
- "Add to Home Screen" nudge banner on first visit (dismissible, stored in AppState)
- **Desktop/unsupported browser banner:** shown when `SpeechRecognition` is unavailable. Copy: "For the full voice experience, open this on an Android phone in Chrome." Non-intrusive, dismissible, shown at top of app below header.

---

## 4. Design Tokens (WhatsApp faithful)

```css
--wa-header-dark:    #075E54
--wa-header-medium:  #128C7E
--wa-green:          #25D366
--wa-bubble-sent:    #DCF8C6
--wa-bubble-recv:    #FFFFFF
--wa-chat-bg:        #ECE5DD
--wa-tab-active:     #25D366
--font-family:       'Roboto', system-ui, sans-serif
```

**Font sizing:** All font sizes use `rem` units relative to `html { font-size: 16px }`. This allows Android system font scale to be respected. Minimum body text: `1rem` (16px at default scale). Large text elements (names, headers): `1.125rem`–`1.25rem`.

Iconography: WhatsApp-style SVG icons for back chevron, mic, attach, send arrow, double-tick, speaker, phone, video, search, more-vertical. All icons inline SVG in `app.js`.

---

## 5. Navigation & Routing

**Architecture:** Hash-based routing. `navigate(hash)` pushes to in-memory history stack + sets `window.location.hash`. `goBack()` pops stack. Both `hashchange` and `popstate` events handled for Android hardware back button support.

**Initial load:** On `DOMContentLoaded`, `window.location.hash` is parsed and the matching screen is rendered immediately. This ensures bookmarked deep links and PWA launch from home screen both route correctly.

**Routes:**

| Route | Screen | Back button |
|---|---|---|
| `#/` | Researcher setup | No |
| `#/onboarding` | Interest selection | No |
| `#/chats` | Chat list (home) | No |
| `#/chat/:personaId` | 1-on-1 chat | ← |
| `#/communities` | Communities list + Discover | No (tab) |
| `#/community/:id` | Community feed | ← |
| `#/stories` | Stories feed | No (tab) |
| `#/story/:id` | Individual story | ← |
| `#/voicerooms` | Voice rooms list | No (tab) |
| `#/voiceroom/:id` | Individual voice room | ← |
| `#/games` | Games hub | No (tab) |
| `#/game/:gameId/:type` | Active game screen | ← |

**Bottom nav (5 tabs):** Chats | Stories | Communities | Voice Rooms | Games
- Background: `#075E54`, active indicator: `#25D366` underline + label highlight
- `padding-bottom: env(safe-area-inset-bottom)` to clear Android gesture nav

---

## 6. App State

Single `AppState` object in `app.js`, persisted to `localStorage` on every mutation. `localStorage.setItem` is wrapped in a try/catch; on `QuotaExceededError`, the oldest 20% of messages in each chat/community are trimmed before retrying.

```js
AppState = {
  apiKey: string,             // researcher_api_key
  proxyUrl: string,           // Cloudflare Worker URL
  onboardingDone: bool,
  interests: string[],        // selected on onboarding
  chats: {},                  // personaId → Message[]
  communities: {},            // communityId → Message[]
  games: {},                  // gameId → GameState
  stories: Story[],           // both AI-seeded and user-authored
  voiceRooms: {},             // roomId → { transcript: TranscriptLine[] }
  researcherMode: bool,
  installBannerDismissed: bool,
  desktopBannerDismissed: bool,
}
```

**Voice room transcript persistence:** transcripts are stored in `AppState.voiceRooms[roomId].transcript` and persisted. On re-entry, the existing transcript is shown and new lines are appended.

---

## 7. Data Schemas

### Message
```js
{
  id: string,           // uuid
  from: 'user' | personaId,
  type: 'text' | 'voice' | 'game-invite',
  text: string,         // transcribed text for voice messages
  timestamp: number,    // epoch ms
  isAI: bool,
}
```

### Story
```js
{
  id: string,
  authorId: personaId | 'user',
  authorName: string,
  text: string,
  timestamp: number,
  replies: Message[],   // reply thread
}
```

### GameState
```js
{
  id: string,           // gameId — generated as `game_${Date.now()}_${Math.random().toString(36).slice(2)}`
  type: 'antakshari' | 'trivia-bollywood' | 'trivia-cricket' | 'wordchain',
  opponentId: personaId,
  status: 'active' | 'completed',
  currentLetter: string,   // antakshari / wordchain
  score: { user: number, ai: number },  // trivia
  questionNumber: number,  // trivia
  messages: Message[],
  createdAt: number,
  completedAt: number | null,
}
```

### TranscriptLine
```js
{
  id: string,
  personaId: personaId,
  text: string,
  timestamp: number,
}
```

---

## 8. Shared Components

- **Header:** `#075E54` background, back chevron (`‹`) left on sub-screens, title center, action icons right. `padding-top: env(safe-area-inset-top)`. **Researcher Mode toggle:** a hidden settings icon appears only after a 3-tap sequence on the header title (not a long-press, to avoid accidental trigger by elderly users with tremor). Tapping it shows a confirmation dialog: "Enable Researcher Mode? This will label AI personas." with Cancel / Enable.
- **BottomNav:** 5 tabs with icons + labels, active state highlighted.
- **ChatBubble:** sent (right, `#DCF8C6`) / received (left, `#FFFFFF`). Timestamp bottom-right. Double-tick for sent. Speaker icon (min 44×44px tap target) below every bubble for TTS playback. Only one TTS utterance plays at a time — tapping speaker cancels any in-progress utterance and starts the new one.
- **TypingIndicator:** Three-dot bounce animation shown 1500–2500ms before AI response.
- **AvatarCircle:** Initials from name, colour deterministic via name hash (8 colours).
- **VoiceInput:** Primary = large mic button (min 56×56px). Secondary = text field. Tap mic → `SpeechRecognition` starts → waveform animation shown → interim transcript displayed in text field as user speaks → session ends on silence or tap → final transcript remains in text field → user taps send arrow to confirm and send. If `SpeechRecognition` unavailable: mic hidden, text-only input shown.
- **VoiceBubble:** Transcribed text + play button (replays via `speechSynthesis`). Fake waveform SVG.
- **MessageInput:** Attach icon | text field | mic (primary, large) / send arrow (shown when text present). 🎮 controller icon for initiating games from chat.

---

## 9. AI Personas

8 personas. System prompt per persona appended with global constraints.

**Global system prompt constraints (appended to every persona prompt):**
- Respond in 1–3 sentences maximum
- Occasionally ask a question back to keep conversation natural
- Reference personal life details organically (grandchildren, daily routine, health, memories)
- Never use Gen-Z slang, emojis beyond 🙏 😊, or internet-speak
- Respond in the same language the user writes in, naturally mixing in regional language phrases

**Personas:**

| Name | Age | City | Background | Language mix |
|---|---|---|---|---|
| Meenakshiamma | 68 | Chennai | Retired schoolteacher | Tamil/English |
| Rameshbhai Patel | 72 | Surat | Retired textile businessman | Gujarati/Hindi/English |
| Sunita Devi | 65 | Lucknow | Retired nurse | Hindi-dominant |
| Krishnaswamy Uncle | 74 | Bangalore | Retired engineer | Kannada/English |
| Padmavathi Rao | 67 | Hyderabad | Retired college lecturer | Telugu/English |
| Harbhajan Singh Ji | 71 | Pune | Retired army officer | Punjabi/Hindi/English |
| Lalitha Krishnan | 63 | Mumbai | Retired bank manager | Marathi/English |
| Abdul Rehman Sahab | 69 | Hyderabad | Retired Urdu teacher | Urdu/Hindi |

**API call:** Last 10 messages passed as context. Typing delay 1500–2500ms random.

**On API failure (any surface — chat, community, games, voice rooms):** rotate through 5 pre-written fallbacks per persona (at least 2 of 5 are user-directed questions). Fallbacks are surface-aware: chat fallbacks are conversational, voice room fallbacks are ambient/topic-related, game fallbacks acknowledge the game context.

**Error messages shown to user (plain language):** "Could not connect right now. Please try again in a moment." — shown as a small toast at bottom of screen. Never show raw error codes or technical messages.

**Researcher Mode:** 3-tap on header title → confirmation dialog → toggle `researcherMode`. When on: AI persona labels shown in chat list, small "AI" badge on received bubbles.

---

## 10. Community-to-Voice-Room Mapping

4 of the 8 communities have a linked Voice Room. The "Voice Room" button in a community header is only shown for these 4:

| Community ID | Community Name | Voice Room ID | Voice Room Name |
|---|---|---|---|
| `cricket` | Cricket Addicts | `cricket-discussion` | Cricket Discussion |
| `bollywood` | Retro Bollywood | `retro-bollywood-adda` | Retro Bollywood Adda |
| `bhajan` | Bhajan & Spirituality | `morning-bhajans` | Morning Bhajans |
| `general` | (all communities) | `evening-adda` | Evening Adda |

Communities without a linked Voice Room (Tamil Cooking Club, Gardening Friends, Retired Teachers, Book Lovers, Travel Stories) do not show the "Voice Room" button. Evening Adda is a general room accessible from the Voice Rooms tab and from all joined communities as a secondary option.

**Community IDs (slugs used in routes):**
`tamil-cooking`, `cricket`, `bollywood`, `gardening`, `retired-teachers`, `bhajan`, `book-lovers`, `travel`

**Voice Room IDs:**
`morning-bhajans`, `cricket-discussion`, `retro-bollywood-adda`, `evening-adda`

---

## 11. Feature 1 — Stories

**`#/stories`:** Vertical feed of story cards. Each card: AvatarCircle + name + timestamp + story text (3-line truncate) + "Read more" link + "Reply" button (min 44×44px). User-authored stories appear at the top of the feed, AI stories below, newest-first within each group.

AI personas have 3 pre-written stories each seeded on first load (recipe memory, childhood story, cultural observation). Total: 24 pre-seeded stories stored in `AppState.stories` with `authorId` set to the persona ID.

**Compose sheet** (opened by FAB):
- Text area + VoiceInput mic as primary
- 4 suggestion chips (min 44×44px tap target): "Share a recipe memory" | "Your neighbourhood growing up" | "A film that changed you" | "A festival memory"
- Post button → creates Story with `authorId: 'user'`, `authorName: 'You'`, prepends to `AppState.stories`, closes sheet
- After user posts: 2–3 AI personas (randomly selected from those the user has chatted with) post a reply to the story within 5–10 seconds, simulating engagement

**`#/story/:id`:** Full story text + reply thread below.
- "Reply" button: if `story.authorId` is a persona, navigates to `#/chat/:personaId` with story text quoted as context
- If `story.authorId === 'user'`: "Reply" is hidden (cannot reply to own story in 1-on-1 chat — instead replies appear in the story thread automatically from AI personas)

---

## 12. Feature 2 — Communities

**`#/communities`:** Two tabs — "Joined" and "Discover".

**Communities** (see Section 10 for IDs):

| Name | Tags |
|---|---|
| Tamil Cooking Club | #TamilCooking #Recipes #Food |
| Cricket Addicts | #Cricket #IPL #Sports |
| Retro Bollywood | #Bollywood #70s80s #Films |
| Gardening Friends | #Gardening #Nature #Plants |
| Retired Teachers | #Education #RetiredLife #Teaching |
| Bhajan & Spirituality | #Devotional #Bhajans #Spirituality |
| Book Lovers | #Literature #Reading #Books |
| Travel Stories | #Travel #India #Adventure |

Onboarding interest selection auto-joins 2–3 matching communities. At least 1 community is always joined.

**Discover tab:** tag filter chips + search field. Search filters by community name and tags, in real-time on each keystroke. No-results state: "No communities found. Try a different tag."

**`#/community/:id`:** Group feed with AI persona messages. User can post (VoiceInput primary). AI personas respond to user posts via Anthropic API with community topic as context. "Voice Room" button shown in header only for the 4 linked communities (see Section 10).

**AI responses in communities:** when user posts, 1 random persona from those active in that community responds after 1500–2500ms typing delay. Fallback used on API failure.

---

## 13. Feature 3 — Games

**`#/games` hub:**
- "Active Games" section — game cards (type icon, opponent avatar+name, whose turn, last move preview)
- "Start New Game" button → step 1: pick game type; step 2: pick opponent
- "Recent Games" section — completed games with result summary

**Opponent selection:** step 2 shows a flat list of all 8 AI personas (labelled with their city). Community membership is not used to filter — all personas are always available as opponents. One active game per opponent per game type is permitted; if a game already exists with that persona+type, the existing game is surfaced instead of starting a new one.

**`gameId` generation:** `game_${Date.now()}_${Math.random().toString(36).slice(2,7)}` — generated at game creation before navigation.

**Game types:**
- **Antakshari:** AI gives a song title. User responds with a song starting with the last letter of AI's title. AI validates (via Anthropic API) and continues. Status bar shows: current required letter.
- **Bollywood Trivia:** AI asks questions. User types answer. AI validates and scores. Status bar: score + question number.
- **Cricket Trivia:** Same as Bollywood Trivia, India-focused cricket content.
- **Word Chain:** User gives a word, AI responds with a word starting with the last letter. Status bar: last word + required starting letter.

**`#/game/:gameId/:type`:** Chat-like interface. Sticky game-status bar below header. Game initiatable from `#/chat/:id` via 🎮 controller icon — tapping it opens the game type picker, then goes directly to game without the opponent picker (opponent = the current chat persona).

---

## 14. Feature 4 — Voice Rooms

**`#/voicerooms`:** Room cards — name, theme tag, participant avatar strip (up to 5 shown), "Live" pulsing green dot.

**4 permanent rooms** (IDs in Section 10):
- Morning Bhajans
- Cricket Discussion
- Retro Bollywood Adda
- Evening Adda

**`#/voiceroom/:id`:**
- Participant grid: 3–5 AI avatars visible, one at a time has a pulsing green speaking-ring (CSS animation cycles through personas every 8–12 seconds)
- Scrollable transcript panel: AI-generated lines appear every 8–12 seconds via Anthropic API, themed to room. Transcript persists in `AppState.voiceRooms[id].transcript`.
- **Quiet prompt:** if no new transcript line has appeared for **15 seconds** (larger than the 12s max generation interval), a prompt card appears: "It's gone quiet — ask something!" with 3 suggestion chips relevant to the room theme
- Mic button (primary, large) + text input at bottom — user contributions trigger an AI response immediately (bypassing the 8–12s interval)
- All transcript lines have speaker icon (min 44×44px) for TTS playback. Only one utterance at a time; tapping cancels current and starts new.

---

## 15. Voice Architecture (Global)

```
const STT_LANGUAGE = 'en-IN';

SpeechRecognition:
  - lang: STT_LANGUAGE
  - continuous: false
  - interimResults: true (show live transcript while recording)
  - Session ends on silence OR manual tap of mic button
  - After session ends (auto or manual), final transcript remains in text field
  - User taps send arrow to confirm and send — no separate "confirm" modal needed

speechSynthesis:
  - lang: 'en-IN'
  - Prefer voice where voiceURI includes 'India' or name includes 'Indian'
  - Fallback: first available 'en' voice
  - Only one utterance at a time — new tap cancels current utterance

Graceful degradation:
  - SpeechRecognition unavailable → hide all mic buttons, show text-only input
  - speechSynthesis unavailable → hide all speaker icons silently
  - When SpeechRecognition unavailable → show banner: "For the full voice experience, open this on an Android phone in Chrome"
```

---

## 16. Researcher Setup Screen (`#/`)

Plain minimal UI (not WhatsApp-styled) shown only when `!AppState.apiKey`. Collects:
1. **Anthropic API key** — `type="password"` with show/hide toggle
2. **Proxy URL** — plain text input, label: "Cloudflare Worker URL (handles API requests)", placeholder: `https://your-worker.workers.dev`

"Continue" button enabled only when both fields are non-empty. On submit: stored to `localStorage`. Navigates to `#/onboarding` if `!AppState.onboardingDone`, else to `#/chats`.

Small note: "This screen will not appear again on this device. Keys are stored locally only."

On reload with existing `apiKey` + `onboardingDone`: skip directly to `#/chats`.
On reload with `apiKey` but no `onboardingDone`: go to `#/onboarding`.
On reload with no `apiKey`: go to `#/` (setup screen).

---

## 17. Onboarding (`#/onboarding`)

WhatsApp-styled (green header). One screen:
- "What are you interested in?" heading (1.25rem)
- 6 interest tiles (2×3 grid, each tile min 80×80px): Cooking 🍲 | Cricket 🏏 | Music 🎵 | Gardening 🌱 | Literature 📚 | Spirituality 🙏
- Tap to toggle, green border + background when selected
- "Let's go →" button enabled when **≥1** tile selected (consistent rule throughout)
- No maximum selection limit

On complete: auto-join 2–3 communities matching selected interests (Tamil Cooking ↔ Cooking; Cricket Addicts ↔ Cricket; Retro Bollywood / Book Lovers ↔ Music/Literature; Gardening Friends ↔ Gardening; Bhajan & Spirituality ↔ Spirituality; Retired Teachers ↔ any). Seed initial AI welcome messages in each joined community. Navigate to `#/chats`.

---

## 18. Accessibility

- All font sizes in `rem`, min `1rem` (16px default) — respects Android system font scale. Layouts must remain usable at 1.3× and 1.5× font scale (text wraps, bubbles grow, no overflow clipping).
- Touch targets: minimum **44×44px** for ALL interactive elements — speaker icons, suggestion chips, reply buttons, tab bar items, mic button, send button, back arrow, game answer buttons, interest tiles, tag filter chips, compose FAB, and every other tappable element in the app
- Speaker icon on ChatBubble: rendered as a standalone button below the bubble, not inline with text — tap target is 44×44px regardless of icon size
- High contrast maintained (WhatsApp default palette)
- Back button (← chevron) visible on every sub-screen header
- No timed interactions that disappear before elderly users can act
- Researcher Mode toggle protected by 3-tap sequence + confirmation dialog to prevent accidental activation
- Error messages in plain, calm language: "Could not connect. Please try again." — no raw error codes shown to users
- Suggestion chips on story compose: each chip min 44×44px tap target, word-wrap permitted
