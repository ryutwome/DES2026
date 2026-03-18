# DES2026 — Design Audit & Improvement Roadmap
**Date:** 2026-03-18
**Author:** Claude (autonomous session)
**App:** WhatsApp-inspired social PWA for elderly Indian users (65–75)

---

## 1. What This App Is

A WhatsApp prototype designed for elderly Indian users living in Mumbai apartment societies. The research hypothesis: **can AI-powered personas + community features reduce social isolation in this demographic?**

Core features: AI persona chats, community group chats, Stories feed (content sharing), Status (ephemeral images), Voice Rooms (live audio discussion), Games (Antakshari, Bollywood trivia).

Stack: Vanilla JS PWA, no build step. `app.js` (~1800 lines), `style.css` (~900 lines), `index.html`. Claude API via Cloudflare Worker proxy.

---

## 2. Audit Findings — What's Working Well

- **Persona depth**: Each of the 8 personas has rich system prompts, language mixing, fallback messages. The characters feel real.
- **Voice features**: STT/TTS integration is solid. Recording overlay with waveform is polished.
- **Chat experience**: Message bubbles, typing indicator, date separators, double-ticks — genuine WhatsApp feel.
- **Stories architecture**: The recent Reddit-style redesign (title + thumbnail + thread screen) is the right direction.
- **Communities**: Tag filtering, join/leave, community-specific AI personas responding to context — good.
- **Service worker**: Cache versioning pattern correctly busts stale caches on deploy.

---

## 3. Audit Findings — Gaps & Problems

