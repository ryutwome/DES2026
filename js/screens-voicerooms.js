/* ============================================================
   DES2026 — Voice rooms list and live voice room screen
   ============================================================ */

const VR_MAX_PARTICIPANTS=5;
const VR_REACTIONS=['clap','heart','laugh','thumbsup','pray'];
function vrReactionImg(name,size){return`<img src="./icons/reactions/${name}.svg" style="width:${size}px;height:${size}px;" alt="${name}">`; }
const VR_ICONS={'morning-bhajans':'1f64f','cricket-discussion':'1f3cf','retro-bollywood-adda':'1f3ac','evening-adda':'2615'};
function vrIcon(id){const f=VR_ICONS[id]||'1f3a4';return`<img src="./icons/groups/${f}.svg" style="width:28px;height:28px;" alt="">`;}

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
    const validPersonas=room.personas.filter(id=>PERSONAS[id]);
    const parts=validPersonas.slice(0,3).map(id=>avatar(PERSONAS[id].name,'sm',id)).join('');
    const count=validPersonas.length;
    div.innerHTML=`
      <div style="display:flex;align-items:center;gap:10px;padding:8px 14px;cursor:pointer;">
        <div style="width:40px;height:40px;border-radius:10px;background:${firstPersona?.color||'#667781'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${vrIcon(room.id)}</div>
        <div style="flex:1;min-width:0;">
          <div class="voice-room-card__name" style="font-size:14px;">${room.name}</div>
          <div class="voice-room-card__participants" style="margin-top:3px;">${parts}</div>
        </div>
        <button style="background:#25d366;border:none;border-radius:8px;padding:6px 12px;color:#fff;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;line-height:1.3;" onclick="event.stopPropagation();navigate('#/voiceroom/${room.id}')">Join<br><span style="font-size:11px;font-weight:400;opacity:0.9;">${count}/${VR_MAX_PARTICIPANTS}</span></button>
      </div>`;
    div.querySelector('div').onclick=()=>navigate('#/voiceroom/'+room.id);
    list.appendChild(div);
  });
  list.insertAdjacentHTML('beforeend',`<button class="fab" onclick="toast('Starting a room coming soon')" aria-label="Start a room">${IC.mic}</button>`);
}

/* ── VOICE ROOM ── */
let _vrSpeakInterval=null,_vrReactInterval=null,_vrAudio=null,_vrTTSActive=false;

// rooms that have a looping ambient audio track and a dedicated "singer" persona
const VR_AMBIENT={
  'morning-bhajans':{src:'./audio/bhajan-suprabhatam.mp3',singerIdx:1}
};

