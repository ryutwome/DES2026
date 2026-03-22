/* ============================================================
   DES2026 — App state, persistence, and seed data
   ============================================================ */

/* ── APP STATE ── */
const DEFAULT_PROXY = 'https://still-sunset-6036.rhuturajmirashi.workers.dev';
let S = {
  apiKey:'HARDCODED', proxyUrl:DEFAULT_PROXY,
  onboardingDone:false, interests:[],
  userName:'', fontSize:'normal', lastMorningGreeting:'',
  joinedCommunities:[],
  chats:{}, communities:{}, games:{}, stories:[],
  voiceRooms:{},
  researcherMode:false,
  installBannerDismissed:false, desktopBannerDismissed:false,
  unreadChats:{},
};

function loadS() {
  try { const d=localStorage.getItem('des2026'); if(d) S={...S,...JSON.parse(d)}; } catch(e){}
}
function saveS() {
  try { localStorage.setItem('des2026', JSON.stringify(S)); } catch(e){}
}
function set(patch) { Object.assign(S, patch); saveS(); }

function mkId() { return Date.now()+'_'+Math.random().toString(36).slice(2,6); }
function mkGameId() { return 'game_'+mkId(); }
function mkMsg(from,type,text) { return {id:mkId(),from,type,text,timestamp:Date.now(),isAI:from!=='user'}; }
function mkStory(authorId,authorName,text,title,imageUrl) { const name=authorId==='user'?(S.userName||authorName||'You'):authorName; return {id:mkId(),authorId,authorName:name,text,title:title||'',imageUrl:imageUrl||'',timestamp:Date.now(),replies:[]}; }

function addMsg(ctx,ctxId,msg) {
  if(!S[ctx][ctxId]) S[ctx][ctxId]=[];
  S[ctx][ctxId].push(msg); saveS();
}

/* ── SEED DATA ── */
function seedData(interests) {
  S.stories = SEED_STORIES.map(s=>({
    id:mkId(), authorId:s.personaId,
    authorName:PERSONAS[s.personaId].name,
    text:s.text, title:s.title||'', imageUrl:s.imageUrl||'',
    timestamp:Date.now()-Math.random()*7*86400000, replies:[]
  }));
  S.stories.sort((a,b)=>b.timestamp-a.timestamp);

  const joined = new Set();
  const map = {
    cooking:['recipes','bhajan'],
    cricket:['cricket'],
    music:['bollywood','bhajan'],
    gardening:['society','bhajan'],
    literature:['bollywood'],
    spirituality:['bhajan','society']
  };
  interests.forEach(i=>(map[i]||[]).forEach(c=>joined.add(c)));
  // Always add society so there are at least some communities
  joined.add('society');
  if(joined.size<2) joined.add('cricket');
  S.joinedCommunities=[...joined].slice(0,4);

  S.joinedCommunities.forEach(cId=>{
    const c=COMMUNITIES[cId]; if(!c) return;
    S.communities[cId]=c.seed.map((m,i)=>({...mkMsg(m.from,'text',m.text),timestamp:Date.now()-((c.seed.length-i)*3*60000)}));
  });

  // Seed one chat per persona with staggered timestamps for realistic chat list
  const now=Date.now();
  PERSONA_LIST.forEach((p,i)=>{
    if(!S.chats[p.id]){
      const msg=mkMsg(p.id,'text',p.fallbacks[0]);
      msg.timestamp=now-(i*7*60000)-(Math.random()*3*60000); // stagger by minutes
      S.chats[p.id]=[msg];
    }
  });
  // Give some personas unread counts
  S.unreadChats={};
  PERSONA_LIST.slice(0,4).forEach((p,i)=>{S.unreadChats[p.id]=Math.floor(Math.random()*4)+1;});

  // Seed voice rooms
  Object.values(VOICE_ROOMS).forEach(r=>{
    S.voiceRooms[r.id]={transcript:r.seed.map((l,i)=>({
      id:mkId(),personaId:l.personaId,text:l.text,
      timestamp:Date.now()-(r.seed.length-i)*60000
    }))};
  });

  saveS();
}
