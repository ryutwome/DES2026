# WhatsApp 2026 UI Design Spec
**Date:** 2026-03-18
**Scope:** Full UI pass to match real WhatsApp 2026 Android as closely as possible, adapted for this app's 5 custom tabs
**Reference:** `/reference/whatsapp ui screenshots/` — 7 real screenshots taken 2026-03-18

---

## 1. Design Principles

1. **Green header on Chats tab only** — `#00A884` green header on the Chats home screen (deliberate iconic deviation from real WA). All other tab home headers (Stories, Communities, Voice, Games) use **white header with dark `#111b21` text** — matching real WA's Updates/Communities/Calls screens.
2. **Material You throughout** — pill-shaped active states, rounded squares for FABs, `#d9fdd3` tint for active elements.
3. **Lucide icons** — replace all nav/tab icons with Lucide. Keep existing custom SVGs (ticks, waveform, speaker).
4. **White body** — everything below the header is white with `#111b21` text.
5. **No top tab bar anywhere** — the old green sub-tab bar (Chats/Stories/Communities/Voice/Games across the top) is removed entirely. Bottom nav is the only navigation.

---

## 2. Color Tokens

Canonical values. Replace ALL hardcoded instances of old values in `style.css`.

| Token | Value | Usage |
|-------|-------|-------|
| `--wa-green` | `#00A884` | Chats header bg, active tab icon/label, unread badge, FAB, active chip border/text |
| `--wa-green-tint` | `#d9fdd3` | Active tab pill bg, active filter chip bg, sent bubble bg. **Replaces all `#d8fdd2` and `#d9fdd3` variants — canonize to `#d9fdd3`.** |
| `--wa-green-dark` | `#075E54` | PWA `theme-color` meta tag only |
| `--wa-surface` | `#ffffff` | App body, chat list, all non-Chats tab headers |
| `--wa-bg-chat` | `#efeae2` | Chat screen wallpaper base color |
| `--wa-text-primary` | `#111b21` | Names, body text, white-header titles |
| `--wa-text-secondary` | `#667781` | Timestamps, preview text, placeholders |
| `--wa-text-icon` | `#54656f` | Inactive nav icons and labels |
| `--wa-divider` | `#e9edef` | Chat list row dividers, bottom nav border |
| `--wa-input-bg` | `#f0f2f5` | Search bar bg, message input bg |
| `--wa-bubble-sent` | `#d9fdd3` | Sent message bubble |
| `--wa-bubble-recv` | `#ffffff` | Received message bubble |
| `--wa-tick-read` | `#53bdeb` | Double tick (read) |
| `--wa-tick-sent` | `#667781` | Double tick (delivered, unread) |
| `--wa-unread-time` | `#00A884` | Timestamp when chat has unread messages |

### Full find-and-replace list for `style.css`

Every hardcoded occurrence of these values must be updated:

| Find | Replace with | Notes |
|------|-------------|-------|
| `#008069` | `#00A884` | All 12+ occurrences: `.header`, `.banner--install`, `.section-heading`, `.onboarding-header`, `.setup-screen__btn`, `.setup-screen__input-wrap:focus-within`, `.story-card__reply-btn`, `.story-card__read-more`, `.game-card__meta`, `.voice-bubble__bar--active`, `.bubble__speaker--playing`, `.tag-chip--filter.active`, `.interest-tile.selected .interest-tile__label`, `.compose-textarea:focus` |
| `#25D366` | `#00A884` | Nav active, unread badge, `.recording-overlay__bar`, `.recording-overlay__send`, `.compose-post-btn`, `.start-game-btn`, `.sheet-confirm-btn`, `.onboarding-screen__cta`, `.setup-screen__logo`, `.status-avatar-ring`, `.participant-tile__ring.speaking`, `.voice-room-input__mic` |
| `#d8fdd2` | `#d9fdd3` | Filter chips, tag chips, selected interest tiles — consolidate to single tint value |

---

## 3. Typography

