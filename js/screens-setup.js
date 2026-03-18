/* ============================================================
   DES2026 — Setup, Onboarding, Chats List Screens
   ============================================================ */

function renderSetup() {
  const app = getApp();
  app.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'setup-screen';
  screen.innerHTML = `
    <div class="setup-screen__logo">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="17" r="8" fill="#25D366"/>
        <path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#25D366" stroke-width="3" stroke-linecap="round"/>
        <path d="M4 30l-3 6 6-2" fill="#25D366"/>
      </svg>
    </div>
    <div class="setup-screen__title">DES2026 Researcher Setup</div>
    <div class="setup-screen__subtitle">Enter your credentials to enable AI responses for this prototype.</div>
    <form class="setup-screen__form" id="setup-form" autocomplete="off">
      <div class="setup-screen__field">
        <label class="setup-screen__label" for="api-key-input">Anthropic API Key</label>
        <div class="setup-screen__input-wrap">
          <input class="setup-screen__input" id="api-key-input" type="password" placeholder="sk-ant-..." autocomplete="off" spellcheck="false"/>
          <button type="button" class="setup-screen__toggle" id="api-key-toggle" aria-label="Show/hide API key">
            ${Icons.eye}
          </button>
        </div>
      </div>
      <div class="setup-screen__field">
        <label class="setup-screen__label" for="proxy-url-input">Cloudflare Worker URL (handles API requests)</label>
        <div class="setup-screen__input-wrap">
          <input class="setup-screen__input" id="proxy-url-input" type="text" placeholder="https://your-worker.workers.dev" autocomplete="off" spellcheck="false"/>
        </div>
        <div class="setup-screen__hint">Deploy a Cloudflare Worker (free) to proxy API calls. See the comment at the top of index.html for the Worker code.</div>
      </div>
      <button type="submit" class="setup-screen__btn" id="setup-submit" disabled>Continue →</button>
    </form>
    <div class="setup-screen__note">This screen will not appear again on this device. Keys are stored locally only and never sent anywhere except through your Worker.</div>
  `;

  app.appendChild(screen);

  const apiInput = document.getElementById('api-key-input');
  const proxyInput = document.getElementById('proxy-url-input');
  const submitBtn = document.getElementById('setup-submit');
  const toggleBtn = document.getElementById('api-key-toggle');
  let showKey = false;

  toggleBtn.addEventListener('click', () => {
    showKey = !showKey;
    apiInput.type = showKey ? 'text' : 'password';
    toggleBtn.innerHTML = showKey ? Icons.eyeOff : Icons.eye;
  });

  function checkReady() {
    submitBtn.disabled = !(apiInput.value.trim() && proxyInput.value.trim());
  }

  apiInput.addEventListener('input', checkReady);
  proxyInput.addEventListener('input', checkReady);

  document.getElementById('setup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const key = apiInput.value.trim();
    const proxy = proxyInput.value.trim();
    if (!key || !proxy) return;
    setState({ apiKey: key, proxyUrl: proxy });
    if (AppState.onboardingDone) navigate('#/chats');
    else navigate('#/onboarding');
  });
}

/* ---- Onboarding ---- */
function renderOnboarding() {
  const app = getApp();
  app.innerHTML = '';

  const tapCount = { count: 0, timer: null };
  const header = renderHeader({ title: 'DES2026 Community', tapCount });
  app.appendChild(header);

  const screen = document.createElement('div');
  screen.className = 'onboarding-screen';
  screen.innerHTML = `
    <div>
      <div class="onboarding-screen__heading">What are you interested in?</div>
      <div class="onboarding-screen__subheading">Pick your interests to find the right communities.</div>
    </div>
    <div class="interest-grid" id="interest-grid"></div>
    <button class="onboarding-screen__cta" id="onboarding-cta" disabled>Let's go →</button>
  `;

  app.appendChild(screen);

  const interests = [
    { id: 'cooking', label: 'Cooking', emoji: '🍲' },
    { id: 'cricket', label: 'Cricket', emoji: '🏏' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'gardening', label: 'Gardening', emoji: '🌱' },
    { id: 'literature', label: 'Literature', emoji: '📚' },
    { id: 'spirituality', label: 'Spirituality', emoji: '🙏' },
  ];

  const selected = new Set();
  const grid = document.getElementById('interest-grid');
  const cta = document.getElementById('onboarding-cta');

  interests.forEach(({ id, label, emoji }) => {
    const tile = document.createElement('button');
    tile.className = 'interest-tile';
    tile.innerHTML = `<span class="interest-tile__emoji">${emoji}</span><span class="interest-tile__label">${label}</span>`;
    tile.addEventListener('click', () => {
      if (selected.has(id)) { selected.delete(id); tile.classList.remove('selected'); }
      else { selected.add(id); tile.classList.add('selected'); }
      cta.disabled = selected.size === 0;
    });
    grid.appendChild(tile);
  });

  cta.addEventListener('click', () => {
    if (selected.size === 0) return;
    const interestArr = [...selected];
    setState({ interests: interestArr, onboardingDone: true });
    seedInitialData(interestArr);
    navigate('#/chats');
  });
}

