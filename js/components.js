/* ============================================================
   DES2026 — Shared UI Components
   ============================================================ */

/* ---- Utility: mount into #app ---- */
function mountApp(html) {
  document.getElementById('app').innerHTML = html;
}

function getApp() { return document.getElementById('app'); }

/* ---- Toast ---- */
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.getElementById('app').appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ---- Avatar ---- */
function renderAvatar(name, size = 'md') {
  const color = avatarColor(name);
  const initials = avatarInitials(name);
  return `<div class="avatar avatar--${size}" style="background:${color}">${initials}</div>`;
}

/* ---- Header ---- */
function renderHeader({ title, subtitle, backFn, rightButtons = [], avatarName = null, tapCount = { count: 0, timer: null } }) {
  const div = document.createElement('div');
  div.className = 'header';
  div.setAttribute('role', 'banner');

  if (backFn) {
    const back = document.createElement('button');
    back.className = 'header__back';
    back.setAttribute('aria-label', 'Go back');
    back.innerHTML = Icons.back;
    back.addEventListener('click', backFn);
    div.appendChild(back);
  }

  if (avatarName) {
    const av = document.createElement('div');
    av.className = 'header__avatar';
    av.innerHTML = renderAvatar(avatarName, 'sm');
    div.appendChild(av);
  }

  const titleWrap = document.createElement('div');
  titleWrap.className = 'header__title';
  titleWrap.innerHTML = `<h1>${title}</h1>${subtitle ? `<div class="header__subtitle">${subtitle}</div>` : ''}`;

  // 3-tap researcher mode toggle
  titleWrap.addEventListener('click', () => {
    tapCount.count++;
    clearTimeout(tapCount.timer);
    tapCount.timer = setTimeout(() => { tapCount.count = 0; }, 800);
    if (tapCount.count >= 3) {
      tapCount.count = 0;
      showResearcherModeDialog();
    }
  });

  div.appendChild(titleWrap);

  if (rightButtons.length > 0) {
    const actions = document.createElement('div');
    actions.className = 'header__actions';
    rightButtons.forEach(({ icon, label, fn }) => {
      const btn = document.createElement('button');
      btn.className = 'header__action-btn';
      btn.setAttribute('aria-label', label);
      btn.innerHTML = icon;
      btn.addEventListener('click', fn);
      actions.appendChild(btn);
    });
    div.appendChild(actions);
  }

  return div;
}

/* ---- Researcher mode dialog ---- */
function showResearcherModeDialog() {
  const current = AppState.researcherMode;
  const action = current ? 'Disable' : 'Enable';
  const msg = current
    ? 'Disable Researcher Mode? AI labels will be hidden.'
    : 'Enable Researcher Mode? AI persona labels will be shown to identify AI users.';

  const backdrop = document.createElement('div');
  backdrop.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;';

  const dialog = document.createElement('div');
  dialog.style.cssText = 'background:#fff;border-radius:12px;padding:1.5rem;width:100%;max-width:320px;display:flex;flex-direction:column;gap:1rem;';
  dialog.innerHTML = `
    <h2 style="font-size:1.0625rem;font-weight:700;color:#111;">Researcher Mode</h2>
    <p style="font-size:0.9375rem;color:#444;line-height:1.5;">${msg}</p>
    <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
      <button id="rm-cancel" style="background:none;border:1.5px solid #ddd;border-radius:8px;padding:0.625rem 1.25rem;font-size:1rem;cursor:pointer;min-height:44px;font-family:inherit;">Cancel</button>
      <button id="rm-confirm" style="background:${current ? '#E53935' : '#075E54'};color:#fff;border:none;border-radius:8px;padding:0.625rem 1.25rem;font-size:1rem;font-weight:600;cursor:pointer;min-height:44px;font-family:inherit;">${action}</button>
    </div>
  `;

  backdrop.appendChild(dialog);
  document.getElementById('app').appendChild(backdrop);

  document.getElementById('rm-cancel').addEventListener('click', () => backdrop.remove());
  document.getElementById('rm-confirm').addEventListener('click', () => {
    setState({ researcherMode: !current });
    backdrop.remove();
    showToast(current ? 'Researcher Mode disabled' : 'Researcher Mode enabled');
    renderCurrentRoute();
  });
}

