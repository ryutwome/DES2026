# DES2026 — Social Connection Depth
**Date:** 2026-03-21
**Objective:** Help elderly Indian users (60–80) form and maintain quality digital social connections via Stories, Communities, Voice Rooms, and Games.
**Design lens:** Every change must make the app feel like real people who notice you, remember you, and reach out to you.

---

## 1. Story Reactions

### Problem
Tapping "Reply" to a story requires composing a full message — too high a barrier for a 70-year-old who just wants to say "beautiful." The existing action gap kills social reciprocity.

### Solution
Add a one-tap 🙏 reaction button on every story card (feed) and in the story thread. Reactions are stored on the story object. The card and thread show a reaction summary: "Meenakshiamma and 2 others reacted 🙏".

### Data changes
- Add `reactions: {}` to story objects. Key = personaId or `'user'`, value = `true`.
- `hasReacted(storyId)` helper — returns whether current user has reacted.
- `toggleReaction(storyId)` — adds or removes user reaction, persists via `setState`.

### UI changes
- Story card: small 🙏 button (min 44×44px) in bottom-right of card, beside the existing Reply button. Shows reaction count if > 0.
- Story thread: same button below the story body.
- When user reacts, the button fills/highlights immediately (optimistic update).
- Reaction summary text: if 0 reactions — hidden. If 1 — "Meenakshiamma reacted 🙏". If 2+ — "[Name] and N others reacted 🙏". Show first reactor = most recent AI reactor, or the user if they reacted.
- AI personas auto-react to some stories on seed: 1–2 personas react to each AI-authored story on first load (seeded in `seedInitialData`).

### AI reaction timing fix
Current: AI reactions arrive 5–10 seconds after post — suspiciously fast. Fix: first AI reaction after 45–120s (random), second after 3–8 minutes (random). Change `triggerStoryReactions` delay in `screens-stories.js`.

### Suggestion chip fix
Current chips fill in the chip label text literally ("Share a recipe memory: "). Replace each chip's fill-in text with a real example sentence the user can edit:
- "Share a recipe memory" → "My mother used to make sambar every Sunday morning. The smell would wake the whole house..."
- "Your neighbourhood growing up" → "Our street in those days had a banyan tree at the corner where all the children would play after school..."
- "A film that changed you" → "The first time I saw Sholay I must have been twenty. We went as a family to the cinema..."
- "A festival memory" → "Every Diwali my father would light the whole terrace with diyas. We children were in charge of the rangoli..."

---

## 2. Community: Multi-Persona Threading

### Problem
User posts in a community → one AI responds → silence. Feels like a support ticket, not a community.

### Solution
When user posts in any community, trigger 2–3 AI personas to respond in sequence. Personas sometimes reply to each other, not just to the user. Timing: first response 8–15s, second 25–45s, third (optional, 60% chance) 55–90s.

### Data flow
`triggerCommunityReplies(commId, userMessage)` — new function in `app.js`. Picks 2–3 personas from `community.personas` (or all if fewer than 3). Calls `callClaudeForCommunity` for each in sequence with a delay. For the second and third responder, include the previous AI reply as context so they can reference it.

### Daily prompt
Once per day, the first persona in each joined community posts a prompt. Stored as `S.lastDailyPrompt[commId]` (date string). On community open, if last prompt was not today, inject a prompt message at the top of the feed. Prompt generated via AI with context: community topic + "ask a warm, open question to get the group talking."

No API call on every open — generate prompt once, cache in `S.dailyPrompts[commId]` alongside the date. Only regenerate next day.

---

## 3. Voice Room: Entry Greeting

### Problem
User enters a voice room and is invisible — the conversation continues as if they weren't there. For a lonely elderly user this recreates the exact feeling of isolation they're trying to escape.

### Solution
3–5 seconds after entering a voice room, one persona acknowledges the user by name. The greeting references the last topic in the transcript.

### Implementation
In `renderVoiceRoom`, after the room mounts and starts the transcript loop, set a one-time timeout (3000–5000ms random). Pick the first persona in the room. Generate a greeting via `callClaude` with extra note:
> "The user [name] has just joined the voice room. Greet them warmly and briefly by name, reference the topic being discussed (from recent lines: [last 2 transcript lines]). One sentence only."

Append this as a transcript line with a `isGreeting: true` flag (for styling — subtle teal highlight).

Only trigger on initial entry, not on page re-renders. Use a `_greetingTriggered` flag scoped to the room session.

---

## 4. Voice Room: Room Card Preview

### Problem
Room cards show name + theme tag but nothing about the current conversation. User can't tell if entering is worth it.

### Solution
Show the last line of each room's transcript on the room card. If no transcript yet: show the room theme description.

### Implementation
In `renderVoiceRooms`, when building each room card, read `AppState.voiceRooms[room.id]?.transcript`. If transcript exists and has entries, take the last entry and show: `"[PersonaName]: [text truncated to 60 chars]"`. Style: small, grey, italic — clearly secondary info below the theme tag.

---

## 5. Daily Game Challenge

### Problem
Games are always user-initiated. The AI never reaches out. Real social connection requires the other person to think of you first.

### Solution
Once per day, one persona sends the user a game challenge message in their 1-on-1 chat. The message is conversational and includes an inline "Accept" button that navigates directly to the game.

### Implementation
- Store `S.lastGameChallenge` as a date string (YYYY-MM-DD).
- On app load (after `renderChats`), if `lastGameChallenge !== today`, pick a random persona the user has chatted with (fallback: Rameshbhai). Pick a random game type. Generate a challenge message via AI: casual, persona-voiced, ends with a question about playing.
- Append the message to that persona's chat as an AI message, with `type: 'game-invite'` and `gameType` field.
- In `renderChat`, render `game-invite` type messages as a special bubble: the message text + a teal "Play [Game Name] →" button that calls `showGameSheet(personaId)` with the game type pre-selected.
- Set `S.lastGameChallenge = today` and persist.
- Only trigger if `AppState.apiKey` exists (app is active, not demo mode).

---

## Implementation Order

1. Story reactions — `app.js` (toggle/helper) + `js/screens-stories.js` (UI) + seed reactions
2. AI reaction timing fix — `js/screens-stories.js` (delay change)
3. Suggestion chip fix — `js/screens-stories.js`
4. Community multi-persona threading — `app.js` (`triggerCommunityReplies`)
5. Community daily prompt — `app.js` + `js/state.js` (state schema)
6. Voice room entry greeting — `app.js` (`renderVoiceRoom`)
7. Voice room room card preview — `app.js` (`renderVoiceRooms`)
8. Daily game challenge — `app.js` (challenge trigger + game-invite bubble render)

---

## Out of Scope
- Voice differentiation via TTS (platform limitation — Web Speech API voices are system-dependent)
- Story notification system (no push notifications in PWA on GitHub Pages without service worker push)
- Leaderboard / spectator mode for games
