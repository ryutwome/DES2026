/* ============================================================
   DES2026 — Games hub, game sheet, and game screen
   ============================================================ */

/* ── CONSTANTS ── */
const HANGMAN_WORDS = [
  'MANGO','TIGER','BRIDGE','FLOWER','CRICKET','CINEMA','GARDEN','PALACE',
  'MONSOON','TEMPLE','BUFFALO','JUNGLE','ROCKET','CANDLE','MIRROR','PILLOW',
  'FOREST','DESERT','CASTLE','ISLAND','BUTTER','COFFEE','PENCIL','RIBBON',
  'SILVER','PLANET','CLOUDS','GUITAR','BASKET','WINDOW'
];

const MEMORY_EMOJIS = ['apple','orange','lemon','grapes','strawberry','peach','kiwi','pineapple'];

// Static lobby rooms — AI personas + watchers waiting to play
const SEED_LOBBIES = [
  {type:'tictactoe',  personaId:'rameshbhai',  watchers:['meenakshiamma','lalitha'],    label:'3 in room', waiting:'Rameshbhai waiting'},
  {type:'connectfour',personaId:'harbhajan',   watchers:['krishnaswamy','abdulrehman'], label:'3 in room', waiting:'Harbhajan waiting'},
  {type:'memory',     personaId:'sunitadevi',  watchers:['padmavathi','rameshbhai'],    label:'3 in room', waiting:'Sunita Devi waiting'},
  {type:'hangman',    personaId:'padmavathi',  watchers:['lalitha','meenakshiamma'],    label:'3 in room', waiting:'Padmavathi waiting'},
];

const gameTypes = {
  antakshari:        {id:'antakshari',        emoji:'music',     name:'Antakshari',       desc:'Song chain — last letter starts next song',    category:'chat'},
  'trivia-bollywood':{id:'trivia-bollywood',  emoji:'film',      name:'Bollywood Trivia', desc:'Questions about Hindi films',                  category:'chat'},
  tictactoe:         {id:'tictactoe',         emoji:'circle-o',  name:'Tic Tac Toe',      desc:'Classic 3-in-a-row — can you beat the AI?',   category:'board'},
  connectfour:       {id:'connectfour',       emoji:'red-circle',name:'Connect Four',     desc:'Drop pieces, four in a row wins',              category:'board'},
  memory:            {id:'memory',            emoji:'joker',     name:'Memory Match',     desc:'Flip cards and find matching pairs',           category:'board'},
  hangman:           {id:'hangman',           emoji:'text-abc',  name:'Hangman',          desc:'Guess the word before the figure is complete', category:'word'},
};

/* ── CREATE GAME STATE ── */
function createGameState(gameId, type, personaId) {
  // Pick 2 spectators from other personas
  const spectators = Object.keys(PERSONAS).filter(id => id !== personaId).slice(0, 2);
  const base = {
    id:gameId, type, opponentId:personaId, spectators, status:'active',
    score:{user:0,ai:0}, chatMessages:[], createdAt:Date.now()
  };
  if (type === 'tictactoe')   return {...base, board:Array(9).fill(null),  currentTurn:'user', winner:null};
  if (type === 'connectfour') return {...base, board:Array(42).fill(null), currentTurn:'user', winner:null};
  if (type === 'memory') {
    const cards = [...MEMORY_EMOJIS,...MEMORY_EMOJIS].sort(()=>Math.random()-0.5).map((e,i)=>({id:i,emoji:e,flipped:false,matched:false}));
    return {...base, cards, flippedIndices:[], currentTurn:'user'};
  }
  if (type === 'hangman') {
    const word = HANGMAN_WORDS[Math.floor(Math.random()*HANGMAN_WORDS.length)];
    return {...base, word, guessed:[], attempts:0, maxAttempts:6};
  }
  return {...base, currentLetter:'', questionNumber:1, lastQuestion:'', messages:[], completedAt:null};
}

/* ── GAMES HUB ── */
function renderGames(){
  const inProgress = g => g.status==='active' && !g.winner;
  const lastGame = S.lastGameId ? S.games[S.lastGameId] : null;
  const showRejoin = lastGame && inProgress(lastGame);
  const takenTypes = new Set(Object.values(S.games).filter(inProgress).map(g=>g.type));
  const recentGames = Object.values(S.games).filter(g=>g.status==='completed').slice(-5);
  mount(`
    ${resBar()}
    <div class="header">
      <div class="header__title" onclick="headerTap()"><h1>Games</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="screen game-hub-screen"><div class="screen__scroll" id="games-scroll"></div></div>
    ${bottomNav('games')}
  `);
  const sc = $('games-scroll');
  sc.insertAdjacentHTML('beforeend',`<button class="start-game-btn" onclick="showGameSheet(null)">${IC.add} Start New Game</button>`);
  if (showRejoin) {
    sc.insertAdjacentHTML('beforeend','<div class="section-heading">Continue Playing</div>');
    sc.appendChild(rejoinCard(lastGame));
  }
  const availableLobbies = SEED_LOBBIES.filter(l => !takenTypes.has(l.type));
  if (availableLobbies.length) {
    sc.insertAdjacentHTML('beforeend','<div class="section-heading">Open Games</div>');
    availableLobbies.forEach(lobby => sc.appendChild(lobbyCard(lobby)));
  }
  if (recentGames.length) {
    sc.insertAdjacentHTML('beforeend','<div class="section-heading">Recent</div>');
    recentGames.reverse().forEach(g => sc.appendChild(gameCard(g)));
  }
}