/* ---- Chats List ---- */
function renderChats() {
  const app = getApp();
  app.innerHTML = '';

  const tapCount = { count: 0, timer: null };

  const desktopBanner = renderDesktopBanner();
  if (desktopBanner) app.appendChild(desktopBanner);

  const installBanner = renderInstallBanner();
  if (installBanner) app.appendChild(installBanner);

  const resBar = renderResearcherBar();
  if (resBar) app.appendChild(resBar);

  const header = renderHeader({
    title: 'DES2026 Community',
    tapCount,
    rightButtons: [
      { icon: Icons.search, label: 'Search', fn: () => {} },
      { icon: Icons.more, label: 'More options', fn: () => {} }
    ]
  });
  app.appendChild(header);

  const screen = document.createElement('div');
  screen.className = 'screen';

  const searchBar = document.createElement('div');
  searchBar.className = 'search-bar';
  searchBar.innerHTML = `<span class="search-bar__icon">${Icons.search}</span><input type="search" placeholder="Search chats" aria-label="Search chats"/>`;
  screen.appendChild(searchBar);

  const scroll = document.createElement('div');
  scroll.className = 'screen__scroll';
  scroll.style.background = '#fff';

  // Build chat list: personas we have chats with
  const chatPersonas = Object.keys(AppState.chats).filter(id => PERSONAS[id]);

  // Add any persona with messages + sort by last message time
  const chatItems = chatPersonas.map(id => {
    const msgs = AppState.chats[id] || [];
    const last = msgs[msgs.length - 1];
    return { personaId: id, lastMsg: last, time: last?.timestamp || 0 };
  }).sort((a, b) => b.time - a.time);

  // If no chats, show empty state
  if (chatItems.length === 0) {
    scroll.innerHTML = `<div class="empty-state"><div class="empty-state__icon">💬</div><div class="empty-state__title">No chats yet</div><div class="empty-state__desc">Join a community or start a game to begin connecting.</div></div>`;
  } else {
    chatItems.forEach(({ personaId, lastMsg, time }) => {
      const persona = PERSONAS[personaId];
      if (!persona) return;
      const unread = AppState.unreadChats[personaId] || 0;
      const preview = lastMsg ? (lastMsg.type === 'voice' ? '🎤 Voice message' : lastMsg.text) : '';
      const aiLabel = AppState.researcherMode ? ' <span class="ai-badge">AI</span>' : '';

      const item = document.createElement('div');
      item.className = 'chat-list-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.innerHTML = `
        ${renderAvatar(persona.name, 'md')}
        <div class="chat-list-item__body">
          <div class="chat-list-item__top">
            <div class="chat-list-item__name">${persona.name}${aiLabel}</div>
            <div class="chat-list-item__time">${formatDate(time)}</div>
          </div>
          <div class="chat-list-item__bottom">
            <div class="chat-list-item__preview">${preview}</div>
            ${unread > 0 ? `<div class="chat-list-item__badge">${unread}</div>` : ''}
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (AppState.unreadChats[personaId]) {
          const u = { ...AppState.unreadChats };
          delete u[personaId];
          setState({ unreadChats: u });
        }
        navigate(`#/chat/${personaId}`);
      });

      scroll.appendChild(item);
    });
  }

  screen.appendChild(scroll);
  app.appendChild(screen);
  app.appendChild(renderBottomNav('chats'));
}