/* ---- Bottom Nav ---- */
function renderBottomNav(activeTab) {
  const tabs = [
    { id: 'chats', label: 'Chats', icon: Icons.chats, hash: '#/chats' },
    { id: 'stories', label: 'Stories', icon: Icons.stories, hash: '#/stories' },
    { id: 'communities', label: 'Communities', icon: Icons.communities, hash: '#/communities' },
    { id: 'voicerooms', label: 'Voice Rooms', icon: Icons.voiceRoom, hash: '#/voicerooms' },
    { id: 'games', label: 'Games', icon: Icons.games, hash: '#/games' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', 'Main navigation');

  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = `bottom-nav__tab${activeTab === tab.id ? ' active' : ''}`;
    btn.setAttribute('aria-label', tab.label);
    btn.setAttribute('aria-current', activeTab === tab.id ? 'page' : 'false');
    btn.innerHTML = `<span class="bottom-nav__icon">${tab.icon}</span><span class="bottom-nav__label">${tab.label}</span>`;
    btn.addEventListener('click', () => {
      if (activeTab !== tab.id) {
        historyStack = [tab.hash];
        navigate(tab.hash);
      }
    });
    nav.appendChild(btn);
  });

  return nav;
}

/* ---- Desktop banner ---- */
function renderDesktopBanner() {
  if (AppState.desktopBannerDismissed || isSpeechRecognitionAvailable()) return null;
  const div = document.createElement('div');
  div.className = 'banner banner--desktop';
  div.innerHTML = `<span>For the full voice experience, open this on an Android phone in Chrome.</span>`;
  const close = document.createElement('button');
  close.className = 'banner__close';
  close.setAttribute('aria-label', 'Dismiss');
  close.innerHTML = Icons.close;
  close.addEventListener('click', () => {
    setState({ desktopBannerDismissed: true });
    div.remove();
  });
  div.appendChild(close);
  return div;
}

/* ---- Install banner ---- */
function renderInstallBanner() {
  if (AppState.installBannerDismissed) return null;
  if (window.matchMedia('(display-mode: standalone)').matches) return null;
  const div = document.createElement('div');
  div.className = 'banner banner--install';
  div.innerHTML = `<span>Tap the browser menu → "Add to Home Screen" for the best experience.</span>`;
  const close = document.createElement('button');
  close.className = 'banner__close';
  close.setAttribute('aria-label', 'Dismiss');
  close.innerHTML = Icons.close;
  close.addEventListener('click', () => {
    setState({ installBannerDismissed: true });
    div.remove();
  });
  div.appendChild(close);
  return div;
}

/* ---- Researcher mode bar ---- */
function renderResearcherBar() {
  if (!AppState.researcherMode) return null;
  const bar = document.createElement('div');
  bar.className = 'researcher-mode-bar';
  bar.textContent = '👁 RESEARCHER MODE — AI personas are labeled';
  return bar;
}

/* ---- Chat Bubble ---- */
function renderBubble(message) {
  const isSent = message.from === 'user';
  const wrap = document.createElement('div');
  wrap.className = `bubble-wrap bubble-wrap--${isSent ? 'sent' : 'recv'}`;

  const bubble = document.createElement('div');
  bubble.className = `bubble bubble--${isSent ? 'sent' : 'recv'}`;

  if (message.type === 'voice') {
    bubble.appendChild(renderVoiceBubbleContent(message));
  } else {
    const persona = !isSent && PERSONAS[message.from];
    if (persona && AppState.researcherMode) {
      const badge = document.createElement('span');
      badge.className = 'ai-badge';
      badge.textContent = 'AI';
      bubble.appendChild(badge);
    }
    const textNode = document.createElement('div');
    textNode.textContent = message.text;
    bubble.appendChild(textNode);
  }

  const meta = document.createElement('div');
  meta.className = 'bubble__meta';
  const timeStr = formatTime(message.timestamp);
  meta.innerHTML = `<span class="bubble__time">${timeStr}</span>`;
  if (isSent) {
    const ticks = document.createElement('span');
    ticks.className = 'bubble__ticks bubble__ticks--read';
    ticks.innerHTML = Icons.doubleTick;
    meta.appendChild(ticks);
  }
  bubble.appendChild(meta);

  wrap.appendChild(bubble);

  const speakerBtn = makeSpeakerBtn(message.text);
  if (speakerBtn) wrap.appendChild(speakerBtn);

  return wrap;
}

