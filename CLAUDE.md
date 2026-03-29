# Project Instructions

## Planning

Use **planning-with-files** (`/planning`) for any multi-step task. It's the only planning method — not `TodoWrite`, not superpowers' write-plan. Skip for simple fixes or single-file edits.

## Before Every Commit

### 1. Remove debug code
- Remove all `#if DEBUG` / `#endif` blocks added for debugging
- Remove any `print(...)` statements added for debugging
- Remove any temporary logging, breakpoint helpers, or test harnesses
- Exception: debug code that was already present before your changes and is intentional (ask if unsure)

### 2. Comments must be concise with what/why/how
- Only applies to comments in code you changed — don't touch unrelated comments
- Every non-obvious comment should answer: **what** it does, **why** it exists, and **how** it works
- Delete filler comments ("// helper", "// TODO: remove") unless they carry meaningful context
- Keep comments short — one to three lines max per block

### 3. No Unicode emoji — use image files only
- **Never use Unicode emoji characters** (🙏, 😄, 🎵, etc.) anywhere in rendered HTML or JS strings
- All emoji must be rendered via `ej('name')` (returns an `<img>` tag) from `js/emoji.js`
- Emoji SVG images live in `/emojis/*.svg` — 36 images named with human-readable names (prayer, smile, music, etc.)
- The full character→filename map is in `EMOJI` in `js/emoji.js`
- To render emoji in plain text (e.g. AI message content), call `renderEmoji(text)` before inserting into innerHTML
- To add a new emoji: download the SVG to `/emojis/`, add it to `EMOJI` in `js/emoji.js`, and add it to the service worker cache in `service-worker.js`
- Unicode emoji are still allowed inside system prompt strings in `data.js` (these are instructions sent to the AI, never rendered to DOM)

### 4. Confirm commit message before committing
- Show the proposed commit message to the user and **wait for explicit approval** before running `git commit`
- Do not commit until the user says yes (or provides an alternative message)
