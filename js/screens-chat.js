/* ============================================================
   DES2026 — Individual Chat Screen
   ============================================================ */

function renderChat(personaId) {
  const persona = PERSONAS[personaId];
  if (!persona) { navigate('#/chats'); return; }

  const app = getApp();
  app.innerHTML = '';

  const tapCount = { count: 0, timer: null };
  const header = renderHeader({
    title: persona.name,
    subtitle: persona.city,
    avatarName: persona.name,
    backFn: goBack,
    tapCount,
    rightButtons: [
      { icon: Icons.phone, label: 'Voice call', fn: () => showToast('Voice calls coming soon') },
      { icon: Icons.video, label: 'Video call', fn: () => showToast('Video calls coming soon') },
      { icon: Icons.more, label: 'More', fn: () => {} }
    ]
  });
  app.appendChild(header);

  const screen = document.createElement('div');
  screen.className = 'screen chat-screen';

  const messagesDiv = document.createElement('div');
  messagesDiv.className = 'chat-messages';
  messagesDiv.id = 'chat-messages';

  // Render existing messages
  const messages = AppState.chats[personaId] || [];
  messages.forEach(msg => messagesDiv.appendChild(renderBubble(msg)));
  scrollToBottom(messagesDiv);

  screen.appendChild(messagesDiv);

  // Message input
  const inputBar = renderMessageInputBar({
    placeholder: 'Message',
    onGame: () => showGameStartSheet(personaId),
    onSend: async ({ type, text }) => {
      const msg = makeMessage('user', type, text);
      addMessage('chats', personaId, msg);
      messagesDiv.appendChild(renderBubble(msg));
      scrollToBottom(messagesDiv);

      // AI response
      const allMsgs = AppState.chats[personaId] || [];
      await addAIResponse(messagesDiv, personaId, allMsgs, personaId, 'chats');
    }
  });

  screen.appendChild(inputBar);
  app.appendChild(screen);
}

/* ---- Game start sheet (from chat) ---- */
function showGameStartSheet(personaId) {
  const persona = PERSONAS[personaId];
  if (!persona) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'bottom-sheet-backdrop';
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });

  const sheet = document.createElement('div');
  sheet.className = 'bottom-sheet';
  sheet.innerHTML = `
    <div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Start a Game with ${persona.name.split(' ')[0]}</div>
    <div class="game-picker-sheet" id="game-type-picker"></div>
    <button class="sheet-confirm-btn" id="game-start-btn" disabled>Start Game →</button>
  `;

  const picker = sheet.querySelector('#game-type-picker');
  let selectedType = null;

  Object.values(GAME_TYPES).forEach(gt => {
    const opt = document.createElement('button');
    opt.className = 'game-type-option';
    opt.innerHTML = `
      <span class="game-type-option__emoji">${gt.emoji}</span>
      <div class="game-type-option__body">
        <div class="game-type-option__name">${gt.name}</div>
        <div class="game-type-option__desc">${gt.desc}</div>
      </div>
    `;
    opt.addEventListener('click', () => {
      picker.querySelectorAll('.game-type-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedType = gt.id;
      sheet.querySelector('#game-start-btn').disabled = false;
    });
    picker.appendChild(opt);
  });

  sheet.querySelector('#game-start-btn').addEventListener('click', () => {
    if (!selectedType) return;
    backdrop.remove();
    const gameId = makeGameId();
    const gameState = {
      id: gameId, type: selectedType, opponentId: personaId,
      status: 'active', currentLetter: '', score: { user: 0, ai: 0 },
      questionNumber: 1, lastQuestion: '', messages: [], createdAt: Date.now(), completedAt: null
    };
    const games = { ...AppState.games, [gameId]: gameState };
    setState({ games });
    navigate(`#/game/${gameId}/${selectedType}`);
  });

  backdrop.appendChild(sheet);
  document.getElementById('app').appendChild(backdrop);
}
