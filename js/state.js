/* ============================================================
   DES2026 — App state, persistence, and seed data
   ============================================================ */

/* ── APP STATE ── */
const DEFAULT_PROXY = 'https://still-sunset-6036.rhuturajmirashi.workers.dev';
let S = {
  apiKey:'HARDCODED', proxyUrl:DEFAULT_PROXY,
  onboardingDone:false, interests:[],
  userName:'', userAge:null, fontSize:'normal', lastMorningGreeting:'',
  joinedCommunities:[],   // legacy — superseded by communityActivity
  communityActivity:{},  // commId → last active timestamp; joined = within 7 days
  unreadCommunities:{},  // commId → unread count
  commUnreadsMigrated:false,
  commDataMigrated:false, // bump to re-run: set false in console then refresh
  chats:{}, communities:{}, games:{}, stories:[],
  voiceRooms:{},
  researcherMode:false,
  installBannerDismissed:false, desktopBannerDismissed:false,
  unreadChats:{},
  unreadStoryReplies:{}, // storyId → unread reply count (own stories only)
  viewedStatuses:[],
  userLang:'hi',
};

function loadS() {
  try { const d=localStorage.getItem('des2026'); if(d) S={...S,...JSON.parse(d)}; } catch(e){}
  // Re-run comm data migration to seed '@' mention badge
  if (S.commMentionSeeded !== 2) S.commDataMigrated = false;
}
function saveS() {
  try { localStorage.setItem('des2026', JSON.stringify(S)); } catch(e){}
}
function set(patch) { Object.assign(S, patch); saveS(); }

/* Resolve a bilingual {hi,mr} object to a string using S.userLang. */
function bi(v){ if(!v||typeof v==='string') return v||''; return v[S.userLang]||v.hi||v.mr||''; }

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
  S.stories = SEED_STORIES.map((s,i)=>{
    const storyTs=Date.now()-(i*18*3600000+Math.random()*3*3600000);
    const replies=(s.seedReplies||[]).map((r,j)=>({
      ...mkMsg(r.from,'text',r.text),
      timestamp:storyTs+(j+1)*25*60000 // each reply ~25 min after the previous
    }));
    return {
      id:mkId(), authorId:s.personaId,
      authorName:s.authorName||PERSONAS[s.personaId].name,
      text:s.text, title:s.title||'', imageUrl:s.imageUrl||'',
      source:s.source||'contact',
      likes:s.likes||0, likedByUser:false,
      timestamp:storyTs, replies
    };
  });
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
  joined.add('society');
  if(joined.size<2) joined.add('cricket');
  const joinedList=[...joined].slice(0,4);
  // Seed activity timestamps as 1–2 days ago so they start as joined
  const act={};
  joinedList.forEach((cId,i)=>{act[cId]=Date.now()-(1+i)*24*60*60*1000;});
  S.communityActivity=act;
  // Seed unread counts; bhajan always gets 1 so its @mention seed message triggers the @ badge
  const unreadCounts={cricket:12, bollywood:5, bhajan:1, society:8, recipes:3};
  const unread={};
  joinedList.forEach(cId=>{if(unreadCounts[cId])unread[cId]=unreadCounts[cId];});
  S.unreadCommunities=unread;

  // Seed messages for all communities, staggered so non-joined feel slightly older
  Object.values(COMMUNITIES).forEach(c=>{
    const isJoined=joinedList.includes(c.id);
    const baseAge=isJoined?3:30; // joined: 3 min apart; recommended: 30 min apart, older
    S.communities[c.id]=c.seed.map((m,i)=>({...mkMsg(m.from,'text',bi(m.text)),timestamp:Date.now()-((c.seed.length-i)*baseAge*60000+(isJoined?0:6*3600000))}));
  });

  // Seed 4 chats with realistic multi-message history spread over ~3 days
  const now=Date.now();
  const DAY=86400000,HR=3600000,MIN=60000;
  const chatBaseOffsets=[3*DAY+2*HR, 3*DAY+5*HR, 2*DAY+9*HR, 2*DAY+1*HR];
  PERSONA_LIST.slice(0,4).forEach((p,chatIdx)=>{
    if(!S.chats[p.id]){
      const msgs=[];
      const base=now-chatBaseOffsets[chatIdx];
      const introText=bi(p.intro)||(bi(p.fallbacks)||p.fallbacks)[0];
      const intro=mkMsg(p.id,'text',introText);
      intro.timestamp=base; msgs.push(intro);
      (p.chatSeed||[]).forEach((s,i)=>{
        const m=mkMsg(s.from==='user'?'user':p.id,'text',bi(s.text));
        m.timestamp=base+(i+1)*(50*MIN)+Math.floor(i/3)*HR;
        msgs.push(m);
      });
      S.chats[p.id]=msgs;
    }
  });
  // Badge only when persona's last message is more recent than user's last
  S.unreadChats={};
  PERSONA_LIST.slice(0,4).forEach(p=>{
    const msgs=S.chats[p.id]||[];
    const lastP=msgs.filter(m=>m.from===p.id).pop();
    const lastU=msgs.filter(m=>m.from==='user').pop();
    if(lastP&&(!lastU||lastP.timestamp>lastU.timestamp)) S.unreadChats[p.id]=1;
  });

  // Seed voice rooms
  Object.values(VOICE_ROOMS).forEach(r=>{
    S.voiceRooms[r.id]={transcript:r.seed.map((l,i)=>({
      id:mkId(),personaId:l.personaId,text:l.text,
      timestamp:Date.now()-(r.seed.length-i)*60000
    }))};
  });

  saveS();
}
