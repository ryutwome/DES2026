/* ============================================================
   DES2026 — Hash Router
   ============================================================ */

let historyStack = [];
let currentRoute = null;
let isNavigating = false;

function navigate(hash) {
  if (isNavigating) return;
  const normalized = hash.startsWith('#') ? hash : '#' + hash;
  if (currentRoute === normalized) return;
  historyStack.push(normalized);
  window.location.hash = normalized.slice(1);
  currentRoute = normalized;
  renderCurrentRoute();
}

function goBack() {
  if (historyStack.length > 1) {
    historyStack.pop();
    const prev = historyStack[historyStack.length - 1];
    currentRoute = prev;
    isNavigating = true;
    window.location.hash = prev.slice(1);
    isNavigating = false;
    renderCurrentRoute();
  } else {
    navigate('#/chats');
  }
}

function parseRoute(hash) {
  const path = hash.replace(/^#\/?/, '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { screen: 'setup', params: {} };
  const screen = parts[0];
  const params = {};
  if (screen === 'chat' && parts[1]) params.personaId = parts[1];
  if (screen === 'community' && parts[1]) params.communityId = parts[1];
  if (screen === 'story' && parts[1]) params.storyId = parts[1];
  if (screen === 'voiceroom' && parts[1]) params.roomId = parts[1];
  if (screen === 'game' && parts[1] && parts[2]) { params.gameId = parts[1]; params.gameType = parts[2]; }
  return { screen, params };
}

function renderCurrentRoute() {
  const hash = window.location.hash || '#/';
  const { screen, params } = parseRoute(hash);

  // Auth guard
  if (!AppState.apiKey && screen !== '') {
    renderSetup();
    return;
  }
  if (AppState.apiKey && !AppState.onboardingDone && screen !== 'onboarding') {
    renderOnboarding();
    return;
  }

  switch (screen) {
    case '':       renderSetup(); break;
    case 'onboarding': renderOnboarding(); break;
    case 'chats':  renderChats(); break;
    case 'chat':   renderChat(params.personaId); break;
    case 'stories': renderStories(); break;
    case 'story':  renderStory(params.storyId); break;
    case 'communities': renderCommunities(); break;
    case 'community':   renderCommunity(params.communityId); break;
    case 'voicerooms':  renderVoiceRooms(); break;
    case 'voiceroom':   renderVoiceRoom(params.roomId); break;
    case 'games':  renderGames(); break;
    case 'game':   renderGame(params.gameId, params.gameType); break;
    default:       renderChats();
  }
}

window.addEventListener('hashchange', () => {
  if (isNavigating) return;
  const hash = window.location.hash || '#/';
  if (currentRoute !== hash) {
    // Hardware back pressed or external navigation
    const idx = historyStack.indexOf(hash);
    if (idx >= 0) historyStack = historyStack.slice(0, idx + 1);
    else historyStack.push(hash);
    currentRoute = hash;
    renderCurrentRoute();
  }
});