function rejoinCard(g){
  const p = PERSONAS[g.opponentId]; const gt = gameTypes[g.type]||{emoji:'game',name:g.type};
  const div = document.createElement('div'); div.className = 'game-lobby-card';
  div.innerHTML = `
    <div class="game-lobby-card__icon">${ej(gt.emoji,'30px')}</div>
    <div class="game-lobby-card__body">
      <div class="game-lobby-card__title">${gt.name}</div>
      <div class="game-lobby-card__players">${avatar(p.name,'sm',p.id)}<span>vs ${p?.name||'?'}</span></div>
    </div>
    <button class="game-lobby-join-btn" onclick="navigate('#/game/${g.id}/${g.type}')">Rejoin</button>
  `;
  return div;
}

function gameCard(g){
  const p = PERSONAS[g.opponentId]; const gt = gameTypes[g.type]||{emoji:'game',name:g.type};
  const div = document.createElement('div'); div.className = 'game-card';
  const isBoardGame = ['tictactoe','connectfour','memory','hangman'].includes(g.type);
  const meta = g.status==='completed' ? 'Completed' : isBoardGame ? 'In progress' : 'Your turn';
  div.innerHTML = `<div class="game-card__icon">${ej(gt.emoji,'30px')}</div><div class="game-card__body"><div class="game-card__title">${gt.name}</div><div class="game-card__subtitle">vs ${p?.name||'?'}</div><div class="game-card__meta">${meta}</div></div>`;
  if (g.status === 'active') div.onclick = () => navigate(`#/game/${g.id}/${g.type}`);
  return div;
}

function lobbyCard(lobby){
  const gt = gameTypes[lobby.type]; const p = PERSONAS[lobby.personaId];
  const watchers = (lobby.watchers||[]).map(id=>PERSONAS[id]).filter(Boolean).slice(0,2);
  const allAv = [p,...watchers].map(px=>avatar(px.name,'sm',px.id)).join('');
  const div = document.createElement('div'); div.className = 'game-lobby-card';
  div.innerHTML = `
    <div class="game-lobby-card__icon">${ej(gt.emoji,'30px')}</div>
    <div class="game-lobby-card__body">
      <div class="game-lobby-card__title">${gt.name}</div>
      <div class="game-lobby-card__players">${allAv}<span>${lobby.waiting} · ${lobby.label}</span></div>
    </div>
    <button class="game-lobby-join-btn" onclick="joinLobby('${lobby.type}','${lobby.personaId}')">Join</button>
  `;
  return div;
}

function joinLobby(gameType, personaId){
  const gameId = mkGameId();
  const gs = createGameState(gameId, gameType, personaId);
  set({games:{...S.games,[gameId]:gs}});
  navigate(`#/game/${gameId}/${gameType}`);
}