All text: `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif`. Sizes in `rem`.

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Chats header title ("WhatsApp") | `1.5rem` (24px) | 700 | `#ffffff` |
| White header title (other tabs) | `1.1875rem` (19px) | 600 | `#111b21` |
| Sub-screen header title (chat, community) | `1.1875rem` (19px) | 600 | `#ffffff` |
| Chat name in list | `1rem` (16px) | **600** (was 400) | `#111b21` |
| Chat preview text | `0.875rem` (14px) | 400 | `#667781` |
| Timestamp | `0.75rem` (12px) | 400 | `#667781` or `#00A884` (unread) |
| Filter chip label | `0.875rem` (14px) | 500 | varies |
| Nav tab label | `0.6875rem` (11px) | 400 (500 active) | `#54656f` or `#00A884` |
| Message bubble text | `0.9375rem` (15px) | 400 | `#111b21` |
| Bubble timestamp | `0.6875rem` (11px) | 400 | `#667781` |
| Sender name (group bubble) | `0.8125rem` (13px) | 600 | persona color |

---

## 4. Icons

**Library:** Lucide (`https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`)
Load with `defer` in `<head>` to prevent race with first render.
**Initialization:** call `if (window.lucide) lucide.createIcons()` after every DOM render that inserts `<i data-lucide="...">` elements.
**Sizes:** 22×22px header/nav · 20×20px inline actions · 18×18px small indicators
**Color:** Lucide uses `currentColor` — do NOT use `fill` overrides on Lucide SVGs. Remove any existing `fill` overrides from `.bottom-nav__tab svg` etc.

### Nav Tab Icons

| Tab | Lucide name |
|-----|------------|
| Chats | `message-square` |
| Stories | `circle-play` |
| Communities | `users-round` |
| Voice Rooms | `mic` |
| Games | `gamepad-2` |

### Header Icons

| Action | Lucide name |
|--------|------------|
| Back | `arrow-left` |
| Search | `search` |
| More menu | `more-vertical` |
| Video call | `video` |
| Phone call | `phone` |

### Inline Icons

| Action | Lucide name |
|--------|------------|
| Archived | `archive-restore` |
| Pin | `pin` |
| Muted | `bell-off` |
| Attach | `paperclip` |
| Emoji | `smile` |
| Camera | `camera` |
| Send | `send` |
| Mic | `mic` |
| Close | `x` |
| Plus/Add | `plus` |
| FAB new chat | `message-circle-plus` |
| Payment/Rupee (input bar) | `indian-rupee` (Lucide) |

**Keep as custom SVG (do NOT replace):**
- Single tick / double tick (precise WhatsApp shape)
- Waveform bars (dynamically generated)
- Speaker/TTS button

---

## 5. Screens

### 5.1 Chat List — `#/chats`

#### Header (green `#00A884`)
- Height: `56px + env(safe-area-inset-top)`
- Row 1: "WhatsApp" `24px 700 #fff` left · `search` + `more-vertical` icons right (44×44px each)
- Row 2 (inside green header): search bar with `background: rgba(255,255,255,0.15)`, `border-radius: 24px`, `padding: 10px 16px`, `margin: 0 8px 10px`. Contains `search` icon (18px, `rgba(255,255,255,0.7)`) + placeholder "Search" (`rgba(255,255,255,0.7)`).

#### Filter chips (white background, below header)
- `padding: 8px 16px 10px`, `gap: 8px`, horizontal scroll, `scrollbar-width: none`
- Chips: **All** · Unread · Favorites · Groups
- Active: `background #d9fdd3`, `border: 1.5px solid #00A884`, `color #00A884`
- Inactive: `background #fff`, `border: 1.5px solid #e9edef`, `color #111b21`
- `border-radius: 20px`, `padding: 6px 14px`, `font-size: 14px weight 500`

#### Chat list body
- **Archived row:** `padding: 12px 20px gap 16px`. Icon: `archive-restore` 22px `#667781`. Text: "Archived" `16px #111b21`. Count right-aligned `14px #667781`. No divider line.
- **Chat rows:** `padding: 10px 16px`, `gap: 14px`
  - Avatar: 50×50px circle
  - Name: `16px 600 #111b21`
  - Pin icon: `pin` 13px `#8696a0`, placed **after timestamp** in the name row (not a section label)
  - Preview row: ticks SVG + preview text + right meta (unread badge or bell-off icon)
  - Divider: `0.5px solid #e9edef` starting at `left: 78px` (right of avatar) to screen edge
  - Unread badge: `background #00A884`, white text, `border-radius: 10px`, `min-width 20px height 20px padding 0 5px`
  - Timestamp color: `#00A884` when unread, `#667781` otherwise

#### FAB
- `width: 56px height: 56px border-radius: 16px` — **rounded square**, not circle
- `background: #00A884`, icon `message-circle-plus` 26px white
- `position: absolute; bottom: calc(72px + env(safe-area-inset-bottom, 0px)); right: 16px`
- `box-shadow: 0 4px 16px rgba(0,168,132,0.4)`