function renderVoiceBubbleContent(message) {
  const div = document.createElement('div');
  div.className = 'voice-bubble';

  const controls = document.createElement('div');
  controls.className = 'voice-bubble__controls';

  const playBtn = document.createElement('button');
  playBtn.className = 'voice-bubble__play';
  playBtn.setAttribute('aria-label', 'Play voice message');
  let playing = false;
  playBtn.innerHTML = Icons.play;
  playBtn.addEventListener('click', () => {
    if (playing) {
      stopSpeaking();
      playing = false;
      playBtn.innerHTML = Icons.play;
    } else {
      speak(message.text, () => {
        playing = false;
        playBtn.innerHTML = Icons.play;
      });
      playing = true;
      playBtn.innerHTML = Icons.pause;
    }
  });

  const waveformDiv = document.createElement('div');
  waveformDiv.className = 'voice-bubble__waveform';
  waveformDiv.innerHTML = Icons.waveform(18);

  controls.appendChild(playBtn);
  controls.appendChild(waveformDiv);
  div.appendChild(controls);

  if (message.text) {
    const textDiv = document.createElement('div');
    textDiv.className = 'voice-bubble__text';
    textDiv.textContent = message.text;
    div.appendChild(textDiv);
  }

  return div;
}

/* ---- Typing indicator ---- */
function renderTypingIndicator() {
  const wrap = document.createElement('div');
  wrap.className = 'bubble-wrap bubble-wrap--recv';
  wrap.id = 'typing-indicator';
  const ind = document.createElement('div');
  ind.className = 'typing-indicator';
  ind.innerHTML = '<div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div>';
  wrap.appendChild(ind);
  return wrap;
}

