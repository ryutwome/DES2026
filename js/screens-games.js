/* ============================================================
   DES2026 — Games hub, game sheet, and game screen
   ============================================================ */

/* ── GAMES HUB ── */
function renderGames(){
  const activeGames=Object.values(S.games).filter(g=>g.status==='active');
  const recentGames=Object.values(S.games).filter(g=>g.status==='completed').slice(-5);
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
  const sc=$('games-scroll');
  sc.insertAdjacentHTML('beforeend',`<button class="start-game-btn" onclick="showGameSheet(null)">${IC.add} Start New Game</button>`);
  if(activeGames.length){
    sc.insertAdjacentHTML('beforeend','<div class="section-heading">Active Games</div>');
    activeGames.forEach(g=>sc.appendChild(gameCard(g)));
  }
  sc.insertAdjacentHTML('beforeend','<div class="section-heading">Coming Soon</div>');
  sc.insertAdjacentHTML('beforeend',`<div class="game-card" style="opacity:.5"><div class="game-card__icon">🔤</div><div class="game-card__body"><div class="game-card__title">Word Chain</div><div class="game-card__subtitle">Coming soon</div></div></div>`);
  sc.insertAdjacentHTML('beforeend',`<div class="game-card" style="opacity:.5"><div class="game-card__icon">🏏</div><div class="game-card__body"><div class="game-card__title">Cricket Trivia</div><div class="game-card__subtitle">Coming soon</div></div></div>`);
  if(recentGames.length){
    sc.insertAdjacentHTML('beforeend','<div class="section-heading">Recent</div>');
    recentGames.reverse().forEach(g=>sc.appendChild(gameCard(g)));
  }
}
function gameCard(g){
  const p=PERSONAS[g.opponentId];const gt=gameTypes[g.type]||{emoji:'🎮',name:g.type};
  const div=document.createElement('div');div.className='game-card';
  div.innerHTML=`<div class="game-card__icon">${gt.emoji}</div><div class="game-card__body"><div class="game-card__title">${gt.name}</div><div class="game-card__subtitle">vs ${p?.name||'?'}</div><div class="game-card__meta">${g.status==='active'?'Your turn':'Completed'}</div></div>`;
  if(g.status==='active') div.onclick=()=>navigate(`#/game/${g.id}/${g.type}`);
  return div;
}
const gameTypes={
  antakshari:{id:'antakshari',emoji:'🎵',name:'Antakshari',desc:'Song chain — last letter starts next song'},
  'trivia-bollywood':{id:'trivia-bollywood',emoji:'🎬',name:'Bollywood Trivia',desc:'Questions about Hindi films'},
};
function showGameSheet(fromPersonaId){
  let selType=null,selPersona=fromPersonaId;
  const bk=sheet(`
    <div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Start a New Game</div>
    <div id="gs-type" class="game-picker-sheet"></div>
    ${!fromPersonaId?`<div class="bottom-sheet__title" style="margin-top:.75rem;font-size:.9375rem;">Choose opponent</div><div id="gs-persona" class="persona-picker-list"></div>`:''}
    <button class="sheet-confirm-btn" id="gs-go" disabled>Start Game →</button>
  `);
  const typePicker=$('gs-type');
  Object.values(gameTypes).forEach(gt=>{
    const b=document.createElement('button');b.className='game-type-option';
    b.innerHTML=`<span class="game-type-option__emoji">${gt.emoji}</span><div class="game-type-option__body"><div class="game-type-option__name">${gt.name}</div><div class="game-type-option__desc">${gt.desc}</div></div>`;
    b.onclick=()=>{typePicker.querySelectorAll('.game-type-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selType=gt.id;checkReady();};
    typePicker.appendChild(b);
  });
  if(!fromPersonaId){
    const pp=$('gs-persona');
    PERSONA_LIST.forEach(p=>{
      const b=document.createElement('button');b.className='persona-pick-item';
      b.innerHTML=`${avatar(p.name,'sm',p.id)}<div><div class="persona-pick-item__name">${p.name}</div><div class="persona-pick-item__city">${p.city}</div></div>`;
      b.onclick=()=>{pp.querySelectorAll('.persona-pick-item').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selPersona=p.id;checkReady();};
      pp.appendChild(b);
    });
  }
  function checkReady(){if($('gs-go'))$('gs-go').disabled=!(selType&&selPersona);}
  $('gs-go').onclick=()=>{
    if(!selType||!selPersona)return;
    closeSheet(bk);
    const gameId=mkGameId();
    const gs={id:gameId,type:selType,opponentId:selPersona,status:'active',currentLetter:'',score:{user:0,ai:0},questionNumber:1,lastQuestion:'',messages:[],createdAt:Date.now(),completedAt:null};
    set({games:{...S.games,[gameId]:gs}});
    navigate(`#/game/${gameId}/${selType}`);
  };
}

/* ── GAME SCREEN ── */
function renderGame(gameId,gameType){
  const gs=S.games[gameId];
  const persona=gs?PERSONAS[gs.opponentId]:null;
  if(!gs||!persona){navigate('#/games');return;}
  const gt=gameTypes[gameType]||{emoji:'🎮',name:gameType};

  mount(`
    ${header(`${gt.emoji} ${gt.name}`,{back:true,subtitle:`vs ${persona.name}`})}
    <div class="game-status-bar" id="game-status">${renderGameStatus(gs)}</div>
    <div class="screen game-screen" id="game-wrap">
      <div class="chat-messages" id="game-msgs" style="background:#ECE5DD;"></div>
    </div>
  `);

  const msgs=$('game-msgs');
  (gs.messages||[]).forEach(m=>msgs.insertAdjacentHTML('beforeend',bubble(m)));

  // First move if no messages
  if(!gs.messages||!gs.messages.length){
    setTimeout(()=>startGameFirstMove(gameId,gameType,msgs),500);
  }

  scrollBot(msgs);
  renderInputBar('game-wrap',{placeholder:'Your move...',onSend:async({type,text})=>{
    const userMsg=mkMsg('user',type,text);
    gs.messages=[...(gs.messages||[]),userMsg];
    S.games[gameId]=gs;saveS();
    msgs.insertAdjacentHTML('beforeend',bubble(userMsg));
    scrollBot(msgs);
    msgs.insertAdjacentHTML('beforeend',typingHTML());scrollBot(msgs);
    await delay(1500+Math.random()*1000);
    const ti=$('typing');if(ti)ti.remove();
    const note=buildGameNote(gameType,gs,text);
    const resp=await claude(gs.opponentId,gs.messages||[],note);
    const aiMsg=mkMsg(gs.opponentId,'text',resp);
    gs.messages=[...(gs.messages||[]),aiMsg];
    updateGameState(gameId,gameType,gs,text,resp);
    msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
    const statusBar=$('game-status');if(statusBar)statusBar.innerHTML=renderGameStatus(S.games[gameId]);
    scrollBot(msgs);
  }});
}
function renderGameStatus(gs){
  if(gs.type==='antakshari') return`<div class="game-status-bar__item"><div class="game-status-bar__value">${gs.currentLetter||'?'}</div><div class="game-status-bar__label">Current Letter</div></div>`;
  if(gs.type.startsWith('trivia')) return`<div class="game-status-bar__item"><div class="game-status-bar__value">Q${gs.questionNumber||1}</div><div class="game-status-bar__label">Question</div></div><div class="game-status-bar__item"><div class="game-status-bar__value">${gs.score?.user||0}–${gs.score?.ai||0}</div><div class="game-status-bar__label">Score</div></div>`;
  return`<div class="game-status-bar__item"><div class="game-status-bar__value">🎮</div><div class="game-status-bar__label">Playing</div></div>`;
}
function buildGameNote(gameType,gs,userMove){
  if(gameType==='antakshari') return`You are playing Antakshari. User said: "${userMove}". Check if it's a real Bollywood/Indian song and starts with letter "${gs.currentLetter||'any'}". If valid, acknowledge it warmly and give your song starting with the last letter of their song. Clearly state the new required letter. Format: "[User song] ✓ | My song: [Your Song] — [Film] | Your letter: [letter]"`;
  if(gameType==='trivia-bollywood'){const q=BOLLYWOOD_QUESTIONS[(gs.questionNumber-1)%BOLLYWOOD_QUESTIONS.length];return`You are playing Bollywood Trivia. ${gs.lastQuestion?`User answered "${userMove}" to "${gs.lastQuestion}". The correct answer is "${q.a}". Say if correct/incorrect, give right answer if wrong. Then ask the next question.`:`Ask question: "${q.q}"`}`;}
  return`You are playing ${gameType}. User said: "${userMove}". Respond naturally.`;
}
function updateGameState(gameId,gameType,gs,userMove,aiResp){
  if(gameType==='antakshari'){
    const match=aiResp.match(/letter:\s*([A-Za-z])/i);
    if(match)gs.currentLetter=match[1].toUpperCase();
  }
  if(gameType.startsWith('trivia')){
    const q=BOLLYWOOD_QUESTIONS[(gs.questionNumber-1)%BOLLYWOOD_QUESTIONS.length];
    gs.lastQuestion=q.q;gs.questionNumber=(gs.questionNumber||1)+1;
    if(aiResp.toLowerCase().includes('correct')||aiResp.toLowerCase().includes('right'))gs.score.user=(gs.score.user||0)+1;
    else gs.score.ai=(gs.score.ai||0)+1;
  }
  S.games[gameId]=gs;saveS();
}
async function startGameFirstMove(gameId,gameType,msgs){
  const gs=S.games[gameId];if(!gs)return;
  let firstMsg='';
  if(gameType==='antakshari') firstMsg=`You are starting Antakshari! Give the first Bollywood song title and tell the user what letter their song must start with (last letter of your song). Format: "I'll start! My song: [Song Name] — [Film]. Your turn — song must start with [letter]!"`;
  else if(gameType==='trivia-bollywood'){const q=BOLLYWOOD_QUESTIONS[0];firstMsg=`Start Bollywood Trivia! Ask this question: "${q.q}" — Give a warm intro first.`;}
  else firstMsg='Start the game with an introduction and first move.';
  msgs.insertAdjacentHTML('beforeend',typingHTML());
  await delay(1000+Math.random()*800);
  const ti=$('typing');if(ti)ti.remove();
  const resp=await claude(gs.opponentId,[],firstMsg);
  const aiMsg=mkMsg(gs.opponentId,'text',resp);
  gs.messages=[aiMsg];
  if(gameType==='antakshari'){const match=resp.match(/start(?:ing)? with\s+([A-Za-z])/i)||resp.match(/starts? with (?:the letter )?[""']?([A-Za-z])/i)||resp.match(/letter[:\s]+[""']?([A-Za-z])/i);if(match)gs.currentLetter=match[1].toUpperCase();}
  if(gameType.startsWith('trivia')){gs.lastQuestion=BOLLYWOOD_QUESTIONS[0].q;gs.questionNumber=1;}
  S.games[gameId]=gs;saveS();
  msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
  const statusBar=$('game-status');if(statusBar)statusBar.innerHTML=renderGameStatus(gs);
  scrollBot(msgs);
}