---

### 5.2 Bottom Navigation

**Replaces the top tab bar entirely.** 5 custom tabs.

```
Container:
  background: #fff
  border-top: 1px solid #e9edef
  display: flex; justify-content: space-around; align-items: flex-end
  padding: 6px 0 env(safe-area-inset-bottom, 12px)

Each tab (.nav-tab):
  display: flex; flex-direction: column; align-items: center; gap: 2px
  flex: 1; cursor: pointer

  Pill div (.nav-icon-pill) — contains ICON ONLY, label is a SIBLING outside the pill:
    border-radius: 16px
    padding: 4px 14px
    min-width: 48px
    display: flex; align-items: center; justify-content: center
    position: relative  (for badge positioning)
    Active: background #d9fdd3; color #00A884
    Inactive: no background; color #54656f

  Unread badge (.nav-badge):
    position: absolute; top: -1px; right: 6px
    background #00A884; color #fff
    border-radius: 8px; font-size: 9px; font-weight: 700
    min-width: 14px; height: 14px; padding: 0 3px

  Label (.nav-label) — OUTSIDE and BELOW the pill div:
    font-size: 11px
    Active: color #00A884; font-weight: 500
    Inactive: color #54656f; font-weight: 400
```

---

### 5.3 Sub-screen Headers (Chat, Community, Story detail, Voice Room, Game)

These are screens reached by navigating INTO a chat/community/etc. — not top-level tab screens.