function showGameSheet(fromPersonaId){
  let selType = null, selPersona = fromPersonaId;
  const bk = sheet(`
    <div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Start a New Game</div>
    <div id="gs-type" class="game-picker-sheet"></div>
    ${!fromPersonaId?`<div class="bottom-sheet__title" style="margin-top:.75rem;font-size:.9375rem;">Choose opponent</div><div id="gs-persona" class="persona-picker-list"></div>`:''}
    <button class="sheet-confirm-btn" id="gs-go" disabled>Start Game →</button>
  `);
  const typePicker = $('gs-type');
  Object.values(gameTypes).forEach(gt=>{
    const b = document.createElement('button'); b.className = 'game-type-option';
    b.innerHTML = `<span class="game-type-option__emoji">${ej(gt.emoji,'28px')}</span><div class="game-type-option__body"><div class="game-type-option__name">${gt.name}</div><div class="game-type-option__desc">${gt.desc}</div></div>`;
    b.onclick = ()=>{typePicker.querySelectorAll('.game-type-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selType=gt.id;checkReady();};
    typePicker.appendChild(b);
  });
  if (!fromPersonaId) {
    const pp = $('gs-persona');
    PERSONA_LIST.forEach(p=>{
      const b = document.createElement('button'); b.className = 'persona-pick-item';
      b.innerHTML = `${avatar(p.name,'sm',p.id)}<div><div class="persona-pick-item__name">${p.name}</div><div class="persona-pick-item__city">${p.city}</div></div>`;
      b.onclick = ()=>{pp.querySelectorAll('.persona-pick-item').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selPersona=p.id;checkReady();};
      pp.appendChild(b);
    });
  }
  function checkReady(){ if($('gs-go')) $('gs-go').disabled = !(selType && selPersona); }
  $('gs-go').onclick = ()=>{
    if (!selType || !selPersona) return;
    closeSheet(bk);
    const gameId = mkGameId();
    const gs = createGameState(gameId, selType, selPersona);
    set({games:{...S.games,[gameId]:gs}});
    navigate(`#/game/${gameId}/${selType}`);
  };
}

/* ── GAME SCREEN DISPATCHER ── */
function renderGame(gameId, gameType){
  set({lastGameId:gameId});
  if (gameType === 'tictactoe')   return renderTicTacToe(gameId);
  if (gameType === 'connectfour') return renderConnectFour(gameId);
  if (gameType === 'memory')      return renderMemoryMatch(gameId);
  if (gameType === 'hangman')     return renderHangman(gameId);
  renderChatGame(gameId, gameType);
}

/* ── CHAT-BASED GAMES ── */
function renderChatGame(gameId, gameType){
  const gs = S.games[gameId]; const persona = gs ? PERSONAS[gs.opponentId] : null;
  if (!gs || !persona) { navigate('#/games'); return; }
  const gt = gameTypes[gameType]||{emoji:'game',name:gameType};
  mount(`
    ${header(`${ej(gt.emoji)} ${gt.name}`,{back:true,subtitle:`vs ${persona.name}`})}
    <div class="game-status-bar" id="game-status">${renderGameStatus(gs)}</div>
    <div class="screen game-screen" id="game-wrap">
      <div class="chat-messages" id="game-msgs" style="background:#ECE5DD;"></div>
    </div>
  `);
  const msgs = $('game-msgs');
  (gs.messages||[]).forEach(m => msgs.insertAdjacentHTML('beforeend', bubble(m)));
  if (!gs.messages || !gs.messages.length) setTimeout(()=>startGameFirstMove(gameId,gameType,msgs), 500);
  scrollBot(msgs);
  renderInputBar('game-wrap',{placeholder:'Your move...',onSend:async({type,text})=>{
    const userMsg = mkMsg('user',type,text);
    gs.messages = [...(gs.messages||[]),userMsg];
    S.games[gameId]=gs; saveS();
    msgs.insertAdjacentHTML('beforeend',bubble(userMsg)); scrollBot(msgs);
    msgs.insertAdjacentHTML('beforeend',typingHTML()); scrollBot(msgs);
    await delay(1500+Math.random()*1000);
    const ti = $('typing'); if(ti) ti.remove();
    const note = buildGameNote(gameType,gs,text);
    const resp = await claude(gs.opponentId,gs.messages||[],note);
    const aiMsg = mkMsg(gs.opponentId,'text',resp);
    gs.messages = [...(gs.messages||[]),aiMsg];
    updateGameState(gameId,gameType,gs,text,resp);
    msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
    const statusBar = $('game-status'); if(statusBar) statusBar.innerHTML = renderGameStatus(S.games[gameId]);
    scrollBot(msgs);
  }});
}

function renderGameStatus(gs){
  if (gs.type==='antakshari') return `<div class="game-status-bar__item"><div class="game-status-bar__value">${gs.currentLetter||'?'}</div><div class="game-status-bar__label">Current Letter</div></div>`;
  if (gs.type.startsWith('trivia')) return `<div class="game-status-bar__item"><div class="game-status-bar__value">Q${gs.questionNumber||1}</div><div class="game-status-bar__label">Question</div></div><div class="game-status-bar__item"><div class="game-status-bar__value">${gs.score?.user||0}–${gs.score?.ai||0}</div><div class="game-status-bar__label">Score</div></div>`;
  return `<div class="game-status-bar__item"><div class="game-status-bar__value">${ej('game')}</div><div class="game-status-bar__label">Playing</div></div>`;
}
function buildGameNote(gameType,gs,userMove){
  if (gameType==='antakshari') return `You are playing Antakshari. User said: "${userMove}". Check if it's a real Bollywood/Indian song and starts with letter "${gs.currentLetter||'any'}". If valid, acknowledge it warmly and give your song starting with the last letter of their song. Clearly state the new required letter. Format: "[User song] ✓ | My song: [Your Song] — [Film] | Your letter: [letter]"`;
  if (gameType==='trivia-bollywood'){const q=BOLLYWOOD_QUESTIONS[(gs.questionNumber-1)%BOLLYWOOD_QUESTIONS.length];return `You are playing Bollywood Trivia. ${gs.lastQuestion?`User answered "${userMove}" to "${gs.lastQuestion}". The correct answer is "${q.a}". Say if correct/incorrect, give right answer if wrong. Then ask the next question.`:`Ask question: "${q.q}"`}`;}
  return `You are playing ${gameType}. User said: "${userMove}". Respond naturally.`;
}
function updateGameState(gameId,gameType,gs,userMove,aiResp){
  if (gameType==='antakshari') { const m=aiResp.match(/letter:\s*([A-Za-z])/i); if(m) gs.currentLetter=m[1].toUpperCase(); }
  if (gameType.startsWith('trivia')) {
    const q=BOLLYWOOD_QUESTIONS[(gs.questionNumber-1)%BOLLYWOOD_QUESTIONS.length];
    gs.lastQuestion=q.q; gs.questionNumber=(gs.questionNumber||1)+1;
    if(aiResp.toLowerCase().includes('correct')||aiResp.toLowerCase().includes('right')) gs.score.user=(gs.score.user||0)+1;
    else gs.score.ai=(gs.score.ai||0)+1;
  }
  S.games[gameId]=gs; saveS();
}
async function startGameFirstMove(gameId,gameType,msgs){
  const gs = S.games[gameId]; if (!gs) return;
  let firstMsg = '';
  if (gameType==='antakshari') firstMsg=`You are starting Antakshari! Give the first Bollywood song title and tell the user what letter their song must start with (last letter of your song). Format: "I'll start! My song: [Song Name] — [Film]. Your turn — song must start with [letter]!"`;
  else if (gameType==='trivia-bollywood'){const q=BOLLYWOOD_QUESTIONS[0];firstMsg=`Start Bollywood Trivia! Ask this question: "${q.q}" — Give a warm intro first.`;}
  else firstMsg='Start the game with an introduction and first move.';
  msgs.insertAdjacentHTML('beforeend',typingHTML());
  await delay(1000+Math.random()*800);
  const ti = $('typing'); if(ti) ti.remove();
  const resp = await claude(gs.opponentId,[],firstMsg);
  const aiMsg = mkMsg(gs.opponentId,'text',resp);
  gs.messages = [aiMsg];
  if(gameType==='antakshari'){const m=resp.match(/start(?:ing)? with\s+([A-Za-z])/i)||resp.match(/starts? with (?:the letter )?[""']?([A-Za-z])/i)||resp.match(/letter[:\s]+[""']?([A-Za-z])/i);if(m)gs.currentLetter=m[1].toUpperCase();}
  if(gameType.startsWith('trivia')){gs.lastQuestion=BOLLYWOOD_QUESTIONS[0].q;gs.questionNumber=1;}
  S.games[gameId]=gs; saveS();
  msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
  const statusBar=$('game-status'); if(statusBar) statusBar.innerHTML=renderGameStatus(gs);
  scrollBot(msgs);
}

/* ── BOARD GAME SHARED HELPERS ── */
let _gVoiceInterval = null;

// Player bar + voice bar HTML shared by all board games
function _boardTopBars(gs){
  const persona = PERSONAS[gs.opponentId];
  const spectators = (gs.spectators||[]).map(id=>PERSONAS[id]).filter(Boolean);
  const userName = S.userName||'You';
  const allVoice = [
    {id:'user', name:userName, isUser:true},
    {id:gs.opponentId, name:persona.name, isUser:false},
    ...spectators.map(p=>({id:p.id, name:p.name, isUser:false}))
  ];
  const voiceAvatars = allVoice.map(p=>`<div class="gvb-av" id="gvb-${p.id}">${avatar(p.name,'sm',p.isUser?null:p.id)}</div>`).join('');
  const pbar = `
    <div class="board-player-bar">
      <div class="board-player">
        <div class="bpav-ring" id="bpav-user">${avatar(userName,'sm',null)}</div>
        <span>${userName.split(' ')[0]}</span>
        <span class="board-player__score" id="bps-user">${gs.score?.user||0}</span>
      </div>
      <div class="turn-pill turn-pill--your" id="turn-pill">YOUR TURN</div>
      <div class="board-player">
        <div class="bpav-ring" id="bpav-ai">${avatar(persona.name,'sm',persona.id)}</div>
        <span>${persona.name.split(' ')[0]}</span>
        <span class="board-player__score" id="bps-ai">${gs.score?.ai||0}</span>
      </div>
    </div>`;
  const vbar = `
    <div class="game-voice-bar">
      ${ej('mic','14px')}
      <span class="gvb-count">${allVoice.length} in voice</span>
      <div class="gvb-avatars">${voiceAvatars}</div>
    </div>`;
  return {pbar, vbar};
}

// Rotate the speaking ring among voice participants; registers router cleanup
function _startVoiceAnim(gs){
  if (_gVoiceInterval) clearInterval(_gVoiceInterval);
  const voiceIds = ['user', gs.opponentId, ...(gs.spectators||[])];
  let vIdx = 0;
  _gVoiceInterval = setInterval(()=>{
    document.querySelectorAll('.gvb-av').forEach(el=>el.classList.remove('gvb-speaking'));
    vIdx = (vIdx+1) % voiceIds.length;
    const el = document.getElementById('gvb-'+voiceIds[vIdx]);
    if (el) el.classList.add('gvb-speaking');
  }, 3500);
  // Piggyback on the voice-room cleanup hook so the router stops the interval on navigation
  window._vrCleanup = ()=>{ clearInterval(_gVoiceInterval); _gVoiceInterval = null; };
}

// Update turn pill + speaking avatar rings + score displays
function _updateTurnUI(gs){
  const pill = document.getElementById('turn-pill');
  if (pill) {
    if      (gs.winner==='user') { pill.className='turn-pill turn-pill--win';  pill.innerHTML='You win! '+ej('party','14px'); }
    else if (gs.winner==='ai')   { pill.className='turn-pill turn-pill--lose'; pill.innerHTML=`${PERSONAS[gs.opponentId]?.name.split(' ')[0]} wins!`; }
    else if (gs.winner==='draw') { pill.className='turn-pill turn-pill--draw'; pill.innerHTML='Draw!'; }
    else if (gs.currentTurn==='user') { pill.className='turn-pill turn-pill--your'; pill.innerHTML='YOUR TURN'; }
    else                              { pill.className='turn-pill turn-pill--wait'; pill.innerHTML=`${PERSONAS[gs.opponentId]?.name.split(' ')[0]}…`; }
  }
  const bpUser = document.getElementById('bpav-user');
  const bpAi   = document.getElementById('bpav-ai');
  if (bpUser) bpUser.classList.toggle('bpav-speaking', gs.currentTurn==='user' && !gs.winner);
  if (bpAi)   bpAi.classList.toggle('bpav-speaking',   gs.currentTurn==='ai'   && !gs.winner);
  const bsu = document.getElementById('bps-user'), bsa = document.getElementById('bps-ai');
  if (bsu) bsu.textContent = gs.score?.user||0;
  if (bsa) bsa.textContent = gs.score?.ai||0;
}

// HTML for the game chat section
function _gameChatHtml(gameId){
  return `<div class="game-chat-wrap">
    <div class="game-chat-msgs" id="gchat-msgs"></div>
    <div class="game-chat-input-row">
      <input class="game-chat-input" id="gchat-input" placeholder="Chat during the game…" type="text" onkeydown="if(event.key==='Enter')sendBoardChat('${gameId}')">
      <button class="game-chat-send" onclick="sendBoardChat('${gameId}')">${IC.send}</button>
    </div>
  </div>`;
}

// Replay saved chat messages on render
function renderBoardChat(gameId){
  const gs = S.games[gameId]; if (!gs) return;
  (gs.chatMessages||[]).forEach(m => _appendGChatMsg(m));
}

// Append one message to the in-game chat panel
function _appendGChatMsg(m){
  const msgs = document.getElementById('gchat-msgs'); if (!msgs) return;
  const isUser = m.from === 'user';
  const name = !isUser ? (PERSONAS[m.from]?.name||'') : '';
  const div = document.createElement('div');
  div.className = 'gchat-msg' + (isUser?' gchat-msg--user':'');
  div.innerHTML = (name ? `<span class="gchat-name">${name}</span> ` : '') + renderEmoji(m.text||'');
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// User sends a chat message; a spectator replies via Claude
async function sendBoardChat(gameId){
  const input = document.getElementById('gchat-input'); if (!input) return;
  const text = input.value.trim(); if (!text) return;
  input.value = '';
  const gs = S.games[gameId]; if (!gs) return;
  const msg = mkMsg('user','text',text);
  gs.chatMessages = [...(gs.chatMessages||[]), msg];
  S.games[gameId]=gs; saveS();
  _appendGChatMsg(msg);
  await delay(900+Math.random()*800);
  if (!document.getElementById('gchat-msgs')) return;
  const responderId = gs.spectators?.length
    ? gs.spectators[Math.floor(Math.random()*gs.spectators.length)]
    : gs.opponentId;
  const responder = PERSONAS[responderId]; if (!responder) return;
  const reply = await claude(responderId,[{role:'user',content:text}],`You are ${responder.name}, watching a ${gameTypes[gs.type]?.name||'board'} game. Reply briefly in character (1 sentence max). Be casual.`);
  const aiMsg = mkMsg(responderId,'text',reply);
  gs.chatMessages = [...(gs.chatMessages||[]), aiMsg];
  S.games[gameId]=gs; saveS();
  _appendGChatMsg(aiMsg);
}

// Spectator drops a quick comment after a move (no API call — keeps it fast)
const _SPEC_COMMENTS = [
  ['Nice move!','Ooh, interesting!','This is getting tense!'],
  ['Hmm, tricky now...','Smart play!','Come on, let\'s see!'],
  ['Oh! Did not expect that!','Good thinking!','Ha, well played!'],
  ['Arre wah!','Kaafi accha!','Interesting choice!'],
];
async function _triggerSpectatorComment(gameId){
  if (Math.random() > 0.42) return;
  const gs = S.games[gameId]; if (!gs || !gs.spectators?.length) return;
  await delay(1800+Math.random()*2000);
  if (!document.getElementById('gchat-msgs')) return;
  const sid = gs.spectators[Math.floor(Math.random()*gs.spectators.length)];
  if (!PERSONAS[sid]) return;
  const pool = _SPEC_COMMENTS[Math.floor(Math.random()*_SPEC_COMMENTS.length)];
  const text = pool[Math.floor(Math.random()*pool.length)];
  const msg = mkMsg(sid,'text',text);
  gs.chatMessages = [...(gs.chatMessages||[]), msg];
  S.games[gameId]=gs; saveS();
  _appendGChatMsg(msg);
}

/* ── TIC TAC TOE ── */
function renderTicTacToe(gameId){
  const gs = S.games[gameId]; const persona = gs ? PERSONAS[gs.opponentId] : null;
  if (!gs || !persona) { navigate('#/games'); return; }
  const {pbar,vbar} = _boardTopBars(gs);
  mount(`
    ${header(`${ej('circle-o')} Tic Tac Toe`,{back:true,subtitle:`vs ${persona.name}`})}
    <div class="screen board-game-screen">
      ${pbar}${vbar}
      <div class="screen__scroll board-game-scroll">
        <div class="ttt-board" id="ttt-board"></div>
        <div class="board-status" id="board-status"></div>
        ${_gameChatHtml(gameId)}
      </div>
    </div>
  `);
  _tttRefresh(gameId);
  renderBoardChat(gameId);
  _startVoiceAnim(gs);
}
function _tttRefresh(gameId){
  const gs = S.games[gameId]; if (!gs) return;
  const boardEl = $('ttt-board'); if (!boardEl) return;
  boardEl.innerHTML = '';
  gs.board.forEach((cell,i)=>{
    const btn = document.createElement('button');
    btn.className = 'ttt-cell' + (cell ? ` ttt-${cell.toLowerCase()}` : '');
    btn.textContent = cell==='X' ? '✕' : cell==='O' ? '◯' : '';
    btn.disabled = !!cell || !!gs.winner || gs.currentTurn!=='user';
    btn.onclick = ()=>tttMove(gameId,i);
    boardEl.appendChild(btn);
  });
  _updateTurnUI(gs);
  const statusEl = $('board-status'); if (!statusEl) return;
  statusEl.innerHTML = gs.winner ? `<button class="board-rematch-btn" onclick="tttRematch('${gameId}')">Play Again</button>` : '';
}
function _tttWinner(b){
  const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const[a,c,d]of lines){ if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return b[a]; }
  return b.every(c=>c) ? 'draw' : null;
}
function _tttMinimax(b,isMax){
  const w=_tttWinner(b);
  if(w==='O') return 10; if(w==='X') return -10; if(w==='draw') return 0;
  let best = isMax ? -Infinity : Infinity;
  b.forEach((_,i)=>{ if(!b[i]){ b[i]=isMax?'O':'X'; const s=_tttMinimax(b,!isMax); b[i]=null; best=isMax?Math.max(best,s):Math.min(best,s); } });
  return best;
}
function _tttBest(b){
  let best=-Infinity, move=-1;
  b.forEach((_,i)=>{ if(!b[i]){ b[i]='O'; const s=_tttMinimax(b,false); b[i]=null; if(s>best){best=s;move=i;} } });
  return move;
}
async function tttMove(gameId,idx){
  const gs = S.games[gameId];
  if (!gs||gs.board[idx]||gs.winner||gs.currentTurn!=='user') return;
  gs.board[idx]='X';
  const w = _tttWinner(gs.board);
  if (w) { gs.winner=w==='X'?'user':w==='draw'?'draw':'ai'; if(gs.winner==='user')gs.score.user=(gs.score.user||0)+1; S.games[gameId]=gs; saveS(); _tttRefresh(gameId); _triggerSpectatorComment(gameId); return; }
  gs.currentTurn='ai'; S.games[gameId]=gs; saveS(); _tttRefresh(gameId);
  _triggerSpectatorComment(gameId);
  await delay(500+Math.random()*400);
  const ai = _tttBest([...gs.board]); gs.board[ai]='O';
  const w2 = _tttWinner(gs.board);
  if (w2) { gs.winner=w2==='O'?'ai':w2==='draw'?'draw':'user'; if(gs.winner==='ai')gs.score.ai=(gs.score.ai||0)+1; }
  else gs.currentTurn='user';
  S.games[gameId]=gs; saveS(); _tttRefresh(gameId);
}
function tttRematch(gameId){
  const gs = S.games[gameId];
  gs.board=Array(9).fill(null); gs.winner=null; gs.currentTurn='user';
  S.games[gameId]=gs; saveS(); _tttRefresh(gameId);
}

/* ── CONNECT FOUR ── */
function renderConnectFour(gameId){
  const gs = S.games[gameId]; const persona = gs ? PERSONAS[gs.opponentId] : null;
  if (!gs || !persona) { navigate('#/games'); return; }
  const {pbar,vbar} = _boardTopBars(gs);
  mount(`
    ${header(`${ej('red-circle')} Connect Four`,{back:true,subtitle:`vs ${persona.name}`})}
    <div class="screen board-game-screen">
      ${pbar}${vbar}
      <div class="screen__scroll board-game-scroll">
        <div class="c4-wrap">
          <div class="c4-drop-row" id="c4-cols"></div>
          <div class="c4-board" id="c4-board"></div>
        </div>
        <div class="board-status" id="board-status"></div>
        ${_gameChatHtml(gameId)}
      </div>
    </div>
  `);
  _c4Refresh(gameId);
  renderBoardChat(gameId);
  _startVoiceAnim(gs);
}
function _c4Refresh(gameId){
  const gs = S.games[gameId]; if (!gs) return;
  const boardEl = $('c4-board'); if (!boardEl) return;
  boardEl.innerHTML = '';
  for(let r=0;r<6;r++){ for(let c=0;c<7;c++){
    const cell = document.createElement('div'); cell.className='c4-cell';
    const v = gs.board[r*7+c];
    if(v==='R') cell.classList.add('c4-red'); else if(v==='Y') cell.classList.add('c4-yellow');
    boardEl.appendChild(cell);
  }}
  const colsEl = $('c4-cols'); if(colsEl){
    colsEl.innerHTML='';
    for(let c=0;c<7;c++){
      const btn=document.createElement('button'); btn.className='c4-drop-btn';
      btn.textContent='▼';
      btn.disabled=!!gs.winner||gs.currentTurn!=='user'||!!gs.board[c];
      btn.onclick=(()=>{ const col=c; return()=>c4Move(gameId,col); })();
      colsEl.appendChild(btn);
    }
  }
  _updateTurnUI(gs);
  const statusEl=$('board-status'); if(!statusEl)return;
  statusEl.innerHTML=gs.winner?`<button class="board-rematch-btn" onclick="c4Rematch('${gameId}')">Play Again</button>`:'';
}
function _c4Drop(board,col,piece){ for(let r=5;r>=0;r--){ if(!board[r*7+col]){board[r*7+col]=piece;return true;} } return false; }
function _c4Winner(board){
  for(let r=0;r<6;r++){ for(let c=0;c<7;c++){
    const v=board[r*7+c]; if(!v) continue;
    if(c+3<7&&v===board[r*7+c+1]&&v===board[r*7+c+2]&&v===board[r*7+c+3]) return v;
    if(r+3<6&&v===board[(r+1)*7+c]&&v===board[(r+2)*7+c]&&v===board[(r+3)*7+c]) return v;
    if(r+3<6&&c+3<7&&v===board[(r+1)*7+c+1]&&v===board[(r+2)*7+c+2]&&v===board[(r+3)*7+c+3]) return v;
    if(r+3<6&&c-3>=0&&v===board[(r+1)*7+c-1]&&v===board[(r+2)*7+c-2]&&v===board[(r+3)*7+c-3]) return v;
  }}
  return board.every(c=>c) ? 'draw' : null;
}
function _c4AICol(board){
  for(let c=0;c<7;c++){ if(board[c])continue; const t=[...board]; _c4Drop(t,c,'Y'); if(_c4Winner(t)==='Y') return c; }
  for(let c=0;c<7;c++){ if(board[c])continue; const t=[...board]; _c4Drop(t,c,'R'); if(_c4Winner(t)==='R') return c; }
  const pref=[3,2,4,1,5,0,6].filter(c=>!board[c]);
  return pref[Math.floor(Math.random()*Math.min(3,pref.length))];
}
async function c4Move(gameId,col){
  const gs=S.games[gameId];
  if(!gs||gs.winner||gs.currentTurn!=='user'||gs.board[col])return;
  _c4Drop(gs.board,col,'R');
  const w=_c4Winner(gs.board);
  if(w){gs.winner=w==='R'?'user':w==='draw'?'draw':'ai';if(gs.winner==='user')gs.score.user=(gs.score.user||0)+1;S.games[gameId]=gs;saveS();_c4Refresh(gameId);_triggerSpectatorComment(gameId);return;}
  gs.currentTurn='ai'; S.games[gameId]=gs; saveS(); _c4Refresh(gameId);
  _triggerSpectatorComment(gameId);
  await delay(600+Math.random()*500);
  const ai=_c4AICol([...gs.board]); if(ai>=0) _c4Drop(gs.board,ai,'Y');
  const w2=_c4Winner(gs.board);
  if(w2){gs.winner=w2==='Y'?'ai':w2==='draw'?'draw':'user';if(gs.winner==='ai')gs.score.ai=(gs.score.ai||0)+1;}
  else gs.currentTurn='user';
  S.games[gameId]=gs; saveS(); _c4Refresh(gameId);
}
function c4Rematch(gameId){
  const gs=S.games[gameId];
  gs.board=Array(42).fill(null); gs.winner=null; gs.currentTurn='user';
  S.games[gameId]=gs; saveS(); _c4Refresh(gameId);
}

/* ── MEMORY MATCH ── */
function renderMemoryMatch(gameId){
  const gs=S.games[gameId]; const persona=gs?PERSONAS[gs.opponentId]:null;
  if(!gs||!persona){navigate('#/games');return;}
  const {pbar,vbar}=_boardTopBars(gs);
  mount(`
    ${header(`${ej('joker')} Memory Match`,{back:true,subtitle:`vs ${persona.name}`})}
    <div class="screen board-game-screen">
      ${pbar}${vbar}
      <div class="screen__scroll board-game-scroll">
        <div class="memory-board" id="memory-board"></div>
        <div class="board-status" id="board-status"></div>
        ${_gameChatHtml(gameId)}
      </div>
    </div>
  `);
  _memRefresh(gameId);
  renderBoardChat(gameId);
  _startVoiceAnim(gs);
}
function _memRefresh(gameId){
  const gs=S.games[gameId]; if(!gs)return;
  const boardEl=$('memory-board'); if(!boardEl)return;
  boardEl.innerHTML='';
  gs.cards.forEach((card,i)=>{
    const btn=document.createElement('button');
    const show=card.flipped||card.matched;
    btn.className='memory-card'+(show?' flipped':'')+(card.matched?' matched':'');
    btn.innerHTML=show?ej(card.emoji,'32px'):'';
    btn.disabled=card.flipped||card.matched||gs.currentTurn!=='user'||gs.flippedIndices.length>=2;
    btn.onclick=()=>memFlip(gameId,i);
    boardEl.appendChild(btn);
  });
  const total=gs.cards.length/2, matched=gs.cards.filter(c=>c.matched).length/2;
  if(matched===total){
    // Game over — show winner in turn pill
    const pill=document.getElementById('turn-pill');
    if(pill){
      if(gs.score.user>gs.score.ai)      {pill.className='turn-pill turn-pill--win'; pill.innerHTML='You win! '+ej('party','14px');}
      else if(gs.score.ai>gs.score.user) {pill.className='turn-pill turn-pill--lose';pill.innerHTML=`${PERSONAS[gs.opponentId]?.name.split(' ')[0]} wins!`;}
      else                               {pill.className='turn-pill turn-pill--draw';pill.innerHTML="Tie game!";}
    }
    const statusEl=$('board-status');
    if(statusEl) statusEl.innerHTML=`<button class="board-rematch-btn" onclick="memRematch('${gameId}')">Play Again</button>`;
  } else {
    _updateTurnUI(gs);
    const statusEl=$('board-status');
    if(statusEl) statusEl.innerHTML='';
  }
}
async function memFlip(gameId,index){
  const gs=S.games[gameId];
  if(!gs||gs.currentTurn!=='user'||gs.cards[index].flipped||gs.cards[index].matched||gs.flippedIndices.length>=2)return;
  gs.cards[index].flipped=true;
  gs.flippedIndices=[...gs.flippedIndices,index];
  S.games[gameId]=gs; saveS(); _memRefresh(gameId);
  if(gs.flippedIndices.length===2){
    const[a,b]=gs.flippedIndices;
    await delay(900);
    if(gs.cards[a].emoji===gs.cards[b].emoji){
      gs.cards[a].matched=gs.cards[b].matched=true;
      gs.score.user=(gs.score.user||0)+1;
      gs.flippedIndices=[];
      _triggerSpectatorComment(gameId);
    } else {
      gs.cards[a].flipped=gs.cards[b].flipped=false;
      gs.flippedIndices=[]; gs.currentTurn='ai';
    }
    S.games[gameId]=gs; saveS(); _memRefresh(gameId);
    if(gs.currentTurn==='ai'){ await delay(700); _memAITurn(gameId); }
  }
}
async function _memAITurn(gameId){
  const gs=S.games[gameId]; if(!gs||gs.currentTurn!=='ai')return;
  const unmatched=gs.cards.map((c,i)=>({...c,i})).filter(c=>!c.matched&&!c.flipped);
  if(unmatched.length<2){gs.currentTurn='user';S.games[gameId]=gs;saveS();_memRefresh(gameId);return;}
  const picks=[...unmatched].sort(()=>Math.random()-0.5).slice(0,2);
  gs.cards[picks[0].i].flipped=true; gs.flippedIndices=[picks[0].i];
  S.games[gameId]=gs; saveS(); _memRefresh(gameId);
  await delay(700);
  gs.cards[picks[1].i].flipped=true; gs.flippedIndices=[picks[0].i,picks[1].i];
  S.games[gameId]=gs; saveS(); _memRefresh(gameId);
  await delay(900);
  if(gs.cards[picks[0].i].emoji===gs.cards[picks[1].i].emoji){
    gs.cards[picks[0].i].matched=gs.cards[picks[1].i].matched=true;
    gs.score.ai=(gs.score.ai||0)+1; gs.flippedIndices=[];
    S.games[gameId]=gs; saveS(); _memRefresh(gameId);
    await delay(400); _memAITurn(gameId);
  } else {
    gs.cards[picks[0].i].flipped=gs.cards[picks[1].i].flipped=false;
    gs.flippedIndices=[]; gs.currentTurn='user';
    S.games[gameId]=gs; saveS(); _memRefresh(gameId);
  }
}
function memRematch(gameId){
  const gs=S.games[gameId];
  const cards=[...MEMORY_EMOJIS,...MEMORY_EMOJIS].sort(()=>Math.random()-0.5).map((e,i)=>({id:i,emoji:e,flipped:false,matched:false}));
  gs.cards=cards; gs.flippedIndices=[]; gs.score={user:0,ai:0}; gs.currentTurn='user';
  S.games[gameId]=gs; saveS(); _memRefresh(gameId);
}

/* ── HANGMAN ── */
function renderHangman(gameId){
  const gs=S.games[gameId]; const persona=gs?PERSONAS[gs.opponentId]:null;
  if(!gs||!persona){navigate('#/games');return;}
  const {vbar}=_boardTopBars(gs);
  mount(`
    ${header(`${ej('text-abc')} Hangman`,{back:true,subtitle:`${persona.name} chose the word`})}
    <div class="screen board-game-screen">
      ${vbar}
      <div class="screen__scroll board-game-scroll">
        <div class="hangman-wrap" id="hangman-wrap"></div>
        ${_gameChatHtml(gameId)}
      </div>
    </div>
  `);
  _hangRefresh(gameId);
  renderBoardChat(gameId);
  _startVoiceAnim(gs);
}
function _hangRefresh(gameId){
  const gs=S.games[gameId]; const wrap=$('hangman-wrap'); if(!wrap)return;
  const word=gs.word, guessed=gs.guessed||[], attempts=gs.attempts||0, max=gs.maxAttempts||6;
  const won=word.split('').every(l=>guessed.includes(l));
  const lost=attempts>=max;
  const parts=[
    '<circle cx="60" cy="30" r="14" fill="none" stroke="#333" stroke-width="3"/>',
    '<line x1="60" y1="44" x2="60" y2="90" stroke="#333" stroke-width="3"/>',
    '<line x1="60" y1="58" x2="36" y2="78" stroke="#333" stroke-width="3"/>',
    '<line x1="60" y1="58" x2="84" y2="78" stroke="#333" stroke-width="3"/>',
    '<line x1="60" y1="90" x2="40" y2="116" stroke="#333" stroke-width="3"/>',
    '<line x1="60" y1="90" x2="80" y2="116" stroke="#333" stroke-width="3"/>',
  ];
  const wordHtml=word.split('').map(l=>`<span class="hangman-letter${guessed.includes(l)?' revealed':''}">${guessed.includes(l)||(lost)?l:'_'}</span>`).join('');
  const keys='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l=>{
    const used=guessed.includes(l);
    return`<button class="hangman-key${used?(word.includes(l)?' correct':' wrong'):''}" ${used||won||lost?'disabled':''} onclick="hangGuess('${gameId}','${l}')">${l}</button>`;
  }).join('');
  wrap.innerHTML=`
    <svg class="hangman-svg" viewBox="0 0 120 140">
      <line x1="10" y1="135" x2="110" y2="135" stroke="#333" stroke-width="3"/>
      <line x1="28" y1="135" x2="28" y2="5" stroke="#333" stroke-width="3"/>
      <line x1="28" y1="5" x2="60" y2="5" stroke="#333" stroke-width="3"/>
      <line x1="60" y1="5" x2="60" y2="16" stroke="#333" stroke-width="3"/>
      ${parts.slice(0,attempts).join('')}
    </svg>
    <div class="hangman-word">${wordHtml}</div>
    <div class="hangman-hint">${attempts} / ${max} wrong guesses</div>
    ${won?`<div class="board-result win">You got it! ${ej('party')}</div><button class="board-rematch-btn" onclick="hangRematch('${gameId}')">New Word</button>`:''}
    ${lost&&!won?`<div class="board-result lose">The word was <strong>${word}</strong></div><button class="board-rematch-btn" onclick="hangRematch('${gameId}')">Try Again</button>`:''}
    ${!won&&!lost?`<div class="hangman-keys">${keys}</div>`:''}
  `;
}
function hangGuess(gameId,letter){
  const gs=S.games[gameId]; if(!gs||gs.guessed.includes(letter))return;
  gs.guessed=[...gs.guessed,letter];
  if(!gs.word.includes(letter)) gs.attempts=(gs.attempts||0)+1;
  S.games[gameId]=gs; saveS(); _hangRefresh(gameId);
  _triggerSpectatorComment(gameId);
}
function hangRematch(gameId){
  const gs=S.games[gameId];
  gs.word=HANGMAN_WORDS[Math.floor(Math.random()*HANGMAN_WORDS.length)];
  gs.guessed=[]; gs.attempts=0;
  S.games[gameId]=gs; saveS(); _hangRefresh(gameId);
}
