# DES2026 Community

A WhatsApp-style social prototype for design research at IDC, IIT Bombay — studying how retired Indian elders interact with AI personas through chat, stories, communities, voice rooms, and games.

## North Star Goals

1. **Deployable to GitHub Pages** — zero backend, runs entirely in the browser
2. **Match WhatsApp UI as closely as possible** — familiar, trustworthy interface for elderly users
3. **AI personas feel human** — system prompts are the core craft; responses should be indistinguishable from a real person
4. **Consistent experience** — no broken states, no jarring transitions, everything behaves predictably

## Stack

- Vanilla JS / HTML5 / CSS3
- Anthropic Claude API (via Cloudflare Worker CORS proxy)
- Web Speech API (STT/TTS, en-IN)
- PWA — installable, offline-capable via Service Worker
- localStorage — all state, no backend

## Setup

1. Push to GitHub, enable Pages on `main`
2. Create a Cloudflare Worker as a CORS proxy to the Anthropic API
3. Open the Pages URL on Android Chrome, enter your API key + Worker URL, install via "Add to Home Screen"
