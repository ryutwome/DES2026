# DES2026 — North Star Polish
**Date:** 2026-03-21
**Goals:** North Star 2 (WhatsApp UI fidelity) + North Star 4 (Consistent experience)

---

## Scope

Two independent work streams tackled in one pass. No new features — only fixing broken things and closing visual gaps between the prototype and real WhatsApp.

---

## Stream A — Broken Things (Goal 4)

### A1. Games completely broken
`gameTypes` array objects have no `id` field. When user picks a game type, `selType = gt.id` is always `undefined`. Games can never start.

**Fix:** Add `id` field to each `gameType` object in `app.js` (or wherever `gameTypes` is defined).

### A2. Unread badge never increments
`S.unreadChats` is only cleared (on chat open), never set. The Chats tab badge always shows 0.

**Fix:** In the AI message handler (where an incoming persona message is appended to `AppState.chats`), if the current screen is not `#/chat/:personaId`, increment `AppState.unreadChats[personaId]`. Persist. The existing clear-on-open logic is correct and stays.

### A3. Story title blank on direct post
If user types in the compose sheet and posts without tapping "Polish", `story.title` is empty string. `buildStoryCard` uses `s.title || s.text.slice(0,60)` — so the card shows truncated text as title. But the thread screen also shows no title.

**Fix:** In the post handler, before creating the story object, if `title` is empty, auto-generate: `title = text.split(' ').slice(0, 8).join(' ') + (text.split(' ').length > 8 ? '...' : '')`. Simple, client-side, no API call.

### A4. Dead code — filterChats/filterChips naming mismatch
`filterChats` is referenced in markup but the actual function is `filterChips`. This causes a JS error on keystroke in the Communities Discover search.

**Fix:** Rename the function call in the HTML string to match the actual function name `filterChips`. Or rename the function to `filterChats` — whichever is the single reference point.

### A5. Dead code — toggleStoryComments / renderStoryComments
These functions are never triggered from any UI but `renderStoryComments` is called from `toggleStoryComments`. They are vestigial from an old inline comments design. Safe to delete.

**Fix:** Remove both functions from `app.js`.

---

## Stream B — WhatsApp UI Fidelity (Goal 2)

### B1. Header colour inconsistency
Real WhatsApp (2024+): white headers everywhere except the main Chats list (which uses `#075E54` green). Current prototype: Communities and Voice Rooms screens still render green headers.

**Fix:** Switch Communities list, Community detail, Voice Rooms list, Voice Room detail headers to white (`#FFFFFF`) with dark text and icons (`#111B21`). Match the `header--white` pattern already used on Stories.

### B2. Chat list header — make it match WhatsApp exactly
Real WhatsApp chat list header: "WhatsApp" title left-aligned (or the app name), camera icon + search icon + three-dot menu right side. Current header is centered title.

**Fix:** Left-align the title text on the Chats screen header. Ensure the three action icons (camera, search, more) are on the right.

### B3. Bottom nav — active tab indicator
Real WhatsApp: active tab has icon + label in white (on green background) or teal underline depending on version. Check the current implementation matches — if the active state only highlights the label but not the icon, fix both.

### B4. Story compose — image picker
User-posted stories currently have no image. Cards look sparse. Add a one-tap category image picker in the compose sheet: 6 category buttons (Food, Nature, Faith, Cricket, Music, Memory) mapping to curated Unsplash URLs. Selecting a category sets `story.image`. No API cost.

Category → Unsplash URL map:
- Food: `photo-1546069901-ba9599a7e63c`
- Nature: `photo-1447752875215-b2761acb3c5d`
- Faith: `photo-1507692049790-de6a72a1a862`
- Cricket: `photo-1531415074968-036ba1b575da`
- Music: `photo-1493225457124-a3eb161ffa5f`
- Memory: `photo-1516450360452-9312f5e86fc7`

All at `?w=800&h=600&fit=crop` — landscape, matches AI story cards.

---

## Implementation Order

1. A1 — Fix gameTypes id (5 min, trivial)
2. A2 — Fix unread badge (10 min)
3. A3 — Fix story title (5 min)
4. A4 — Fix filterChats naming (5 min)
5. A5 — Remove dead comment code (5 min)
6. B1 — Fix header colours (20 min)
7. B2 — Left-align chat list title (5 min)
8. B3 — Verify bottom nav active state (10 min)
9. B4 — Story compose image picker (20 min)

---

## Out of Scope

- Loading/skeleton states (significant effort, future session)
- Story scroll position fix (low impact)
- Status viewer overlay.id timing bug (works by accident, low risk)
- Back-stack scroll restoration (navigation concern, future session)
