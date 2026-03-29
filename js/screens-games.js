/* ============================================================
   DES2026 — Games hub, game sheet, and game screen
   ============================================================ */

/* ── CONSTANTS ── */
const MEMORY_EMOJIS = ['prayer','music','cricket','seedling','books','pot','smile','sunrise'];

// Static lobby rooms — AI personas + watchers waiting to play
const SEED_LOBBIES = [
  {type:'tictactoe',  personaId:'rameshbhai',  watchers:['meenakshiamma','lalitha'],    label:'3 in room', waiting:'Rameshbhai waiting'},
  {type:'connectfour',personaId:'harbhajan',   watchers:['krishnaswamy','abdulrehman'], label:'3 in room', waiting:'Harbhajan waiting'},
  {type:'memory',     personaId:'sunitadevi',  watchers:['padmavathi','rameshbhai'],    label:'3 in room', waiting:'Sunita Devi waiting'},
  {type:'tambola',    personaId:'rameshbhai',   watchers:['sunitadevi'],                 label:'2 in room', waiting:'Rameshbhai waiting'},
  {type:'teenpatti',  personaId:'harbhajan',    watchers:['krishnaswamy'],               label:'2 in room', waiting:'Harbhajan waiting'},
];

const gameTypes = {
  antakshari:        {id:'antakshari',        emoji:'music',     name:'Antakshari',       desc:'Song chain — last letter starts next song',    category:'chat'},
  'trivia-bollywood':{id:'trivia-bollywood',  emoji:'film',      name:'Bollywood Trivia', desc:'Questions about Hindi films',                  category:'chat'},
  tictactoe:         {id:'tictactoe',         emoji:'circle-o',  name:'Tic Tac Toe',      desc:'Classic 3-in-a-row — can you beat the AI?',   category:'board'},
  connectfour:       {id:'connectfour',       emoji:'red-circle',name:'Connect Four',     desc:'Drop pieces, four in a row wins',              category:'board'},
  memory:            {id:'memory',            emoji:'joker',     name:'Memory Match',     desc:'Flip cards and find matching pairs',           category:'board'},
  tambola:           {id:'tambola',           emoji:'game',      name:'Tambola',          desc:'Indian bingo — mark numbers on your ticket',   category:'board'},
  teenpatti:         {id:'teenpatti',         emoji:'joker',     name:'Teen Patti',       desc:'3-card Indian poker against the dealer',       category:'board'},
  chess:             {id:'chess',             emoji:'game',      name:'Chess',            desc:'Classic chess — drag pieces to move',           category:'board'},
  solitaire:         {id:'solitaire',         emoji:'joker',     name:'Solitaire',        desc:'Klondike card game — tap to move cards',       category:'board'},
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
  if (type === 'tambola') {
    return {...base, gameState:{ticket:generateTambolaTicket(),called:[],marked:[]}};
  }
  if (type === 'teenpatti') {
    const deck = shuffleDeck();
    return {...base, gameState:{deck,playerHand:[deck[0],deck[2],deck[4]],aiHand:[deck[1],deck[3],deck[5]],pot:0,stake:10,phase:'bet'}};
  }
  if (type === 'chess') {
    return {...base, gameState:{fen:null}};
  }
  if (type === 'solitaire') {
    return {...base, gameState:initSolitaire()};
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
  const isBoardGame = ['tictactoe','connectfour','memory','tambola','teenpatti','chess','solitaire'].includes(g.type);
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
  if (gameType === 'tambola')     return renderTambola(gameId);
  if (gameType === 'teenpatti')   return renderTeenPatti(gameId);
  if (gameType === 'chess')       return renderChess(gameId);
  if (gameType === 'solitaire')   return renderSolitaire(gameId);
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
      ${ej('circle-o','14px')}
      <span class="gvb-count">${allVoice.length} watching</span>
      <div class="gvb-avatars">${voiceAvatars}</div>
    </div>`;
  return {pbar, vbar};
}

// No-op: voice animation removed — bar now shows static spectator count
function _startVoiceAnim(gs){
  if (_gVoiceInterval) { clearInterval(_gVoiceInterval); _gVoiceInterval = null; }
  window._vrCleanup = ()=>{};
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
// Contextual comment pools keyed by situation
const _SPEC_WIN_COMMENTS  = ['Wah! Brilliant!','You did it!','Arre wah, well played!','Yes yes yes!'];
const _SPEC_TENSE_COMMENTS = ['Ooh, this is close!','Tension tension!','Kaafi tight game yaar!','One wrong move and it\'s over...'];
const _SPEC_TAMBOLA_HIT   = ['Ooh, that\'s on your ticket!','Lucky number!','Mark it mark it!','Arey that one\'s yours!'];

// Pick a contextual pool for the current game moment, or fall back to random neutral pool
function _pickCommentPool(gs){
  const type = gs.type;
  // Win moments for turn-based games
  if ((type==='tictactoe'||type==='connectfour') && gs.winner==='user') return _SPEC_WIN_COMMENTS;
  // Tense moment: board almost full with no winner yet
  if (type==='tictactoe' && !gs.winner) {
    const filled = gs.board.filter(Boolean).length;
    if (filled >= 6) return _SPEC_TENSE_COMMENTS;
  }
  if (type==='connectfour' && !gs.winner) {
    const filled = gs.board.filter(Boolean).length;
    if (filled >= 30) return _SPEC_TENSE_COMMENTS;
  }
  // Tambola: last called number is on the player's ticket
  if (type==='tambola' && gs.gameState) {
    const ts = gs.gameState;
    const last = ts.called[ts.called.length-1];
    if (last && ts.ticket.some(row=>row.includes(last))) return _SPEC_TAMBOLA_HIT;
  }
  return _SPEC_COMMENTS[Math.floor(Math.random()*_SPEC_COMMENTS.length)];
}

async function _triggerSpectatorComment(gameId){
  if (Math.random() > 0.42) return;
  const gs = S.games[gameId]; if (!gs || !gs.spectators?.length) return;
  await delay(1800+Math.random()*2000);
  if (!document.getElementById('gchat-msgs')) return;
  const sid = gs.spectators[Math.floor(Math.random()*gs.spectators.length)];
  if (!PERSONAS[sid]) return;
  const pool = _pickCommentPool(gs);
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
  if (w) { gs.winner=w==='X'?'user':w==='draw'?'draw':'ai'; if(gs.winner==='user')gs.score.user=(gs.score.user||0)+1; S.games[gameId]=gs; _postGameResultToChat(gs); saveS(); _tttRefresh(gameId); _triggerSpectatorComment(gameId); return; }
  gs.currentTurn='ai'; S.games[gameId]=gs; saveS(); _tttRefresh(gameId);
  _triggerSpectatorComment(gameId);
  await delay(500+Math.random()*400);
  const ai = _tttBest([...gs.board]); gs.board[ai]='O';
  const w2 = _tttWinner(gs.board);
  if (w2) { gs.winner=w2==='O'?'ai':w2==='draw'?'draw':'user'; if(gs.winner==='ai')gs.score.ai=(gs.score.ai||0)+1; _postGameResultToChat(gs); }
  else gs.currentTurn='user';
  S.games[gameId]=gs; saveS(); _tttRefresh(gameId);
}
function tttRematch(gameId){
  const gs = S.games[gameId];
  gs.board=Array(9).fill(null); gs.winner=null; gs.currentTurn='user'; gs.resultPosted=false;
  S.games[gameId]=gs; saveS(); _tttRefresh(gameId);
}

/* Post a one-time reaction message from the persona to their 1:1 chat.
   Uses a flag on the game object to prevent duplicate posts on re-render. */
function _postGameResultToChat(gs) {
  const personaId = gs.opponentId;
  if (!personaId || gs.resultPosted) return;
  gs.resultPosted = true;
  const WIN_MSGS = [
    'Arey wah! You beat me! 😄 Good game, very good game!',
    'Wah wah! You won! I need to practise more — well played!',
    'Arey yaar, you got me this time! Good game! 😄',
  ];
  const LOSE_MSGS = [
    'Ha! I won this time! Rematch karoge? 😄',
    'Haha, better luck next time! I was waiting for that moment! 😄',
    'Arey, I won! Come on, one more game?',
  ];
  const DRAW_MSGS = [
    'Draw! Very evenly matched we are! 😄',
    'Haha, a draw! Neither of us will give up easily!',
    'Tie game! We think alike — rematch?',
  ];
  let pool;
  if      (gs.winner === 'user') pool = WIN_MSGS;
  else if (gs.winner === 'ai')   pool = LOSE_MSGS;
  else                           pool = DRAW_MSGS;
  const text = pool[Math.floor(Math.random() * pool.length)];
  addMsg('chats', personaId, mkMsg(personaId, 'text', text));
  if (!S.unreadChats) S.unreadChats = {};
  S.unreadChats[personaId] = (S.unreadChats[personaId] || 0) + 1;
  saveS();
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
  if(w){gs.winner=w==='R'?'user':w==='draw'?'draw':'ai';if(gs.winner==='user')gs.score.user=(gs.score.user||0)+1;S.games[gameId]=gs;_postGameResultToChat(gs);saveS();_c4Refresh(gameId);_triggerSpectatorComment(gameId);return;}
  gs.currentTurn='ai'; S.games[gameId]=gs; saveS(); _c4Refresh(gameId);
  _triggerSpectatorComment(gameId);
  await delay(600+Math.random()*500);
  const ai=_c4AICol([...gs.board]); if(ai>=0) _c4Drop(gs.board,ai,'Y');
  const w2=_c4Winner(gs.board);
  if(w2){gs.winner=w2==='Y'?'ai':w2==='draw'?'draw':'user';if(gs.winner==='ai')gs.score.ai=(gs.score.ai||0)+1;_postGameResultToChat(gs);}
  else gs.currentTurn='user';
  S.games[gameId]=gs; saveS(); _c4Refresh(gameId);
}
function c4Rematch(gameId){
  const gs=S.games[gameId];
  gs.board=Array(42).fill(null); gs.winner=null; gs.currentTurn='user'; gs.resultPosted=false;
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

/* ── TAMBOLA (Indian Bingo) ── */
function generateTambolaTicket(){
  // 3x9 grid; each row has 5 numbers, columns map to number ranges
  const ticket = Array.from({length:3}, ()=>Array(9).fill(0));
  const colRanges = [[1,9],[10,19],[20,29],[30,39],[40,49],[50,59],[60,69],[70,79],[80,90]];
  for(let c=0;c<9;c++){
    const [lo,hi] = colRanges[c];
    const nums = [];
    while(nums.length < 3){
      const n = lo + Math.floor(Math.random()*(hi-lo+1));
      if(!nums.includes(n)) nums.push(n);
    }
    nums.sort((a,b)=>a-b);
    for(let i=0;i<nums.length;i++) ticket[i][c] = nums[i];
  }
  // Each row must have exactly 5 numbers — zero out excess
  for(let r=0;r<3;r++){
    const filled = ticket[r].map((v,i)=>({v,i})).filter(x=>x.v>0);
    while(filled.length > 5){
      const idx = filled.splice(Math.floor(Math.random()*filled.length),1)[0].i;
      ticket[r][idx] = 0;
    }
  }
  return ticket;
}

function showTambolaRules(){
  const ov = document.createElement('div');
  ov.className = 'rules-overlay';
  ov.innerHTML = `
    <div class="rules-overlay__box">
      <div class="rules-overlay__title">${ej('game','20px')} How to Play Tambola</div>
      <div class="rules-overlay__body">
        Tambola is Indian Bingo! Numbers 1&ndash;90 are called one by one. Tap a number on your ticket when it is called to mark it. First to complete a full row wins Jaldi Five! Mark all 15 numbers to win Tambola!
      </div>
      <button class="rules-overlay__close btn-primary" onclick="this.closest('.rules-overlay').remove()">Got it!</button>
    </div>`;
  document.body.appendChild(ov);
}

function renderTambola(gameId){
  const gs = S.games[gameId]; const persona = gs?PERSONAS[gs.opponentId]:null;
  if(!gs||!persona){navigate('#/games');return;}
  if(!gs.gameState) gs.gameState = {ticket:generateTambolaTicket(),called:[],marked:[]};
  const ts = gs.gameState;
  const allNums = Array.from({length:90},(_,i)=>i+1).filter(n=>!ts.called.includes(n));
  const win = checkTambolaWin(ts);

  mount(`
    ${header(`${ej('game')} Tambola`,{back:true,subtitle:`with ${persona.name}`})}
    <div class="screen board-game-screen">
      <div class="screen__scroll board-game-scroll">
        <div class="tambola-board" id="tambola-board"></div>
      </div>
    </div>
  `);
  // Show rules once per game session (flag stored on gameState)
  if(!gs.gameState.rulesShown){
    gs.gameState.rulesShown = true;
    S.games[gameId]=gs; saveS();
    showTambolaRules();
  }
  const wrap = $('tambola-board'); if(!wrap) return;
  let html = `<div class="tambola-header-row"><div class="tambola-called">Last called: <span class="tambola-num">${ts.called.length?ts.called[ts.called.length-1]:'--'}</span></div><button class="tambola-info-btn" onclick="showTambolaRules()" title="How to play">?</button></div>`;
  html += `<table class="tambola-ticket">`;
  for(let r=0;r<3;r++){
    html += `<tr>`;
    for(let c=0;c<9;c++){
      const n = ts.ticket[r][c];
      const isMarked = ts.marked.includes(n);
      if(n===0) html += `<td class="tambola-cell tambola-empty"></td>`;
      else html += `<td class="tambola-cell${isMarked?' tambola-marked':''}" onclick="markTambola('${gameId}',${n})">${n}</td>`;
    }
    html += `</tr>`;
  }
  html += `</table>`;
  if(allNums.length > 0) html += `<button class="btn-primary" onclick="callTambola('${gameId}')">Call Next Number</button>`;
  else html += `<div class="game-over-msg">All numbers called!</div>`;
  if(win) html += `<div class="tambola-win">Tambola! You won!</div>`;
  wrap.innerHTML = html;
}

function markTambola(gameId, n){
  const gs = S.games[gameId]; if(!gs||!gs.gameState) return;
  if(!gs.gameState.marked.includes(n) && gs.gameState.called.includes(n)){
    gs.gameState.marked.push(n);
    S.games[gameId]=gs; saveS(); renderGame(gameId,'tambola');
  }
}

function callTambola(gameId){
  const gs = S.games[gameId]; if(!gs) return;
  if(!gs.gameState) gs.gameState = {ticket:generateTambolaTicket(),called:[],marked:[]};
  const remaining = Array.from({length:90},(_,i)=>i+1).filter(n=>!gs.gameState.called.includes(n));
  if(remaining.length===0) return;
  const n = remaining[Math.floor(Math.random()*remaining.length)];
  gs.gameState.called.push(n);
  S.games[gameId]=gs; saveS(); renderGame(gameId,'tambola');
}

function checkTambolaWin(ts){
  if(!ts||!ts.ticket||!ts.marked) return false;
  for(let r=0;r<3;r++)
    for(let c=0;c<9;c++)
      if(ts.ticket[r][c]>0 && !ts.marked.includes(ts.ticket[r][c])) return false;
  return ts.marked.length > 0;
}

/* ── TEEN PATTI (3-card poker vs AI) ── */
const TP_SUITS = ['\u2660','\u2665','\u2666','\u2663'];
const TP_RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

function shuffleDeck(){
  const deck = [];
  for(const s of TP_SUITS) for(const r of TP_RANKS) deck.push({s,r});
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
  return deck;
}

function cardHTML(card, hidden){
  if(hidden) return `<div class="tp-card tp-card--back">\u{1F0A0}</div>`;
  const color = (card.s==='\u2665'||card.s==='\u2666') ? 'red' : 'black';
  return `<div class="tp-card tp-card--${color}">${card.r}${card.s}</div>`;
}

function tpHandRank(hand){
  const rankVal = r => TP_RANKS.indexOf(r);
  const vals = hand.map(c=>rankVal(c.r)).sort((a,b)=>b-a);
  const suits = hand.map(c=>c.s);
  const flush = suits.every(s=>s===suits[0]);
  const straight = (vals[0]-vals[2]===2 && new Set(vals).size===3) ||
                   (vals[0]===12&&vals[1]===1&&vals[2]===0);
  const triple = new Set(vals).size===1;
  const pair = new Set(vals).size===2;
  if(triple) return 6*1000000 + vals[0]*10000;
  if(straight&&flush) return 5*1000000 + vals[0]*10000;
  if(flush) return 4*1000000 + vals[0]*10000+vals[1]*100+vals[2];
  if(straight) return 3*1000000 + vals[0]*10000;
  if(pair) return 2*1000000 + vals[0]*10000 + vals.find((_,i,a)=>a.filter(x=>x===a[i]).length===1)*100;
  return vals[0]*10000+vals[1]*100+vals[2];
}

function showTeenPattiRules(){
  const ov = document.createElement('div');
  ov.className = 'rules-overlay';
  ov.innerHTML = `
    <div class="rules-overlay__box">
      <div class="rules-overlay__title">${ej('joker','20px')} Teen Patti Hands</div>
      <div class="rules-overlay__body">
        <ol style="margin:0;padding-left:18px;line-height:1.8">
          <li><strong>Trail</strong> &mdash; Three of a kind (best)</li>
          <li><strong>Pure Sequence</strong> &mdash; Straight flush</li>
          <li><strong>Sequence</strong> &mdash; Straight (any suit)</li>
          <li><strong>Color</strong> &mdash; Flush (same suit)</li>
          <li><strong>Pair</strong> &mdash; Two of a kind</li>
          <li><strong>High Card</strong> &mdash; Lowest hand</li>
        </ol>
      </div>
      <button class="rules-overlay__close btn-primary" onclick="this.closest('.rules-overlay').remove()">Got it!</button>
    </div>`;
  document.body.appendChild(ov);
}

function renderTeenPatti(gameId){
  const gs = S.games[gameId]; const persona = gs?PERSONAS[gs.opponentId]:null;
  if(!gs||!persona){navigate('#/games');return;}
  if(!gs.gameState||!gs.gameState.deck) tpNewGame(gameId, true);
  const ts = gs.gameState;
  const phase = ts.phase||'bet';
  // Show rules overlay once on first visit
  const showRules = !ts.rulesShown;
  if(showRules){ ts.rulesShown = true; S.games[gameId]=gs; saveS(); }

  mount(`
    ${header(`${ej('joker')} Teen Patti`,{back:true,subtitle:`vs ${persona.name}`})}
    <div class="screen board-game-screen">
      <div class="screen__scroll board-game-scroll">
        <div class="tambola-header-row">
          <span></span>
          <button class="tambola-info-btn" onclick="showTeenPattiRules()" title="Hand rankings">?</button>
        </div>
        <div class="tp-board" id="tp-board"></div>
      </div>
    </div>
  `);
  const wrap = $('tp-board'); if(!wrap) return;
  // Auto-show rules overlay on first visit to this game
  if(showRules) setTimeout(showTeenPattiRules, 120);
  let html = `<div class="tp-pot">Pot: ${ts.pot||0} chips</div>`;
  html += `<div class="tp-hand tp-hand--ai"><div class="tp-hand-label">Dealer</div><div class="tp-hand-cards">`;
  for(const c of ts.aiHand) html += cardHTML(c, phase!=='reveal');
  html += `</div></div>`;
  html += `<div class="tp-hand tp-hand--player"><div class="tp-hand-label">Your hand</div><div class="tp-hand-cards">`;
  for(const c of ts.playerHand) html += cardHTML(c, false);
  html += `</div></div>`;

  if(phase==='bet'){
    html += `<div class="tp-actions">`;
    html += `<button class="btn-secondary" onclick="tpAction('${gameId}','fold')">Fold</button>`;
    html += `<button class="btn-primary" onclick="tpAction('${gameId}','call')">Call (${ts.stake} chips)</button>`;
    html += `</div>`;
  } else {
    const pr = tpHandRank(ts.playerHand), ar = tpHandRank(ts.aiHand);
    const result = pr>ar?'You win!':pr<ar?'Dealer wins':'Tie!';
    html += `<div class="tp-result">${result}</div>`;
    html += `<button class="btn-primary" onclick="tpNewGame('${gameId}')">Play Again</button>`;
  }
  wrap.innerHTML = html;
}

function tpAction(gameId, action){
  const gs = S.games[gameId]; if(!gs||!gs.gameState) return;
  const ts = gs.gameState;
  if(action==='fold') ts.phase='reveal';
  else if(action==='call'){ ts.pot=(ts.pot||0)+ts.stake; ts.phase='reveal'; }
  S.games[gameId]=gs; saveS(); renderGame(gameId,'teenpatti');
}

function tpNewGame(gameId, initOnly){
  const gs = S.games[gameId]; if(!gs) return;
  const deck = shuffleDeck();
  gs.gameState = {deck, playerHand:[deck[0],deck[2],deck[4]], aiHand:[deck[1],deck[3],deck[5]], pot:0, stake:10, phase:'bet'};
  S.games[gameId]=gs; saveS();
  if(!initOnly) renderGame(gameId,'teenpatti');
}

/* ── CHESS ── */
function renderChess(gameId){
  const gs = S.games[gameId]; const persona = gs?PERSONAS[gs.opponentId]:null;
  if(!gs||!persona){navigate('#/games');return;}
  if(!gs.gameState) gs.gameState = {fen:null};
  const id = 'chess-board-'+gameId;

  mount(`
    ${header(`${ej('game')} Chess`,{back:true,subtitle:`vs ${persona.name}`})}
    <div class="screen board-game-screen">
      <div class="screen__scroll board-game-scroll">
        <div class="chess-wrap">
          <div class="chess-ai-note">Beginner AI &mdash; plays random legal moves</div>
          <div id="${id}" style="width:min(340px,90vw)"></div>
          <button class="btn-secondary chess-reset" onclick="resetChess('${gameId}')">New Game</button>
        </div>
      </div>
    </div>
  `);

  // Board renders via chessboard.js CDN after DOM insert
  setTimeout(()=>{
    if(typeof Chessboard === 'undefined' || typeof Chess === 'undefined') return;
    const chess = new Chess(gs.gameState.fen||undefined);
    const board = Chessboard(id, {
      position: chess.fen(),
      draggable: true,
      onDrop: (src,tgt)=>{
        const move = chess.move({from:src,to:tgt,promotion:'q'});
        if(!move) return 'snapback';
        board.position(chess.fen());
        gs.gameState.fen = chess.fen();
        S.games[gameId]=gs; saveS();
        if(!chess.game_over()){
          // Simple AI: pick random legal move
          const moves = chess.moves();
          if(moves.length){
            chess.move(moves[Math.floor(Math.random()*moves.length)]);
            board.position(chess.fen());
            gs.gameState.fen = chess.fen();
            S.games[gameId]=gs; saveS();
          }
        }
        if(chess.game_over()) alert('Game over! '+(chess.in_checkmate()?'Checkmate':'Draw'));
      }
    });
  }, 100);
}

function resetChess(gameId){
  const gs = S.games[gameId];
  if(gs){ gs.gameState={}; S.games[gameId]=gs; saveS(); renderGame(gameId,'chess'); }
}

/* ── SOLITAIRE (Klondike) ── */
function initSolitaire(){
  const deck = shuffleDeck();
  const tableau = Array.from({length:7},()=>[]);
  for(let i=0;i<7;i++) for(let j=i;j<7;j++) tableau[j].push({...deck.pop(), faceUp:j===i});
  return { stock:deck.map(c=>({...c,faceUp:false})), waste:[], foundations:[[],[],[],[]], tableau, selected:null };
}

function renderSolitaire(gameId){
  const gs = S.games[gameId];
  // Solitaire is a solo game — no opponent needed
  if(!gs){navigate('#/games');return;}
  if(!gs.gameState||!gs.gameState.tableau) gs.gameState = initSolitaire();
  const ts = gs.gameState;

  mount(`
    ${header(`${ej('joker')} Klondike Solitaire`,{back:true,subtitle:'Move all cards to the foundations'})}
    <div class="screen board-game-screen">
      <div class="screen__scroll board-game-scroll">
        <div class="sol-board" id="sol-board"></div>
      </div>
    </div>
  `);
  _solRefresh(gameId);
}

function _solRefresh(gameId){
  const gs = S.games[gameId]; if(!gs||!gs.gameState) return;
  const ts = gs.gameState;
  const wrap = $('sol-board'); if(!wrap) return;
  let html = '';

  // Foundations
  html += `<div class="sol-foundations">`;
  for(let i=0;i<4;i++){
    const top = ts.foundations[i][ts.foundations[i].length-1];
    html += `<div class="sol-foundation" onclick="solTap('${gameId}','f',${i})">${top?top.r+top.s:'Empty'}</div>`;
  }
  html += `</div>`;

  // Stock + waste
  html += `<div class="sol-stock-area">`;
  html += `<div class="sol-stock" onclick="solDraw('${gameId}')">${ts.stock.length?'[Draw]':'[Reset]'}</div>`;
  const wasteTop = ts.waste[ts.waste.length-1];
  html += `<div class="sol-waste" onclick="solTap('${gameId}','w',0)">${wasteTop?wasteTop.r+wasteTop.s:'--'}</div>`;
  html += `</div>`;

  // Tableau
  html += `<div class="sol-tableau">`;
  for(let c=0;c<7;c++){
    html += `<div class="sol-col">`;
    const pile = ts.tableau[c];
    if(pile.length===0){
      html += `<div class="sol-card sol-card--empty" onclick="solTap('${gameId}','t',${c})"></div>`;
    } else {
      for(let r=0;r<pile.length;r++){
        const card = pile[r];
        const isSelected = ts.selected&&ts.selected.type==='t'&&ts.selected.col===c&&ts.selected.idx===r;
        // Determine color class for face-up cards based on suit
        const colorCls = card.faceUp ? ((card.s==='\u2665'||card.s==='\u2666') ? ' sol-card--red' : ' sol-card--black') : ' sol-card--back';
        const selCls = isSelected ? ' sol-card--selected' : '';
        html += `<div class="sol-card${colorCls}${selCls}" onclick="solTap('${gameId}','t',${c},${r})">${card.faceUp?card.r+card.s:''}</div>`;
      }
    }
    html += `</div>`;
  }
  html += `</div>`;
  wrap.innerHTML = html;
}

function solDraw(gameId){
  const gs = S.games[gameId]; if(!gs||!gs.gameState) return;
  const ts = gs.gameState;
  if(ts.stock.length===0){
    ts.stock = ts.waste.reverse().map(c=>({...c,faceUp:false}));
    ts.waste = [];
  } else {
    const card = ts.stock.pop();
    card.faceUp = true;
    ts.waste.push(card);
  }
  ts.selected = null;
  S.games[gameId]=gs; saveS(); _solRefresh(gameId);
}

function solTap(gameId, type, col, idx){
  const gs = S.games[gameId]; if(!gs||!gs.gameState) return;
  const ts = gs.gameState;

  if(!ts.selected){
    if(type==='w'){ const top=ts.waste[ts.waste.length-1]; if(top) ts.selected={type:'w',card:top}; }
    else if(type==='t' && idx!==undefined){ const card=ts.tableau[col][idx]; if(card&&card.faceUp) ts.selected={type:'t',col,idx,card}; }
  } else {
    const sel = ts.selected;
    ts.selected = null;
    let moved = false;
    const rankIdx = r => TP_RANKS.indexOf(r);
    const isRed = s => s==='\u2665'||s==='\u2666';

    if(type==='f'){
      const card = sel.card;
      const found = ts.foundations[col];
      const topF = found[found.length-1];
      if((!topF && card.r==='A') || (topF && topF.s===card.s && rankIdx(card.r)===rankIdx(topF.r)+1)){
        found.push(card);
        if(sel.type==='w') ts.waste.pop();
        else { ts.tableau[sel.col].splice(sel.idx,1); const newTop=ts.tableau[sel.col][ts.tableau[sel.col].length-1]; if(newTop)newTop.faceUp=true; }
        moved=true;
      }
    } else if(type==='t'){
      const card = sel.card;
      const pile = ts.tableau[col];
      const topT = pile[pile.length-1];
      if((!topT && card.r==='K') || (topT && topT.faceUp && rankIdx(card.r)===rankIdx(topT.r)-1 && isRed(card.s)!==isRed(topT.s))){
        if(sel.type==='w'){ pile.push(card); ts.waste.pop(); moved=true; }
        else { const cards=ts.tableau[sel.col].splice(sel.idx); pile.push(...cards); const newTop=ts.tableau[sel.col][ts.tableau[sel.col].length-1]; if(newTop)newTop.faceUp=true; moved=true; }
      }
    }
  }
  S.games[gameId]=gs; saveS(); _solRefresh(gameId);
}