function renderVoiceRoom(roomId){
  const room=VOICE_ROOMS[roomId];if(!room){navigate('#/voicerooms');return;}
  if(_vrSpeakInterval)clearInterval(_vrSpeakInterval);
  if(_vrReactInterval)clearTimeout(_vrReactInterval);
  if(_vrAudio){_vrAudio.pause();_vrAudio=null;}

  const reactionBtns=VR_REACTIONS.map((r,i)=>`<button class="vr-reaction-btn" onclick="vrReact(${i})" aria-label="${r}">${vrReactionImg(r,28)}</button>`).join('');

  mount(`
    <div class="voice-room-screen">
      ${header(room.name,{back:true,white:true})}
      <div class="vr-people">
        <div class="vr-circle" id="vr-grid"></div>
      </div>
      <div class="vr-reaction-stage" id="vr-stage"></div>
      <div class="vr-reaction-bar">${reactionBtns}</div>
    </div>
  `);

  // Build participant list: AI personas + user
  const userName=S.userName||'You';
  const aiPersonas=room.personas.filter(id=>PERSONAS[id]).slice(0,VR_MAX_PARTICIPANTS-1);
  // all participants: user first, then AIs
  const allParticipants=[
    {id:'user',name:userName,isUser:true},
    ...aiPersonas.map(id=>({id,name:PERSONAS[id].name,isUser:false}))
  ];

  const grid=$('vr-grid');
  const n=allParticipants.length;

  allParticipants.forEach((p,i)=>{
    const angle=-Math.PI/2+(2*Math.PI/n)*i;
    const x=50+38*Math.cos(angle);
    const y=50+38*Math.sin(angle);
    const tile=document.createElement('div');
    tile.className='participant-tile';
    tile.id='vr-p-'+p.id;
    tile.style.cssText=`position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);`;
    const ring=`<div class="participant-tile__ring${i===0?' speaking':''}">${avatar(p.name,'lg',p.isUser?null:p.id)}</div>`;
    tile.innerHTML=`${ring}<div class="participant-tile__name">${p.name.split(' ')[0]}</div>`;
    grid.appendChild(tile);
  });

  const ambient=VR_AMBIENT[roomId];

  if(ambient){
    // ── Ambient audio room (morning bhajans) ──
    // One persona always glows; others rotate on an interval
    const audio=new Audio(ambient.src);
    _vrAudio=audio;
    audio.loop=true;
    audio.volume=0.45;
    audio.addEventListener('loadedmetadata',()=>{
      if(_vrAudio!==audio)return;
      audio.currentTime=Math.random()*audio.duration;
      audio.play().catch(()=>{});
    },{once:true});

    const singerPid=allParticipants[ambient.singerIdx]?.id;
    const rotatables=allParticipants.filter(p=>p.id!==singerPid);
    let speakingIdx=0;
    _vrSpeakInterval=setInterval(()=>{
      document.querySelectorAll('.participant-tile__ring').forEach(r=>{
        if(r.closest(`#vr-p-${singerPid}`))return;
        r.classList.remove('speaking');
      });
      if(rotatables.length>0){
        speakingIdx=(speakingIdx+1)%rotatables.length;
        const tile=$('vr-p-'+rotatables[speakingIdx].id);
        if(tile)tile.querySelector('.participant-tile__ring')?.classList.add('speaking');
      }
    },3000);

  } else if(room.ttsScript?.length){
    // ── TTS script room — lines drive both speech and speaking ring ──
    _vrTTSActive=true;
    const script=room.ttsScript;
    let idx=Math.floor(Math.random()*script.length);
    function playNext(){
      if(!_vrTTSActive||!document.getElementById('vr-grid'))return;
      const line=script[idx];
      idx=(idx+1)%script.length;
      document.querySelectorAll('.participant-tile__ring').forEach(r=>r.classList.remove('speaking'));
      const tile=$('vr-p-'+line.personaId);
      if(tile)tile.querySelector('.participant-tile__ring')?.classList.add('speaking');
      speak(line.text,()=>{
        if(!_vrTTSActive)return;
        setTimeout(playNext,600+Math.random()*900);
      });
    }
    setTimeout(playNext,400);

  } else {
    // ── Fallback: simple rotation ──
    let speakingIdx=0;
    _vrSpeakInterval=setInterval(()=>{
      document.querySelectorAll('.participant-tile__ring').forEach(r=>r.classList.remove('speaking'));
      speakingIdx=(speakingIdx+1)%n;
      const tile=$('vr-p-'+allParticipants[speakingIdx].id);
      if(tile)tile.querySelector('.participant-tile__ring')?.classList.add('speaking');
    },3000);
  }

  // AI reactions at random intervals
  function scheduleAiReact(){
    _vrReactInterval=setTimeout(()=>{
      if(!document.getElementById('vr-stage'))return;
      vrReact(Math.floor(Math.random()*VR_REACTIONS.length),true);
      scheduleAiReact();
    },7000+Math.random()*13000);
  }
  scheduleAiReact();

  window._vrCleanup=()=>{
    clearInterval(_vrSpeakInterval);
    clearTimeout(_vrReactInterval);
    if(_vrAudio){_vrAudio.pause();_vrAudio=null;}
    if(_vrTTSActive){_vrTTSActive=false;stopSpeak();}
    _vrSpeakInterval=null;_vrReactInterval=null;
  };
}

function vrReact(idx,fromAi=false){
  const stage=document.getElementById('vr-stage');if(!stage)return;
  const el=document.createElement('div');
  el.className='vr-reaction-float';
  el.innerHTML=vrReactionImg(VR_REACTIONS[idx],40);
  el.style.left=(8+Math.random()*80)+'%';
  stage.appendChild(el);
  setTimeout(()=>el.remove(),1800);
  // when user reacts, 1-2 AIs respond after a short delay
  if(!fromAi){
    const count=Math.random()<0.5?1:2;
    for(let i=0;i<count;i++){
      setTimeout(()=>{
        if(document.getElementById('vr-stage'))
          vrReact(Math.floor(Math.random()*VR_REACTIONS.length),true);
      },800+Math.random()*1800);
    }
  }
}