- **Green `#00A884`** header (consistent with WhatsApp's pattern for conversation screens)
- Left: `arrow-left` back button (44×44px) + avatar (40px circle) + name+subtitle column
- Right: action icons (video + phone for 1-on-1 chat; more-vertical for others)
- Title: `19px 600 #fff`
- Subtitle: `13px #fff opacity-0.85`

---

### 5.4 Top-level Tab Headers (Stories, Communities, Voice, Games)

These are the home screens of each custom tab — **not** the Chats tab.

- **White `#ffffff`** header (matches real WA's Updates/Communities/Calls screens)
- Title: `19px 600 #111b21`
- Right icons: `search` + `more-vertical`, color `#111b21`
- Height: same `56px + env(safe-area-inset-top)`
- Border-bottom: `1px solid #e9edef`

---

### 5.5 Chat Screen — `#/chat/:personaId`

**Header:** green, sub-screen style (Section 5.3)

**Wallpaper:**
- `background-color: #efeae2`
- Repeating SVG doodle pattern tile at `opacity: 0.06` (keep existing implementation, just confirm opacity value)
- Pattern is the existing 3-circle dot motif — acceptable, no change needed

**Message bubbles:**
- Sent: `background #d9fdd3`, `border-radius: 8px 0px 8px 8px` (flat top-right = tail side)
- Received: `background #ffffff`, `border-radius: 0px 8px 8px 8px` (flat top-left = tail side)
- Tail: CSS `::before` pseudo-element triangle (keep existing implementation)
- Padding: `6px 9px 6px 9px`
- Max-width: `85%`
- Timestamp + ticks: `11px #667781`, inline bottom-right of bubble text

**Input bar (matches screenshot layout):**
```
Row layout:
  [ smile icon ]  [ pill: text field ]  [ mic/send FAB ]

Pill (flex: 1, background #f0f2f5, border-radius: 28px, padding: 6px 12px):
  Inside pill left-to-right: text field | paperclip icon | payment/rupee icon | camera icon

Mic/Send FAB (outside pill, right side):
  width: 48px; height: 48px; border-radius: 14px; background: #00A884
  When empty: mic icon (white)
  When text present: send icon (white)
```
The emoji `smile` icon is outside-left of the pill. Attach/camera/payment icons are inside the pill right side. The mic/send button is a separate rounded-square green button outside-right of the pill.

---

### 5.6 Communities Tab — `#/communities`

**Header:** white (Section 5.4), title "Communities"

**Layout — accordion style matching screenshots:**
```
Top row: "New community" — grey rounded-square icon (80px, #f0f2f5) with green "+" badge
  Tap → create community flow (not implemented, show toast)

Per joined community:
  Community header row:
    - Colored rounded-square icon (56×56px, color varies per community)
    - Community name: 17px 600 #111b21
    - Full-width divider above this row

  Indented group rows (each group within the community):
    - Group avatar (40px circle or square)
    - Group name: 15px 500 #111b21
    - Timestamp right
    - Preview text: 13px #667781
    - Unread badge if applicable
    - Tapping navigates to #/community/:id

  "View all" chevron row if community has >3 groups (not applicable for current data structure)

Full-width divider between communities
```

Remove the existing Joined/Discover top sub-tab switcher entirely. Replace "Discover" functionality with a filter chip or search if needed.

---

### 5.7 Community Feed Sub-screen — `#/community/:id`

Inherits green sub-screen header (Section 5.3):
- Title: community name, `19px 600 #fff`
- Subtitle: member count, `13px #fff opacity-0.85`
- Right: `more-vertical` icon

Body: group chat bubble layout (same as chat screen). Sender name shown above received bubbles in persona color (`13px 600`). No structural layout changes needed beyond color token update.

---

### 5.8 Voice Rooms (`#/voicerooms`) & Games (`#/games`)

- Apply white headers (Section 5.4)
- Apply `#00A884` color token (replaces `#008069` / `#25D366`)
- Apply Lucide icons
- No structural layout changes

---

## 6. Removed Patterns

| What | Replacement |
|------|-------------|
| Green top sub-tab bar | Bottom nav only |
| Underline active tab indicator | Pill active state |
| `#008069` everywhere | `#00A884` |
| `#25D366` everywhere | `#00A884` |
| `#d8fdd2` variant | `#d9fdd3` (canonical) |
| Emoji placeholders in nav | Lucide SVG icons |
| Communities Joined/Discover tab switcher | Removed; layout restructured |
| `fill` overrides on nav SVGs | Removed; use `currentColor` |

---

## 7. What NOT to Change

- Chat bubble tail shape CSS (keep `::before` pseudo-element approach)
- Avatar color palette (8-color deterministic hash)
- Waveform SVG (dynamically generated, keep custom)
- Tick SVG paths (keep custom, precise shape)
- Touch target minimums (44×44px — keep enforced everywhere)
- Safe-area `env()` insets (keep all)
- All JS logic, routing, state, API integration — **UI-only pass**
- Existing wallpaper SVG pattern (keep, just confirm opacity `0.06`)

---

## 8. Implementation Checklist

### Setup
- [ ] Add Lucide CDN to `index.html` with `defer`: `<script defer src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>`
- [ ] Remove any `fill` override CSS rules targeting nav SVG icons

### Colors — global find/replace in `style.css`
- [ ] Replace all `#008069` → `#00A884` (see Section 2 table for all locations)
- [ ] Replace all `#25D366` → `#00A884` (see Section 2 table)
- [ ] Replace all `#d8fdd2` → `#d9fdd3`

### Bottom Nav
- [ ] Rewrite `.bottom-nav` HTML: pill div contains **icon only**, label is a sibling below the pill
- [ ] Active state: pill gets `background: #d9fdd3`, icon `color: #00A884`
- [ ] Add unread badge inside pill div (positioned absolute)
- [ ] Remove old underline/border-bottom active indicator
- [ ] Update all 5 nav tabs to use `<i data-lucide="...">` icons

### Headers
- [ ] Chats home: keep green, update to `#00A884`, add inline search bar (`rgba(255,255,255,0.15)` pill)
- [ ] Stories/Communities/Voice/Games home: switch to white header, dark text
- [ ] Sub-screens (chat, community feed, etc.): keep green `#00A884`
- [ ] Remove top sub-tab bar HTML from all screens

### Chat List
- [ ] Update chat name `font-weight` to `600` (from `400`)
- [ ] Add filter chips row (All, Unread, Favorites, Groups)
- [ ] Add Archived row above chat list items
- [ ] Move pin indicator to right of timestamp (not section label)
- [ ] FAB: change `border-radius` to `16px` (rounded square), update `bottom` to use calc with safe-area

### Chat Screen
- [ ] Fix input bar layout: emoji outside-left, pill contains field+icons, mic/send FAB outside-right
- [ ] Confirm bubble colors use `#d9fdd3` sent, `#ffffff` received

### Communities
- [ ] Remove Joined/Discover tab switcher
- [ ] Restructure layout: community header row + indented group rows

### Icons
- [ ] Replace nav tab SVGs in `icons.js` and component HTML with Lucide `<i data-lucide>` tags
- [ ] Call `if (window.lucide) lucide.createIcons()` in every render function that adds Lucide icons
- [ ] Keep tick, waveform, speaker as custom SVG
