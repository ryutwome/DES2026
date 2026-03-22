/* ============================================================
   DES2026 — App init: icon rendering, morning greeting, boot
   ============================================================ */

/* ── ICON GENERATION ── */
function generateIcons(){
  const sizes=[192,512];
  sizes.forEach(size=>{
    const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#075E54';ctx.beginPath();ctx.roundRect(0,0,size,size,size*.15);ctx.fill();
    ctx.fillStyle='#25D366';
    const cx=size/2,cy=size*.43,r=size*.22;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx-r*.35,cy+r*.15,r*.55,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#075E54';ctx.beginPath();ctx.arc(cx,cy,r*.4,0,Math.PI*2);ctx.fill();
    canvas.toBlob(blob=>{
      const url=URL.createObjectURL(blob);
      document.querySelectorAll(`link[sizes="${size}x${size}"]`).forEach(l=>l.href=url);
      if(size===192)document.querySelector('link[rel="apple-touch-icon"]').href=url;
    },'image/png');
  });
}

/* ── MORNING CHECK-IN ── */
function checkMorningGreeting(){
  // Only trigger after the user has a name and chats are seeded
  if(!S.userName||!S.onboardingDone)return;
  const today=new Date().toDateString();
  if(S.lastMorningGreeting===today)return; // already sent today
  const hour=new Date().getHours();
  if(hour<6||hour>11)return; // only 6am–11am window
  // Pick a random persona that the user has chatted with, or any persona
  const chatted=Object.keys(S.chats).filter(id=>PERSONAS[id]&&(S.chats[id]||[]).length>0);
  const pool=chatted.length?chatted:Object.keys(PERSONAS);
  const personaId=pool[Math.floor(Math.random()*pool.length)];
  const p=PERSONAS[personaId];if(!p)return;
  const greetings=MORNING_GREETINGS[personaId];if(!greetings)return;
  const text=greetings[Math.floor(Math.random()*greetings.length)].replace(/\{name\}/g,S.userName.split(' ')[0]);
  // Deliver after a short random delay (5–20 seconds after open)
  const delayMs=5000+Math.random()*15000;
  setTimeout(()=>{
    // Don't deliver if user is already in that chat
    if(window.location.hash.includes(personaId))return;
    const msg=mkMsg(personaId,'text',text);
    addMsg('chats',personaId,msg);
    const u={...S.unreadChats};
    u[personaId]=(u[personaId]||0)+1;
    set({unreadChats:u,lastMorningGreeting:today});
    // Show a gentle notification toast
    toast(`🌅 ${p.name.split(' ')[0]} sent you a good morning!`);
    // Re-render chat list if visible
    if(window.location.hash.replace('#/','')===''||window.location.hash.includes('/chats'))render();
  },delayMs);
}

/* ── INIT ── */
loadS();

// Migration: fix expired or missing stories for users who already onboarded
if(S.onboardingDone){
  const THIRTY=30*86400000;
  const noStories=!S.stories||S.stories.length===0;
  const allExpired=S.stories&&S.stories.length>0&&S.stories.every(s=>Date.now()-s.timestamp>=THIRTY);
  if(noStories||allExpired){
    // Re-seed stories fresh
    const fresh=SEED_STORIES.map((s,i)=>({
      id:(Date.now()+'_s'+i),authorId:s.personaId,
      authorName:PERSONAS[s.personaId].name,
      text:s.text,title:s.title||'',imageUrl:s.imageUrl||'',
      timestamp:Date.now()-(i*18*3600000),replies:[]
    }));
    set({stories:fresh});
  }
}

applyFontSize();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
window.speechSynthesis?.getVoices(); // pre-load voices

// Generate icon images at runtime (no PNG files needed)
window.addEventListener('load',generateIcons);

// Initial route
const initHash=window.location.hash||'#/';
_stack=[initHash];_cur=initHash;
render();

// Morning greeting — check after app is ready
setTimeout(checkMorningGreeting, 1000);