/* ---- Message Input Bar ---- */
function renderMessageInputBar({ onSend, onGame, placeholder = 'Message' }) {
  const bar = document.createElement('div');
  bar.className = 'message-input-bar';

  const attachBtn = document.createElement('button');
  attachBtn.className = 'message-input-bar__attach';
  attachBtn.setAttribute('aria-label', 'Attach');
  attachBtn.innerHTML = Icons.attach;

  const fieldWrap = document.createElement('div');
  fieldWrap.className = 'message-input-bar__field-wrap';

  if (onGame) {
    const gameBtn = document.createElement('button');
    gameBtn.className = 'message-input-bar__game-btn';
    gameBtn.setAttribute('aria-label', 'Start a game');
    gameBtn.innerHTML = Icons.controller;
    gameBtn.addEventListener('click', onGame);
    fieldWrap.appendChild(gameBtn);
  }

  const textarea = document.createElement('textarea');
  textarea.className = 'message-input-bar__field';
  textarea.placeholder = placeholder;
  textarea.rows = 1;
  textarea.setAttribute('aria-label', 'Type a message');

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    updateSendBtn();
  });

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (textarea.value.trim()) sendText();
    }
  });

  fieldWrap.appendChild(textarea);

  const sendBtn = document.createElement('button');
  sendBtn.className = 'message-input-bar__send message-input-bar__send--mic';
  sendBtn.setAttribute('aria-label', 'Send or record voice message');

  let recordingOverlay = null;
  let currentTranscript = '';
  let isRecording = false;

  function updateSendBtn() {
    if (textarea.value.trim()) {
      sendBtn.innerHTML = Icons.send;
      sendBtn.classList.remove('message-input-bar__send--mic', 'message-input-bar__send--recording');
    } else {
      sendBtn.innerHTML = Icons.mic;
      sendBtn.classList.add('message-input-bar__send--mic');
      sendBtn.classList.remove('message-input-bar__send--recording');
    }
  }

  function sendText() {
    const text = textarea.value.trim();
    if (!text) return;
    textarea.value = '';
    textarea.style.height = 'auto';
    updateSendBtn();
    onSend({ type: 'text', text });
  }

  function showRecordingOverlay(interimText) {
    if (recordingOverlay) return;
    const app = document.getElementById('app');
    recordingOverlay = document.createElement('div');
    recordingOverlay.className = 'recording-overlay';

    const bars = Array.from({length: 12}, (_, i) =>
      `<div class="recording-overlay__bar" style="animation-delay:${i*0.07}s"></div>`
    ).join('');

    recordingOverlay.innerHTML = `
      <div class="recording-overlay__waveform">${bars}</div>
      <div class="recording-overlay__status">Listening...</div>
      <div class="recording-overlay__preview" id="rec-preview"></div>
      <div class="recording-overlay__actions">
        <button class="recording-overlay__cancel" id="rec-cancel">Cancel</button>
        <button class="recording-overlay__send" id="rec-send" disabled>Send</button>
      </div>
    `;

    app.appendChild(recordingOverlay);

    document.getElementById('rec-cancel').addEventListener('click', () => {
      stopRecognition();
      removeRecordingOverlay();
    });

    document.getElementById('rec-send').addEventListener('click', () => {
      stopRecognition();
      const text = currentTranscript.trim();
      removeRecordingOverlay();
      if (text) onSend({ type: 'voice', text });
    });
  }

  function removeRecordingOverlay() {
    if (recordingOverlay) { recordingOverlay.remove(); recordingOverlay = null; }
    isRecording = false;
    currentTranscript = '';
    sendBtn.classList.remove('message-input-bar__send--recording');
    sendBtn.innerHTML = Icons.mic;
    sendBtn.classList.add('message-input-bar__send--mic');
  }

  sendBtn.addEventListener('click', () => {
    if (textarea.value.trim()) {
      sendText();
      return;
    }

    if (!isSpeechRecognitionAvailable()) {
      showToast('Voice input not available. Please type your message.');
      return;
    }

    if (isRecording) {
      stopRecognition();
      return;
    }

    isRecording = true;
    sendBtn.classList.add('message-input-bar__send--recording');
    sendBtn.innerHTML = Icons.micOff;
    currentTranscript = '';
    showRecordingOverlay('');

    startRecognition({
      onInterim: (text) => {
        currentTranscript = text;
        const preview = document.getElementById('rec-preview');
        if (preview) preview.textContent = text;
      },
      onFinal: (text) => {
        currentTranscript = text;
        const preview = document.getElementById('rec-preview');
        if (preview) preview.textContent = text;
        const sendBtnRec = document.getElementById('rec-send');
        if (sendBtnRec && text.trim()) sendBtnRec.disabled = false;
      },
      onError: (err) => {
        removeRecordingOverlay();
        if (err !== 'aborted') showToast('Could not hear clearly. Please try again.');
      },
      onEnd: () => {
        const preview = document.getElementById('rec-preview');
        if (preview && currentTranscript.trim()) {
          const sendBtnRec = document.getElementById('rec-send');
          if (sendBtnRec) sendBtnRec.disabled = false;
        } else if (!currentTranscript.trim()) {
          removeRecordingOverlay();
        }
        isRecording = false;
        sendBtn.classList.remove('message-input-bar__send--recording');
        sendBtn.innerHTML = Icons.mic;
        sendBtn.classList.add('message-input-bar__send--mic');
      }
    });
  });

  updateSendBtn();
  bar.appendChild(attachBtn);
  bar.appendChild(fieldWrap);
  bar.appendChild(sendBtn);

  return bar;
}

/* ---- Format time ---- */
function formatTime(timestamp) {
  const d = new Date(timestamp);
  const h = d.getHours(), m = d.getMinutes();
  return `${h}:${m.toString().padStart(2, '0')}`;
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const diff = now - d;
  if (diff < 24 * 60 * 60 * 1000) return formatTime(timestamp);
  if (diff < 7 * 24 * 60 * 60 * 1000) return d.toLocaleDateString('en-IN', { weekday: 'short' });
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ---- Scroll chat to bottom ---- */
function scrollToBottom(container) {
  if (container) setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
}

/* ---- Add AI response with typing delay ---- */
async function addAIResponse(container, personaId, messages, contextId, contextType, extraNote = '') {
  const typing = renderTypingIndicator();
  container.appendChild(typing);
  scrollToBottom(container);

  const delay = 1500 + Math.random() * 1000;
  await new Promise(r => setTimeout(r, delay));

  typing.remove();

  const text = await callClaude(personaId, messages, extraNote);
  const msg = makeMessage(personaId, 'text', text);

  addMessage(contextType, contextId, msg);
  const bubble = renderBubble(msg);
  container.appendChild(bubble);
  scrollToBottom(container);

  return msg;
}
