/* ============================================================
   DES2026 — Voice rooms list and live voice room screen
   ============================================================ */

/* ── VOICE ROOMS LIST ── */
function renderVoiceRooms(){
  mount(`
    ${resBar()}
    <div class="header header--white">
      <div class="header__title" onclick="headerTap()"><h1 style="color:#111b21;">Voice Rooms</h1></div>
      <div class="header__actions">
        <button class="header__action-btn" aria-label="Search">${IC.search}</button>
        <button class="header__action-btn" aria-label="More">${IC.more}</button>
      </div>
    </div>
    <div class="screen"><div class="screen__scroll" id="vr-list" style="background:#fff;"></div></div>
    ${bottomNav('voicerooms')}
  `);
  const list=$('vr-list');
  list.insertAdjacentHTML('beforeend',`<div class="section-heading" style="text-transform:uppercase;font-size:12px;color:#667781;padding:12px 16px 4px;font-weight:600;letter-spacing:0.05em;">Live Voice Rooms</div>`);
  Object.values(VOICE_ROOMS).forEach(room=>{
    const div=document.createElement('div');div.className='voice-room-card';
    const firstPersona=PERSONAS[room.personas[0]];
    const parts=room.personas.slice(0,3).map(id=>avatar(PERSONAS[id]?.name||'?','sm',id)).join('');
    div.innerHTML=`
      <div style="display:flex;align-items:center;gap:14px;padding:12px 16px;cursor:pointer;">
        <div style="position:relative;">${avatar(room.name,'md')}<div style="position:absolute;bottom:0;right:0;width:14px;height:14px;background:#ea4335;border-radius:50%;border:2px solid #fff;"></div></div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div class="voice-room-card__name">${room.name}</div>
            <div class="voice-room-card__live"><div class="live-dot"></div>LIVE</div>
          </div>
          <div class="voice-room-card__theme">${room.themeTag}</div>
          <div class="voice-room-card__participants" style="margin-top:4px;">${parts}</div>
        </div>
        <button style="background:#25d366;border:none;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;">${IC.phone}</button>
      </div>`;
    div.querySelector('div').onclick=()=>navigate('#/voiceroom/'+room.id);
    list.appendChild(div);
  });
  // FAB
  list.insertAdjacentHTML('beforeend',`<button class="fab" onclick="toast('New call coming soon')" aria-label="New call">${IC.phone}</button>`);
}

/* ── VOICE ROOM ── */
let _vrInterval=null,_vrQuietTimer=null;
function renderVoiceRoom(roomId){
  const room=VOICE_ROOMS[roomId];if(!room){navigate('#/voicerooms');return;}
  if(_vrInterval)clearInterval(_vrInterval);
  if(_vrQuietTimer)clearTimeout(_vrQuietTimer);
  if(!S.voiceRooms[roomId])S.voiceRooms[roomId]={transcript:room.seed.map((l,i)=>({id:mkId(),personaId:l.personaId,text:l.text,timestamp:Date.now()-(room.seed.length-i)*60000}))};

  mount(`
    <div class="voice-room-screen">
      ${header(room.name,{back:true,subtitle:room.themeTag,white:true})}
      <div class="participant-grid" id="vr-grid"></div>
      <div class="voice-transcript" id="vr-transcript"></div>
      <div class="voice-room-input" id="vr-input-wrap">
        <input class="voice-room-input__field" id="vr-field" placeholder="Say something..." />
        <button class="voice-room-input__mic" id="vr-mic" aria-label="Record">${IC.mic}</button>
      </div>
    </div>
  `);

  // Participants grid
  const grid=$('vr-grid');
  let speakingIdx=0;
  room.personas.forEach((pid,i)=>{
    const p=PERSONAS[pid];if(!p)return;
    const tile=document.createElement('div');tile.className='participant-tile';tile.id='vr-p-'+pid;
    tile.innerHTML=`<div class="participant-tile__ring${i===0?' speaking':''}">${avatar(p.name,'lg',pid)}</div><div class="participant-tile__name">${p.name.split(' ')[0]}</div>`;
    grid.appendChild(tile);
  });

  // Transcript
  const tc=$('vr-transcript');
  S.voiceRooms[roomId].transcript.forEach(l=>tc.insertAdjacentHTML('beforeend',transcriptLine(l)));
  scrollBot(tc);

  // Rotate speaking ring
  const speakRing=setInterval(()=>{
    document.querySelectorAll('.participant-tile__ring').forEach(r=>r.classList.remove('speaking'));
    speakingIdx=(speakingIdx+1)%room.personas.length;
    const tile=$('vr-p-'+room.personas[speakingIdx]);
    if(tile)tile.querySelector('.participant-tile__ring')?.classList.add('speaking');
  },3000);

  // AI transcript generation
  function scheduleNextLine(){
    if(_vrInterval)clearInterval(_vrInterval);
    const ms=8000+Math.random()*4000;
    _vrInterval=setTimeout(async()=>{
      if(!document.getElementById('vr-transcript'))return;
      clearTimeout(_vrQuietTimer);
      const r=await callClaudeForVoiceRoom(roomId,S.voiceRooms[roomId].transcript);
      if(r&&document.getElementById('vr-transcript')){
        const line={id:mkId(),personaId:r.personaId,text:r.text,timestamp:Date.now()};
        S.voiceRooms[roomId].transcript.push(line);saveS();
        $('vr-transcript').insertAdjacentHTML('beforeend',transcriptLine(line));
        scrollBot($('vr-transcript'));
        removeQuietPrompt();
      }
      setQuietTimer();
      scheduleNextLine();
    },ms);
  }

  function setQuietTimer(){
    clearTimeout(_vrQuietTimer);
    _vrQuietTimer=setTimeout(()=>{
      if(document.getElementById('vr-transcript'))showQuietPrompt(room);
    },15000);
  }

  scheduleNextLine();setQuietTimer();

  // Text input
  const field=$('vr-field');
  field.addEventListener('keydown',e=>{if(e.key==='Enter')sendVRMsg(roomId,field.value.trim());});

  // Mic button
  let vrRec=false;const micBtn=$('vr-mic');
  micBtn.onclick=()=>{
    if(!canSTT()){toast('Voice not available');return;}
    if(vrRec){stopRec();vrRec=false;micBtn.classList.remove('recording');micBtn.innerHTML=IC.mic;return;}
    vrRec=true;micBtn.classList.add('recording');micBtn.innerHTML=IC.micOff;
    let vrTxt='';
    startRec({onInterim:t=>{vrTxt=t;field.value=t;},onFinal:t=>{vrTxt=t;field.value=t;},
      onError:()=>{vrRec=false;micBtn.classList.remove('recording');micBtn.innerHTML=IC.mic;},
      onEnd:()=>{vrRec=false;micBtn.classList.remove('recording');micBtn.innerHTML=IC.mic;if(vrTxt.trim())sendVRMsg(roomId,vrTxt.trim());field.value='';}
    });
  };

  // Cleanup on navigation
  const origGoBack=window._vrCleanup;
  window._vrCleanup=()=>{clearInterval(speakRing);clearTimeout(_vrInterval);clearTimeout(_vrQuietTimer);_vrInterval=null;_vrQuietTimer=null;};
}

