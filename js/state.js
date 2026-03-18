/* ============================================================
   DES2026 — App State & Persistence
   ============================================================ */

const DEFAULT_STATE = {
  apiKey: '',
  proxyUrl: '',
  onboardingDone: false,
  interests: [],
  joinedCommunities: [],
  chats: {},          // personaId → Message[]
  communities: {},    // communityId → Message[]
  games: {},          // gameId → GameState
  stories: [],        // Story[]
  voiceRooms: {},     // roomId → { transcript: TranscriptLine[] }
  researcherMode: false,
  installBannerDismissed: false,
  desktopBannerDismissed: false,
  unreadChats: {},    // personaId → count
  unreadCommunities: {},
};

let AppState = { ...DEFAULT_STATE };

function loadState() {
  try {
    const saved = localStorage.getItem('des2026_state');
    if (saved) {
      AppState = { ...DEFAULT_STATE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not load state:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem('des2026_state', JSON.stringify(AppState));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      trimOldMessages();
      try { localStorage.setItem('des2026_state', JSON.stringify(AppState)); } catch (_) {}
    }
  }
}

function trimOldMessages() {
  Object.keys(AppState.chats).forEach(id => {
    const msgs = AppState.chats[id];
    if (msgs.length > 50) AppState.chats[id] = msgs.slice(-40);
  });
  Object.keys(AppState.communities).forEach(id => {
    const msgs = AppState.communities[id];
    if (msgs.length > 60) AppState.communities[id] = msgs.slice(-48);
  });
  Object.keys(AppState.voiceRooms).forEach(id => {
    const lines = AppState.voiceRooms[id]?.transcript || [];
    if (lines.length > 80) AppState.voiceRooms[id].transcript = lines.slice(-64);
  });
}

function setState(patch) {
  Object.assign(AppState, patch);
  saveState();
}

function addMessage(context, contextId, message) {
  if (!AppState[context][contextId]) AppState[context][contextId] = [];
  AppState[context][contextId].push(message);
  saveState();
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function makeGameId() {
  return `game_${makeId()}`;
}

function makeMessage(from, type, text) {
  return { id: makeId(), from, type, text, timestamp: Date.now(), isAI: from !== 'user' };
}

function makeStory(authorId, authorName, text) {
  return { id: makeId(), authorId, authorName, text, timestamp: Date.now(), replies: [] };
}

/* ---- Seed initial data on first onboarding ---- */
function seedInitialData(interests) {
  // Seed AI stories
  AppState.stories = SEED_STORIES.map(s => ({
    id: makeId(),
    authorId: s.personaId,
    authorName: PERSONAS[s.personaId].name,
    text: s.text,
    timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
    replies: []
  }));
  AppState.stories.sort((a, b) => b.timestamp - a.timestamp);

  // Join communities based on interests
  const joined = new Set();
  interests.forEach(interest => {
    (INTEREST_COMMUNITIES[interest] || []).forEach(cId => joined.add(cId));
  });
  // Always join at least one
  if (joined.size === 0) joined.add('evening-adda-community');
  // Cap at 4
  AppState.joinedCommunities = [...joined].slice(0, 4);

  // Seed community messages
  AppState.joinedCommunities.forEach(cId => {
    const community = COMMUNITIES[cId];
    if (!community) return;
    AppState.communities[cId] = [];
    const personas = community.personas.slice(0, 3);
    const welcomes = [
      `Namaste everyone! Good to see new members joining. ${community.name} is such a nice group.`,
      `Welcome! We have good discussions here. Please feel free to share your thoughts anytime.`,
      `Arre wah, new member! This group has become so active lately. Happy to have you here.`
    ];
    personas.forEach((pId, i) => {
      AppState.communities[cId].push(makeMessage(pId, 'text', welcomes[i] || welcomes[0]));
    });
  });

  // Seed one-on-one chats with personas matched to interests
  const chatPersonas = [];
  interests.forEach(interest => {
    (INTEREST_COMMUNITIES[interest] || []).forEach(cId => {
      (COMMUNITIES[cId]?.personas || []).forEach(pId => {
        if (!chatPersonas.includes(pId)) chatPersonas.push(pId);
      });
    });
  });
  chatPersonas.slice(0, 3).forEach(pId => {
    const p = PERSONAS[pId];
    AppState.chats[pId] = [makeMessage(pId, 'text', p.fallbacks[4])];
    AppState.unreadChats[pId] = 1;
  });

  saveState();
}