### 3.1 Accessibility — Critical for the Target User
The single biggest risk is that elderly users with declining eyesight, mild tremor, or cognitive load will struggle. Current issues:
- **Font sizes**: Body text at 14–15px is too small for 65–75 year olds. WhatsApp India defaults to larger. No user-adjustable size.
- **Touch targets**: Most buttons meet 44px min, but some inline buttons (story delete, reply) are borderline.
- **No font size preference**: Users cannot increase text size within the app.
- **Contrast**: Some elements (#8696a0 on white) are borderline WCAG AA.

### 3.2 First-Run Experience
- Onboarding is **dead code** — the app auto-seeds and skips it entirely (line 515: `if(!S.onboardingDone){set({...});}`). If a researcher deploys this, users never see the onboarding screen.
- No **user name** is ever collected. "You" is used everywhere. Personas cannot address the user by name. This is a significant warmth gap — Indian elders expect to be addressed by name.
- No **language preference** — the app defaults to English STT (`en-IN`) but some users may prefer Hindi-dominant responses.

### 3.3 Story Compose — Incomplete
- The AI "Polish" button generates a title, but **if the user types directly and posts without polishing**, the story has no title. `mkStory` falls back to `s.title||s.text.slice(0,60)` in `buildStoryCard` — but the stored title field is empty, so the thread screen also shows no title.
- **No image for user-posted stories**. The compose sheet doesn't offer any image. The thread screen looks sparse for user stories. Could offer Unsplash topic search or a category picker that maps to a curated image.

### 3.4 Stories — UX Issues
- `renderStoryComments` and `toggleStoryComments` are dead code — they were part of the inline comments system that was replaced by the thread screen, but the functions remain and `renderStoryComments` is still called from `toggleStoryComments`. No UI triggers these anymore, but they waste space and could confuse.
- The **stories thread screen** scrolls to bottom on load, which means for a story with no replies the scroll is fine, but for stories with many replies you jump past the post body. Should scroll to replies start, not absolute bottom.

### 3.5 Navigation & Back Stack
- The `_stack` router is minimal — navigating to `#/story` then back goes to `#/stories` correctly, but the stories screen doesn't remember the scroll position or active filter. This is jarring.
- `filterChats` function is named but the actual implementation is `filterChips` (line 849) — inconsistent naming, `filterChats` is called in the HTML but it's actually `filterChips`.

### 3.6 Unread Badge Logic
- `S.unreadChats` is never populated by AI responses — it's only cleared when opening a chat (line 844). So the badge on the Chats nav tab never shows any unread count even though messages arrive.

### 3.7 Games — `gameTypes` object missing `id` field
- Line 1742: `selType=gt.id` — but `gameTypes` values don't have an `id` property. `gt.id` is always `undefined`. Games can never actually start from the sheet because `selType` is always `undefined`.

### 3.8 Status Viewer — Cosmetic
- The `statusReact` function references `overlay.id` in the `onclick` but `overlay.id` is set after the `innerHTML` assignment, so the `onclick="statusReact('${personaId}','${overlay.id}')"` in the innerHTML will have the empty string for overlay.id. The function doesn't actually use the second argument, so it works by accident.

### 3.9 CSS / Design Consistency
- `header--white` is used on Stories, Story Thread, but Communities and Voice Rooms still use green header — inconsistent. WhatsApp 2026 uses white headers everywhere except the main chats screen (where the title is green text on white).
- Story card: `story-ring--xs` uses `transform: scale(0.85)` which causes the ring to overlap adjacent text. Should use explicit sizing instead.
- No loading / skeleton states anywhere. When API calls are in flight, the user just sees nothing. Even a simple shimmer or spinner on the story thread "Replies" section while an AI reply is generating would help.

---

## 4. Prioritized Improvements

### Priority 1 — Fix broken things (bugs)
1. **`gameTypes` missing `id`** — games are completely broken, trivial fix
2. **Unread badge never increments** — add `S.unreadChats[personaId]++` in `renderChat` when AI message arrives and user isn't in that chat
3. **Story title missing for non-polished posts** — auto-generate title client-side from text if empty on post
4. **Dead `filterChats` / `filterChips` naming** — consolidate

### Priority 2 — User name & warmth
5. **Collect user's name on first run** — simple one-screen prompt, store as `S.userName`. Pass `userName` into persona system prompts so they can address the user.
6. **Display user name** in chat header ("You" → their name) and in story byline.

### Priority 3 — Font size accessibility
7. **Font size toggle** — three levels: Normal (16px base), Large (19px), Extra Large (22px). Stored in `S.fontSize`. Applied as a CSS class on `#app`. Accessible via a Settings bottom sheet reachable from the More menu.

### Priority 4 — Story compose image
8. **Category → Unsplash image picker** in story compose: 6 category buttons (Food, Nature, Faith, Cricket, Music, Memory) each mapping to a curated Unsplash URL. One tap sets the story image. No extra API cost.

### Priority 5 — Polish
9. **Consistent white headers** across all tabs
10. **AI reply loading indicator** in story thread (spinner in replies section while AI is thinking)
11. **Story scroll fix** — scroll to first reply, not bottom, so post body is visible
12. **Remove dead comment functions** `toggleStoryComments` / `renderStoryComments`

---

## 5. Implementation Plan for This Session

Given the ~1 hour window and budget constraint, I'll implement in this order:

**Batch A — Bugs (30 min):**
- Fix `gameTypes` id
- Fix unread badge increment
- Auto-generate story title from text on post
- Fix `filterChats` naming

**Batch B — User name (15 min):**
- Add name prompt to first run (replaces the dead onboarding gate)
- Thread name through to persona system prompts
- Show name in UI

**Batch C — Font size + Settings (15 min):**
- Three-level font size toggle
- Settings bottom sheet from More menu on Chats screen
- CSS variable approach for scaling

---

## 6. Deferred (for future sessions with user)

- Category image picker in story compose (needs design approval on categories)
- White headers across all tabs (visual change, user should see it)
- Skeleton/loading states (significant effort)
- Story scroll fix (low impact)
- Dead code removal (safe but user should know)

---

## 7. Research Observations

From the codebase and conversation history, the user (researcher) is building this to study social isolation in elderly Indian apartment society residents. Key design tensions:

1. **AI transparency vs. immersion**: The "Researcher Mode" triple-tap easter egg suggests the researcher needs to occasionally reveal the AI nature to study participants. The personas are intentionally opaque to users but the researcher needs a quick toggle.

2. **Voice-first design**: The STT/TTS investment is high. This is correct for the demographic — typing is a barrier for many elderly Indian users. The recording overlay with waveform is genuinely thoughtful.

3. **Community over individual**: The app's thesis seems to be that *community belonging* (society groups, shared interests) matters more than 1:1 chat for this demographic. The communities and voice rooms reinforce this.

4. **Language mixing**: The persona system prompts carefully replicate how educated urban Indian elders actually communicate — code-switching between English and regional language, the specific emoji set (🙏🌹), WhatsApp "forward" culture. This level of cultural authenticity is rare and valuable.

**Recommendation**: The next major design investment after fixing bugs and accessibility should be a **daily routine** feature — a gentle morning/evening check-in from a persona ("Good morning! Had your chai? 🙏") that doesn't require the user to initiate. This directly addresses the isolation use case and mirrors how real elderly WhatsApp groups work (the "Good morning" forward culture).