async function callClaudeForVoiceRoom(roomId,transcript){
  const room=VOICE_ROOMS[roomId];if(!room)return null;
  const pid=room.personas[Math.floor(Math.random()*room.personas.length)];
  const recent=transcript.slice(-5).map(l=>`${PERSONAS[l.personaId]?.name||'?'}: ${l.text}`).join('\n');
  const note=`You are in a live voice room called "${room.name}" (theme: ${room.theme}). Recent:\n${recent||'(just started)'}\nContinue the conversation naturally. 1-2 sentences only, as if speaking aloud.`;
  const t=await claude(pid,[mkMsg('user','text','Continue')],note);
  return{personaId:pid,text:t};
}

async function sendVRMsg(roomId,text){
  if(!text)return;
  const field=$('vr-field');if(field)field.value='';
  const tc=$('vr-transcript');if(!tc)return;
  const userLine={id:mkId(),personaId:'user',text,timestamp:Date.now()};
  tc.insertAdjacentHTML('beforeend',transcriptLineUser(userLine));
  scrollBot(tc);
  removeQuietPrompt();
  clearTimeout(_vrQuietTimer);
  await delay(1500+Math.random()*1000);
  const room=VOICE_ROOMS[roomId];if(!room)return;
  const pid=room.personas[Math.floor(Math.random()*room.personas.length)];
  const note=`You are in voice room "${room.name}". A participant just said: "${text}". Respond naturally and briefly.`;
  const resp=await claude(pid,[mkMsg('user','text',text)],note);
  if(!$('vr-transcript'))return;
  const line={id:mkId(),personaId:pid,text:resp,timestamp:Date.now()};
  if(S.voiceRooms[roomId]){S.voiceRooms[roomId].transcript.push(line);saveS();}
  $('vr-transcript').insertAdjacentHTML('beforeend',transcriptLine(line));
  scrollBot($('vr-transcript'));
  clearTimeout(_vrQuietTimer);_vrQuietTimer=setTimeout(()=>{if($('vr-transcript'))showQuietPrompt(room);},15000);
}

function transcriptLine(line){
  const p=PERSONAS[line.personaId];const name=p?p.name.split(' ')[0]:'?';
  const spk=canTTS()?`<button class="transcript-line__play" onclick="speakTL(this,'${line.id.replace(/'/g,"\\'")}','${(line.text||'').replace(/'/g,"\\'").replace(/\n/g,' ').slice(0,200)}')" aria-label="Play">${IC.play}</button>`:'';
  return`<div class="transcript-line" id="tl-${line.id}"><div class="transcript-line__speaker">${name}</div><div class="transcript-line__text">${line.text}</div><div class="transcript-line__actions">${spk}<span style="font-size:.75rem;color:rgba(255,255,255,.4)">${ftime(line.timestamp)}</span></div></div>`;
}
function transcriptLineUser(line){
  return`<div class="transcript-line" id="tl-${line.id}"><div class="transcript-line__speaker" style="color:#fff">You</div><div class="transcript-line__text">${line.text}</div></div>`;
}
function speakTL(btn,id,text){
  if(_playing[id]){stopSpeak();delete _playing[id];btn.innerHTML=IC.play;return;}
  Object.keys(_playing).forEach(k=>{delete _playing[k];document.querySelectorAll('.transcript-line__play').forEach(b=>b.innerHTML=IC.play);});
  speak(text,()=>{delete _playing[id];btn.innerHTML=IC.play;});
  _playing[id]=true;btn.innerHTML=IC.pause;
}
function showQuietPrompt(room){
  removeQuietPrompt();
  const tc=$('vr-transcript');if(!tc)return;
  const div=document.createElement('div');div.className='quiet-prompt';div.id='quiet-prompt';
  div.innerHTML=`<div>It's gone quiet — ask something!</div><div class="quiet-prompt__chips">${room.quietChips.map(c=>`<button class="quiet-prompt__chip" onclick="sendVRMsg('${room.id}','${c.replace(/'/g,"\\'")}');removeQuietPrompt()">${c}</button>`).join('')}</div>`;
  tc.appendChild(div);scrollBot(tc);
}
function removeQuietPrompt(){const q=$('quiet-prompt');if(q)q.remove();}
