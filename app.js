/* DES2026 — WhatsApp Research Prototype — Fast Build */

const STT_LANGUAGE = 'en-IN';

/* ── PERSONAS ── */
const PERSONAS = {
  meenakshiamma: {
    id:'meenakshiamma', name:'Meenakshiamma', age:68, city:'Chennai',
    profession:'retired schoolteacher', langMix:'Tamil/English',
    color:'#00897B',
    system:`You are Meenakshiamma, a 68-year-old retired schoolteacher from Chennai. You love Carnatic music, filter coffee, recipes. Mix Tamil words naturally (amma, paavam, seri). Warm and storytelling. Keep replies 1-3 sentences. Occasionally ask a question back. Reference grandchildren or daily routine naturally. Never use slang or many emoji.`,
    fallbacks:[
      "Aiyyo, connection problem! But tell me, how are you keeping? All well at home?", // TODO: add 3 more
      "Seri, let me try again. Are you eating properly? My grandchildren never listen to me about this!"
    ]
  },
  rameshbhai: {
    id:'rameshbhai', name:'Rameshbhai Patel', age:72, city:'Surat',
    profession:'retired textile businessman', langMix:'Gujarati/Hindi/English',
    color:'#E53935',
    system:`You are Rameshbhai Patel, a 72-year-old retired textile businessman from Surat. Cricket-obsessed, loves 80s Bollywood. Use Gujarati phrases (kem cho, mast, arre bhai). Jovial and warm. Keep replies 1-3 sentences. Ask a question back sometimes.`,
    fallbacks:[
      "Arre bhai, network problem! Kem cho? Did you see the last India match?", // TODO: add 3 more
      "Mast question! Connection weak. Tell me — who is your favourite cricketer?"
    ]
  },
  krishnaswamy: {
    id:'krishnaswamy', name:'Krishnaswamy Uncle', age:74, city:'Bangalore',
    profession:'retired engineer', langMix:'Kannada/English',
    color:'#1E88E5',
    system:`You are Krishnaswamy Uncle, a 74-year-old retired engineer from Bangalore. Precise, dry humour, uses Kannada (hege, channagide, gottu). Loves chess and current affairs. Keep replies 1-3 sentences. Occasionally ask the other person a question.`,
    fallbacks:[
      "Connectivity issue. Hege iddira? Do you follow current affairs?", // TODO: add 3 more
      "Gottu, these apps! Are you a reader? I finished a biography last week."
    ]
  }
};

const PERSONA_LIST = Object.values(PERSONAS);

/* ── COMMUNITIES ── */
const COMMUNITIES = {
  cricket: {
    id:'cricket', name:'Cricket Addicts', desc:'Live match discussions and debates',
    tags:['#Cricket','#IPL','#Sports'], members:2341,
    voiceRoom:'cricket-discussion',
    personas:['rameshbhai','krishnaswamy'],
    seed:[
      {from:'rameshbhai', text:'Arre bhai what a match yesterday! Rohit played like a king.'},
      {from:'krishnaswamy', text:'Technically solid batting. Though the bowling was below par.'},
      {from:'rameshbhai', text:'Below par? Haha Krishnaswamy bhai you are always so critical!'},
      {from:'krishnaswamy', text:'Criticism is how we improve. That said, the last over was magnificent.'},
      {from:'rameshbhai', text:'Agreed! Best finish of the season so far. What does everyone think?'}
    ]
  },
  bollywood: {
    id:'bollywood', name:'Retro Bollywood', desc:"Golden era films and songs of the 70s–80s",
    tags:['#Bollywood','#70s80s','#Films'], members:1563,
    voiceRoom:'retro-bollywood-adda',
    personas:['rameshbhai','meenakshiamma'],
    seed:[
      {from:'meenakshiamma', text:'I was watching Sholay again last night. Still perfect after all these years!'},
      {from:'rameshbhai', text:'Sholay is poetry! Gabbar Singh — best villain in Indian cinema history.'},
      {from:'meenakshiamma', text:'Seri, but Deewar is also masterpiece. Amitabh at his best.'},
      {from:'rameshbhai', text:'Kishore Kumar songs from those days — I tell you, music today is noise only.'},
      {from:'meenakshiamma', text:'Haha so true! Which is your all-time favourite song? Mine is Mere Sapno Ki Rani.'}
    ]
  },
  bhajan: {
    id:'bhajan', name:'Bhajan & Spirituality', desc:'Daily prayers and spiritual conversations',
    tags:['#Devotional','#Bhajans','#Spirituality'], members:1204,
    voiceRoom:'morning-bhajans',
    personas:['meenakshiamma','krishnaswamy'],
    seed:[
      {from:'meenakshiamma', text:'Good morning everyone 🙏 Finished my prayers and now having filter coffee.'},
      {from:'krishnaswamy', text:'Morning. Channagide. Did the Suprabhatam recitation this morning.'},
      {from:'meenakshiamma', text:'Beautiful! I love MS Subbalakshmi\'s Suprabhatam. Plays every morning in our house.'},
      {from:'krishnaswamy', text:'Same here for forty years. Some traditions are worth keeping precisely.'},
      {from:'meenakshiamma', text:'Paavam, today\'s generation doesn\'t know what they\'re missing. What bhajan is everyone\'s favourite?'}
    ]
  }
};

/* ── VOICE ROOMS ── */
const VOICE_ROOMS = {
  'morning-bhajans':{
    id:'morning-bhajans', name:'Morning Bhajans', themeTag:'🙏 Devotional',
    theme:'Devotional music and morning prayers',
    personas:['meenakshiamma','krishnaswamy'],
    quietChips:['Share a favourite bhajan','Your morning routine?','Which festival is coming?'],
    seed:[
      {personaId:'meenakshiamma', text:'Namaste everyone! Started my day with Suprabhatam. Such a peaceful morning.'},
      {personaId:'krishnaswamy', text:'Channagide. I did the Gayatri mantra 108 times this morning.'},
      {personaId:'meenakshiamma', text:'Wonderful! My filter coffee and bhajan time — best part of the day.'}
    ]
  },
  'cricket-discussion':{
    id:'cricket-discussion', name:'Cricket Discussion', themeTag:'🏏 Cricket',
    theme:'Cricket matches, players and memories',
    personas:['rameshbhai','krishnaswamy'],
    quietChips:['Favourite Indian cricketer?','Best India innings ever?','IPL or Test?'],
    seed:[
      {personaId:'rameshbhai', text:'Kem cho everyone! Yesterday\'s match — what a performance by the batters!'},
      {personaId:'krishnaswamy', text:'Technically the pitch was helpful but the execution was excellent.'},
      {personaId:'rameshbhai', text:'Haha Krishnaswamy bhai always the engineer! But you have to admit it was exciting!'}
    ]
  },
  'retro-bollywood-adda':{
    id:'retro-bollywood-adda', name:'Retro Bollywood Adda', themeTag:'🎬 Bollywood',
    theme:'Golden era films and songs from the 70s and 80s',
    personas:['rameshbhai','meenakshiamma'],
    quietChips:['Favourite Kishore Kumar song?','Best Amitabh film?','Which song brings back memories?'],
    seed:[
      {personaId:'meenakshiamma', text:'Amma, I was humming Mere Sapno Ki Rani all morning!'},
      {personaId:'rameshbhai', text:'That song is timeless! Kishore Kumar was a genius, no one like him.'},
      {personaId:'meenakshiamma', text:'Seri seri. Those songs had feeling. Today\'s music is just noise!'}
    ]
  },
  'evening-adda':{
    id:'evening-adda', name:'Evening Adda', themeTag:'☕ Adda',
    theme:'General chit-chat about anything',
    personas:['meenakshiamma','rameshbhai','krishnaswamy'],
    quietChips:['How was your day?','Any interesting news?','What did you have for dinner?'],
    seed:[
      {personaId:'rameshbhai', text:'Good evening everyone! How was everyone\'s day?'},
      {personaId:'meenakshiamma', text:'Tiring but good! Made sambar from scratch. House smells wonderful.'},
      {personaId:'krishnaswamy', text:'Read the newspaper, watered my plants, had a good walk. Satisfied day.'}
    ]
  }
};

/* ── STORIES ── */
const SEED_STORIES = [
  {personaId:'meenakshiamma', text:"My mother's sambar recipe — she would wake at 5am to grind the masala fresh on the stone. That smell coming from the kitchen, amma, it would pull you out of bed like nothing else! I still make it every Sunday."},
  {personaId:'meenakshiamma', text:"Our school in Mylapore had a huge banyan tree in the courtyard. During free periods we would sit under it and tell stories. Sixty years later I can still feel the cool shade. // TODO expand"},
  {personaId:'rameshbhai', text:"1983 World Cup final — I was in my shop in Surat with a small black-and-white TV. When Kapil Dev caught Viv Richards I locked the shop and ran into the street shouting! Best moment of my life after my children being born."},
  {personaId:'rameshbhai', text:"In my textile business, every Diwali every worker got new clothes made from our own fabric. My father started it, I continued for 30 years. Relationships are the real business. // TODO expand"},
  {personaId:'krishnaswamy', text:"My father was a maths teacher. Every evening at 7pm sharp we had 'puzzle time' — he gave us a problem to solve before dinner. I thought it was torture then. Now I understand it was the greatest gift he gave me."},
  {personaId:'krishnaswamy', text:"Bisibelebath with cashews and ghee on top — my mother's version. Now health people say no ghee. I am 74 years old and I still add the ghee. Some things should not be optimised. // TODO expand"}
];

/* ── GAME DATA ── */
const BOLLYWOOD_QUESTIONS = [
  {q:"Which film features the song 'Mere Sapno Ki Rani'?", a:"Aradhana", year:1969},
  {q:"Who played the villain Gabbar Singh in Sholay?", a:"Amjad Khan", year:1975},
  {q:"In which film did Amitabh Bachchan play the character 'Vijay' opposite Shashi Kapoor?", a:"Deewar", year:1975},
  {q:"Which singer is known as the 'Nightingale of India'?", a:"Lata Mangeshkar", year:null},
  {q:"Which 1975 film is often called the greatest Bollywood film ever made?", a:"Sholay", year:1975},
  {q:"'Yeh Dosti' is a famous song from which film?", a:"Sholay", year:1975},
  {q:"Who directed Mother India?", a:"Mehboob Khan", year:1957},
  {q:"Which actor starred in both Mughal-E-Azam and Mughal-E-Azam's colour version?", a:"Dilip Kumar", year:null},
];

/* ── APP STATE ── */
let S = {
  apiKey:'', proxyUrl:'',
  onboardingDone:false, interests:[],
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
function mkStory(authorId,authorName,text) { return {id:mkId(),authorId,authorName,text,timestamp:Date.now(),replies:[]}; }

function addMsg(ctx,ctxId,msg) {
  if(!S[ctx][ctxId]) S[ctx][ctxId]=[];
  S[ctx][ctxId].push(msg); saveS();
}

/* ── SEED DATA ── */
function seedData(interests) {
  S.stories = SEED_STORIES.map(s=>({
    id:mkId(), authorId:s.personaId,
    authorName:PERSONAS[s.personaId].name,
    text:s.text, timestamp:Date.now()-Math.random()*7*86400000, replies:[]
  }));
  S.stories.sort((a,b)=>b.timestamp-a.timestamp);

  const joined = new Set();
  const map = {cooking:['bhajan'],cricket:['cricket'],music:['bollywood'],gardening:['bhajan'],literature:['bollywood'],spirituality:['bhajan']};
  interests.forEach(i=>(map[i]||[]).forEach(c=>joined.add(c)));
  if(joined.size===0) joined.add('cricket');
  S.joinedCommunities=[...joined].slice(0,3);

  S.joinedCommunities.forEach(cId=>{
    const c=COMMUNITIES[cId]; if(!c) return;
    S.communities[cId]=c.seed.map((m,i)=>({...mkMsg(m.from,'text',m.text),timestamp:Date.now()-((c.seed.length-i)*3*60000)}));
  });

  // Seed one chat per persona
  PERSONA_LIST.forEach(p=>{
    if(!S.chats[p.id]) S.chats[p.id]=[mkMsg(p.id,'text',p.fallbacks[0])];
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

/* ── AVATAR ── */
function avColor(name) {
  const colors=['#E53935','#8E24AA','#1E88E5','#00897B','#F4511E','#6D4C41','#546E7A','#C62828'];
  let h=0; for(let c of name) h=(h*31+c.charCodeAt(0))>>>0;
  return colors[h%colors.length];
}
function avInitials(name) {
  const p=name.trim().split(/\s+/);
  return p.length===1?p[0].slice(0,2).toUpperCase():(p[0][0]+p[p.length-1][0]).toUpperCase();
}
function avatar(name,size='md') {
  return `<div class="avatar avatar--${size}" style="background:${avColor(name)}">${avInitials(name)}</div>`;
}

/* ── ICONS ── */
const IC = {
  back:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
  search:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
  more:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
  mic:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>`,
  micOff:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>`,
  send:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
  speaker:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
  play:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  pause:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
  attach:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>`,
  chats:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
  stories:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`,
  communities:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
  voiceRoom:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3zm-1 13V8l7 4-7 4z"/></svg>`,
  games:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/></svg>`,
  add:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
  close:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  eye:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
  eyeOff:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`,
  reply:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>`,
  controller:`<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/></svg>`,
  phone:`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
};

/* ── VOICE ── */
let _recog=null, _recActive=false;
function canSTT(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition);}
function canTTS(){return !!window.speechSynthesis;}

function speak(text,onEnd){
  if(!canTTS()) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=STT_LANGUAGE; u.rate=0.9;
  const voices=window.speechSynthesis.getVoices();
  const v=voices.find(v=>v.lang.includes('IN')||v.name.toLowerCase().includes('india'))||voices.find(v=>v.lang.startsWith('en'));
  if(v) u.voice=v;
  u.onend=onEnd||null;
  window.speechSynthesis.speak(u);
}
function stopSpeak(){if(canTTS())window.speechSynthesis.cancel();}

function startRec({onInterim,onFinal,onError,onEnd}){
  if(!canSTT()){onError?.('unavailable');return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  _recog=new SR(); _recog.lang=STT_LANGUAGE; _recog.continuous=false; _recog.interimResults=true;
  _recog.onresult=e=>{
    let interim='',final='';
    for(let i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal)final+=e.results[i][0].transcript;
      else interim+=e.results[i][0].transcript;
    }
    if(interim)onInterim?.(interim);
    if(final)onFinal?.(final);
  };
  _recog.onerror=e=>{_recActive=false;onError?.(e.error);};
  _recog.onend=()=>{_recActive=false;onEnd?.();};
  _recog.start(); _recActive=true;
}
function stopRec(){if(_recog&&_recActive){try{_recog.stop();}catch(e){}}_recActive=false;}

/* ── API ── */
let _fallbackIdx={};
async function claude(personaId, messages, extraNote=''){
  const p=PERSONAS[personaId]; if(!p) return fallback(personaId);
  if(!S.apiKey||!S.proxyUrl) return fallback(personaId);
  const sys=`${p.system}\n\n${extraNote}`;
  const msgs=messages.slice(-10).map(m=>({role:m.from==='user'?'user':'assistant',content:m.text||'...'}));
  // Ensure valid alternating structure
  const deduped=[];
  for(const m of msgs){
    if(deduped.length&&deduped[deduped.length-1].role===m.role)
      deduped[deduped.length-1].content+=' '+m.content;
    else deduped.push({...m});
  }
  if(!deduped.length||deduped[0].role==='assistant') deduped.unshift({role:'user',content:'Hello'});
  try{
    const r=await fetch(S.proxyUrl,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({apiKey:S.apiKey,model:'claude-sonnet-4-20250514',max_tokens:200,system:sys,messages:deduped})});
    if(!r.ok) throw new Error(r.status);
    const d=await r.json();
    const t=d?.content?.[0]?.text?.trim(); if(!t) throw new Error('empty');
    return t;
  }catch(e){console.warn('API err',e); return fallback(personaId);}
}
function fallback(id){
  const p=PERSONAS[id]; if(!p) return 'Connection issue. Please try again.';
  if(!_fallbackIdx[id])_fallbackIdx[id]=0;
  return p.fallbacks[_fallbackIdx[id]++%p.fallbacks.length];
}

/* ── ROUTER ── */
let _stack=[], _cur=null, _nav=false;
function navigate(hash){
  const h=hash.startsWith('#')?hash:'#'+hash;
  if(_cur===h)return;
  _stack.push(h); _cur=h;
  window.location.hash=h.slice(1);
  render();
}
function goBack(){
  if(_stack.length>1){_stack.pop();_cur=_stack[_stack.length-1];_nav=true;window.location.hash=_cur.slice(1);_nav=false;render();}
  else navigate('#/chats');
}
window.addEventListener('hashchange',()=>{
  if(_nav)return;
  const h=window.location.hash||'#/';
  if(_cur!==h){const i=_stack.indexOf(h);if(i>=0)_stack=_stack.slice(0,i+1);else _stack.push(h);_cur=h;render();}
});

function parseRoute(hash){
  const path=(hash||'#/').replace(/^#\/?/,'');
  const parts=path.split('/').filter(Boolean);
  if(!parts.length)return{screen:'',params:{}};
  const s=parts[0],p={};
  if(s==='chat'&&parts[1])p.personaId=parts[1];
  if(s==='community'&&parts[1])p.communityId=parts[1];
  if(s==='story'&&parts[1])p.storyId=parts[1];
  if(s==='voiceroom'&&parts[1])p.roomId=parts[1];
  if(s==='game'&&parts[1]&&parts[2]){p.gameId=parts[1];p.gameType=parts[2];}
  return{screen:s,params:p};
}

function render(){
  const hash=window.location.hash||'#/';
  const{screen,params}=parseRoute(hash);
  if(!S.apiKey){renderSetup();return;}
  if(!S.onboardingDone&&screen!=='onboarding'){renderOnboarding();return;}
  switch(screen){
    case'':renderSetup();break;
    case'onboarding':renderOnboarding();break;
    case'chats':renderChats();break;
    case'chat':renderChat(params.personaId);break;
    case'stories':renderStories();break;
    case'story':renderStoryView(params.storyId);break;
    case'communities':renderCommunities();break;
    case'community':renderCommunity(params.communityId);break;
    case'voicerooms':renderVoiceRooms();break;
    case'voiceroom':renderVoiceRoom(params.roomId);break;
    case'games':renderGames();break;
    case'game':renderGame(params.gameId,params.gameType);break;
    default:renderChats();
  }
}

/* ── SHARED UI ── */
const $=id=>document.getElementById(id);
const app=()=>document.getElementById('app');

function mount(html){document.getElementById('app').innerHTML=html;}

function toast(msg){
  const old=document.querySelector('.toast');if(old)old.remove();
  const t=document.createElement('div');t.className='toast';t.textContent=msg;
  app().appendChild(t);setTimeout(()=>t.remove(),3200);
}

function ftime(ts){const d=new Date(ts);return d.getHours()+':'+(d.getMinutes()+'').padStart(2,'0');}
function fdate(ts){
  const d=new Date(ts),now=new Date(),diff=now-d;
  if(diff<86400000)return ftime(ts);
  if(diff<7*86400000)return d.toLocaleDateString('en-IN',{weekday:'short'});
  return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
}

function scrollBot(el){if(el)setTimeout(()=>{el.scrollTop=el.scrollHeight;},50);}

let _tapCount=0,_tapTimer=null;
function headerTap(){
  _tapCount++;clearTimeout(_tapTimer);
  _tapTimer=setTimeout(()=>{_tapCount=0;},800);
  if(_tapCount>=3){_tapCount=0;showResearcherDialog();}
}
function showResearcherDialog(){
  const cur=S.researcherMode;
  const bk=document.createElement('div');
  bk.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;';
  bk.innerHTML=`<div style="background:#fff;border-radius:12px;padding:1.5rem;width:100%;max-width:320px;gap:1rem;display:flex;flex-direction:column;">
    <h2 style="font-size:1.0625rem;font-weight:700;">Researcher Mode</h2>
    <p style="font-size:0.9375rem;color:#444;line-height:1.5;">${cur?'Disable':'Enable'} researcher mode? ${cur?'AI labels will be hidden.':'AI personas will be labeled in chat.'}</p>
    <div style="display:flex;gap:.75rem;justify-content:flex-end;">
      <button id="rm-no" style="background:none;border:1.5px solid #ddd;border-radius:8px;padding:.625rem 1.25rem;font-size:1rem;cursor:pointer;min-height:44px;font-family:inherit;">Cancel</button>
      <button id="rm-yes" style="background:${cur?'#E53935':'#075E54'};color:#fff;border:none;border-radius:8px;padding:.625rem 1.25rem;font-size:1rem;font-weight:600;cursor:pointer;min-height:44px;font-family:inherit;">${cur?'Disable':'Enable'}</button>
    </div></div>`;
  app().appendChild(bk);
  $('rm-no').onclick=()=>bk.remove();
  $('rm-yes').onclick=()=>{set({researcherMode:!cur});bk.remove();toast(cur?'Researcher Mode off':'Researcher Mode on');render();};
}

function header(title,{back=false,avatarName=null,right=[],subtitle=null}={}){
  let h=`<div class="header">`;
  if(back) h+=`<button class="header__back" onclick="goBack()" aria-label="Back">${IC.back}</button>`;
  if(avatarName) h+=`<div class="header__avatar">${avatar(avatarName,'sm')}</div>`;
  h+=`<div class="header__title" onclick="headerTap()"><h1>${title}</h1>${subtitle?`<div class="header__subtitle">${subtitle}</div>`:''}</div>`;
  if(right.length) h+=`<div class="header__actions">${right.map(b=>`<button class="header__action-btn" aria-label="${b.label}" onclick="${b.fn}">${b.icon}</button>`).join('')}</div>`;
  h+=`</div>`;
  return h;
}

function bottomNav(active){
  const tabs=[
    {id:'chats',label:'Chats',icon:IC.chats,hash:'#/chats'},
    {id:'stories',label:'Stories',icon:IC.stories,hash:'#/stories'},
    {id:'communities',label:'Communities',icon:IC.communities,hash:'#/communities'},
    {id:'voicerooms',label:'Voice Rooms',icon:IC.voiceRoom,hash:'#/voicerooms'},
    {id:'games',label:'Games',icon:IC.games,hash:'#/games'},
  ];
  return `<nav class="bottom-nav">${tabs.map(t=>`
    <button class="bottom-nav__tab${active===t.id?' active':''}" onclick="navTo('${t.hash}')" aria-label="${t.label}">
      <span class="bottom-nav__icon">${t.icon}</span>
      <span class="bottom-nav__label">${t.label}</span>
    </button>`).join('')}</nav>`;
}
function navTo(hash){_stack=[hash];navigate(hash);}

function desktopBanner(){
  if(S.desktopBannerDismissed||canSTT())return'';
  return`<div class="banner banner--desktop"><span>For the full voice experience, open this on an Android phone in Chrome.</span><button class="banner__close" onclick="dismissDesktop()">${IC.close}</button></div>`;
}
function dismissDesktop(){set({desktopBannerDismissed:true});render();}

function resBar(){return S.researcherMode?'<div class="researcher-mode-bar">👁 RESEARCHER MODE — AI personas are labeled</div>':'';}

function bubble(msg){
  const sent=msg.from==='user';
  const p=!sent&&PERSONAS[msg.from];
  const aiBadge=(p&&S.researcherMode)?'<span class="ai-badge">AI</span>':'';
  let content='';
  if(msg.type==='voice'){
    const bars=Array.from({length:18},(_,i)=>{const h=4+Math.round(Math.sin(i*.8)*8+10);return`<div class="voice-bubble__bar" style="height:${h}px"></div>`;}).join('');
    content=`<div class="voice-bubble">
      <div class="voice-bubble__controls">
        <button class="voice-bubble__play" onclick="togglePlay(this,'${msg.id}')" aria-label="Play">${IC.play}</button>
        <div class="voice-bubble__waveform">${bars}</div>
      </div>
      ${msg.text?`<div class="voice-bubble__text">${msg.text}</div>`:''}
    </div>`;
  } else {
    content=`${aiBadge}<div>${msg.text}</div>`;
  }
  const spk=canTTS()?`<button class="bubble__speaker" onclick="speakMsg(this,'${msg.id.replace(/'/g,"\\'")}','${(msg.text||'').replace(/'/g,"\\'").replace(/\n/g,' ').slice(0,200)}')" aria-label="Read aloud">${IC.speaker}</button>`:'';
  return`<div class="bubble-wrap bubble-wrap--${sent?'sent':'recv'}">
    <div class="bubble bubble--${sent?'sent':'recv'}">
      ${content}
      <div class="bubble__meta"><span class="bubble__time">${ftime(msg.timestamp)}</span>${sent?`<span class="bubble__ticks bubble__ticks--read">${doubleTick()}</span>`:''}</div>
    </div>
    ${spk}
  </div>`;
}

function doubleTick(){return`<svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><path d="M17.394.606a.75.75 0 0 1 0 1.06L8.9 10.16a.75.75 0 0 1-1.06 0L4.606 6.928a.75.75 0 1 1 1.06-1.06l2.704 2.703 7.963-7.965a.75.75 0 0 1 1.06 0zM1 5.868l2.704 2.704a.75.75 0 1 0 1.06-1.06L2.06 4.806A.75.75 0 0 0 1 5.868z"/></svg>`;}

function typingHTML(){return`<div class="bubble-wrap bubble-wrap--recv" id="typing"><div class="typing-indicator"><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div><div class="typing-indicator__dot"></div></div></div>`;}

// Global speak state
const _playing={};
function speakMsg(btn,msgId,text){
  if(_playing[msgId]){stopSpeak();delete _playing[msgId];btn.classList.remove('bubble__speaker--playing');return;}
  Object.keys(_playing).forEach(k=>{delete _playing[k];document.querySelectorAll('.bubble__speaker--playing').forEach(b=>b.classList.remove('bubble__speaker--playing'));});
  speak(text,()=>{delete _playing[msgId];btn.classList.remove('bubble__speaker--playing');});
  _playing[msgId]=true;btn.classList.add('bubble__speaker--playing');
}
function togglePlay(btn,msgId){
  const msg=findMsg(msgId);if(!msg)return;
  speakMsg(btn,msgId,msg.text||'');
}
function findMsg(id){
  for(const k of Object.keys(S.chats)){const m=S.chats[k]?.find(m=>m.id===id);if(m)return m;}
  for(const k of Object.keys(S.communities)){const m=S.communities[k]?.find(m=>m.id===id);if(m)return m;}
  for(const k of Object.keys(S.games)){const m=S.games[k]?.messages?.find(m=>m.id===id);if(m)return m;}
  return null;
}

/* ── INPUT BAR ── */
function renderInputBar(containerId, {onSend,onGame=null,placeholder='Message'}){
  const bar=document.createElement('div');
  bar.className='message-input-bar';
  bar.innerHTML=`
    <div class="message-input-bar__field-wrap">
      ${onGame?`<button class="message-input-bar__game-btn" id="ib-game" aria-label="Start game">${IC.controller}</button>`:''}
      <textarea class="message-input-bar__field" id="ib-field" placeholder="${placeholder}" rows="1"></textarea>
    </div>
    <button class="message-input-bar__send message-input-bar__send--mic" id="ib-send" aria-label="Send or record">${IC.mic}</button>
  `;
  const container=document.getElementById(containerId);
  if(!container)return;
  container.appendChild(bar);

  const field=$('ib-field'), sendBtn=$('ib-send');
  if(onGame&&$('ib-game')) $('ib-game').onclick=onGame;

  field.addEventListener('input',()=>{
    field.style.height='auto';field.style.height=Math.min(field.scrollHeight,120)+'px';
    sendBtn.innerHTML=field.value.trim()?IC.send:IC.mic;
    sendBtn.className='message-input-bar__send '+(field.value.trim()?'':'message-input-bar__send--mic');
  });
  field.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();doSend();}});

  let recording=false, transcript='';

  function doSend(){
    const t=field.value.trim();if(!t)return;
    field.value='';field.style.height='auto';
    sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';
    onSend({type:'text',text:t});
  }

  function showRecOverlay(){
    const ov=document.createElement('div');ov.className='recording-overlay';ov.id='rec-ov';
    const bars=Array.from({length:12},(_,i)=>`<div class="recording-overlay__bar" style="animation-delay:${i*.07}s"></div>`).join('');
    ov.innerHTML=`<div class="recording-overlay__waveform">${bars}</div>
      <div class="recording-overlay__status">Listening...</div>
      <div class="recording-overlay__preview" id="rec-preview"> </div>
      <div class="recording-overlay__actions">
        <button class="recording-overlay__cancel" id="rec-cancel">Cancel</button>
        <button class="recording-overlay__send" id="rec-send" disabled>Send</button>
      </div>`;
    app().appendChild(ov);
    $('rec-cancel').onclick=()=>{stopRec();removeOv();};
    $('rec-send').onclick=()=>{stopRec();const t=transcript.trim();removeOv();if(t)onSend({type:'voice',text:t});};
  }
  function removeOv(){const o=$('rec-ov');if(o)o.remove();recording=false;transcript='';sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';}

  sendBtn.onclick=()=>{
    if(field.value.trim()){doSend();return;}
    if(!canSTT()){toast('Voice not available — please type.');return;}
    if(recording){stopRec();return;}
    recording=true;transcript='';
    sendBtn.className='message-input-bar__send message-input-bar__send--recording';
    sendBtn.innerHTML=IC.micOff;
    showRecOverlay();
    startRec({
      onInterim:t=>{transcript=t;const p=$('rec-preview');if(p)p.textContent=t;},
      onFinal:t=>{transcript=t;const p=$('rec-preview');if(p)p.textContent=t;const s=$('rec-send');if(s&&t.trim())s.disabled=false;},
      onError:()=>{removeOv();toast('Could not hear clearly. Please try again.');},
      onEnd:()=>{recording=false;sendBtn.innerHTML=IC.mic;sendBtn.className='message-input-bar__send message-input-bar__send--mic';const s=$('rec-send');if(s&&transcript.trim())s.disabled=false;else if(!transcript.trim())removeOv();}
    });
  };
}

/* ── SETUP SCREEN ── */
function renderSetup(){
  mount(`<div class="setup-screen">
    <div class="setup-screen__logo"><svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="17" r="8" fill="#25D366"/><path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#25D366" stroke-width="3" stroke-linecap="round"/><path d="M4 30l-3 6 6-2" fill="#25D366"/></svg></div>
    <div class="setup-screen__title">DES2026 Researcher Setup</div>
    <div class="setup-screen__subtitle">Enter your credentials to enable AI responses.</div>
    <form class="setup-screen__form" onsubmit="doSetup(event)">
      <div class="setup-screen__field">
        <label class="setup-screen__label">Anthropic API Key</label>
        <div class="setup-screen__input-wrap">
          <input class="setup-screen__input" id="s-key" type="password" placeholder="sk-ant-..." autocomplete="off"/>
          <button type="button" class="setup-screen__toggle" onclick="toggleKeyVis()" id="s-eye">${IC.eye}</button>
        </div>
      </div>
      <div class="setup-screen__field">
        <label class="setup-screen__label">Cloudflare Worker URL (handles API requests)</label>
        <div class="setup-screen__input-wrap">
          <input class="setup-screen__input" id="s-proxy" type="text" placeholder="https://your-worker.workers.dev"/>
        </div>
        <div class="setup-screen__hint">See index.html comments for the 10-line Worker code.</div>
      </div>
      <button type="submit" class="setup-screen__btn" id="s-submit" disabled>Continue →</button>
    </form>
    <div class="setup-screen__note">Keys stored locally only. This screen won't appear again.</div>
  </div>`);
  $('s-key').oninput=$('s-proxy').oninput=()=>{$('s-submit').disabled=!($('s-key').value.trim()&&$('s-proxy').value.trim());};
}
function toggleKeyVis(){const i=$('s-key');i.type=i.type==='password'?'text':'password';$('s-eye').innerHTML=i.type==='password'?IC.eye:IC.eyeOff;}
function doSetup(e){e.preventDefault();const k=$('s-key').value.trim(),p=$('s-proxy').value.trim();if(!k||!p)return;set({apiKey:k,proxyUrl:p});if(S.onboardingDone)navigate('#/chats');else navigate('#/onboarding');}

/* ── ONBOARDING ── */
function renderOnboarding(){
  mount(`
    ${header('DES2026 Community')}
    <div class="onboarding-screen">
      <div>
        <div class="onboarding-screen__heading">What are you interested in?</div>
        <div class="onboarding-screen__subheading">Select your interests to find communities.</div>
      </div>
      <div class="interest-grid" id="ig"></div>
      <button class="onboarding-screen__cta" id="ob-cta" disabled>Let's go →</button>
    </div>
  `);
  const interests=[{id:'cooking',l:'Cooking',e:'🍲'},{id:'cricket',l:'Cricket',e:'🏏'},{id:'music',l:'Music',e:'🎵'},{id:'gardening',l:'Gardening',e:'🌱'},{id:'literature',l:'Literature',e:'📚'},{id:'spirituality',l:'Spirituality',e:'🙏'}];
  const sel=new Set();
  const grid=$('ig');
  interests.forEach(({id,l,e})=>{
    const t=document.createElement('button');t.className='interest-tile';
    t.innerHTML=`<span class="interest-tile__emoji">${e}</span><span class="interest-tile__label">${l}</span>`;
    t.onclick=()=>{sel.has(id)?(sel.delete(id),t.classList.remove('selected')):(sel.add(id),t.classList.add('selected'));$('ob-cta').disabled=!sel.size;};
    grid.appendChild(t);
  });
  $('ob-cta').onclick=()=>{if(!sel.size)return;set({interests:[...sel],onboardingDone:true});seedData([...sel]);navigate('#/chats');};
}

/* ── CHATS LIST ── */
function renderChats(){
  mount(`
    ${desktopBanner()}
    ${resBar()}
    ${header('DES2026 Community',{right:[{icon:IC.search,label:'Search',fn:''}]})}
    <div class="screen" style="background:#fff;">
      <div class="search-bar"><span class="search-bar__icon">${IC.search}</span><input type="search" placeholder="Search chats"/></div>
      <div class="screen__scroll" id="chat-list"></div>
    </div>
    ${bottomNav('chats')}
  `);
  const list=$('chat-list');
  const items=Object.keys(S.chats).filter(id=>PERSONAS[id]).map(id=>{
    const msgs=S.chats[id]||[],last=msgs[msgs.length-1];
    return{id,last,time:last?.timestamp||0};
  }).sort((a,b)=>b.time-a.time);
  if(!items.length){list.innerHTML=`<div class="empty-state"><div class="empty-state__icon">💬</div><div class="empty-state__title">No chats yet</div><div class="empty-state__desc">Join a community to start connecting.</div></div>`;return;}
  items.forEach(({id,last,time})=>{
    const p=PERSONAS[id];
    const unread=S.unreadChats[id]||0;
    const preview=last?(last.type==='voice'?'🎤 Voice message':last.text):'';
    const ai=S.researcherMode?'<span class="ai-badge">AI</span>':'';
    const div=document.createElement('div');div.className='chat-list-item';
    div.innerHTML=`${avatar(p.name,'md')}<div class="chat-list-item__body"><div class="chat-list-item__top"><div class="chat-list-item__name">${p.name}${ai}</div><div class="chat-list-item__time">${fdate(time)}</div></div><div class="chat-list-item__bottom"><div class="chat-list-item__preview">${preview}</div>${unread?`<div class="chat-list-item__badge">${unread}</div>`:''}</div></div>`;
    div.onclick=()=>{const u={...S.unreadChats};delete u[id];set({unreadChats:u});navigate('#/chat/'+id);};
    list.appendChild(div);
  });
}

/* ── CHAT SCREEN ── */
function renderChat(personaId){
  const p=PERSONAS[personaId];if(!p){navigate('#/chats');return;}
  mount(`
    ${header(p.name,{back:true,avatarName:p.name,subtitle:p.city,right:[{icon:IC.phone,label:'Call',fn:`toast('Voice calls coming soon')`}]})}
    <div class="screen chat-screen" id="chat-wrap">
      <div class="chat-messages" id="msgs"></div>
    </div>
  `);
  const msgs=$('msgs');
  (S.chats[personaId]||[]).forEach(m=>msgs.insertAdjacentHTML('beforeend',bubble(m)));
  scrollBot(msgs);
  renderInputBar('chat-wrap',{
    placeholder:'Message',
    onGame:()=>showGameSheet(personaId),
    onSend:async({type,text})=>{
      const msg=mkMsg('user',type,text);
      addMsg('chats',personaId,msg);
      msgs.insertAdjacentHTML('beforeend',bubble(msg));
      scrollBot(msgs);
      msgs.insertAdjacentHTML('beforeend',typingHTML());
      scrollBot(msgs);
      await delay(1500+Math.random()*1000);
      const ti=$('typing');if(ti)ti.remove();
      const resp=await claude(personaId,S.chats[personaId]||[]);
      const aiMsg=mkMsg(personaId,'text',resp);
      addMsg('chats',personaId,aiMsg);
      msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
      scrollBot(msgs);
    }
  });
}

function delay(ms){return new Promise(r=>setTimeout(r,ms));}

/* ── STORIES ── */
function renderStories(){
  mount(`
    ${resBar()}
    ${header('Stories',{right:[{icon:IC.search,label:'Search',fn:''}]})}
    <div class="screen" style="position:relative;">
      <div class="screen__scroll" style="background:#F0F2F5;" id="stories-list"></div>
      <button class="fab" onclick="showStoryCompose()" aria-label="Share story">${IC.add}</button>
    </div>
    ${bottomNav('stories')}
  `);
  const list=$('stories-list');
  (S.stories||[]).forEach(s=>list.appendChild(storyCard(s)));
}
function storyCard(s){
  const isUser=s.authorId==='user';
  const p=!isUser&&PERSONAS[s.authorId];
  const name=s.authorName||(p?p.name:'You');
  const ai=(p&&S.researcherMode)?'<span class="ai-badge">AI</span>':'';
  const div=document.createElement('div');div.className='story-card';
  div.innerHTML=`
    <div class="story-card__header">${avatar(name,'md')}<div class="story-card__author-info"><div class="story-card__author-name">${name}${ai}</div><div class="story-card__time">${fdate(s.timestamp)}</div></div></div>
    <div class="story-card__text">${s.text}</div>
    <div class="story-card__actions">
      ${canTTS()?`<button class="bubble__speaker" onclick="speakTxt(this,'${s.id}')" aria-label="Read aloud">${IC.speaker}</button>`:''}
      ${!isUser?`<button class="story-card__reply-btn" onclick="replyStory('${s.authorId}','${s.id}')">${IC.reply} Reply</button>`:''}
      <button class="story-card__read-more" onclick="navigate('#/story/${s.id}')">Read more</button>
    </div>`;
  return div;
}
function speakTxt(btn,storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);if(!s)return;
  speakMsg(btn,storyId,s.text);
}
function replyStory(personaId,storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);
  if(s){const m=mkMsg(personaId,'text',`[Story] "${s.text.slice(0,80)}..."`);m.storyRef=storyId;addMsg('chats',personaId,m);}
  navigate('#/chat/'+personaId);
}
function renderStoryView(storyId){
  const s=(S.stories||[]).find(x=>x.id===storyId);if(!s){navigate('#/stories');return;}
  const isUser=s.authorId==='user';const name=s.authorName||(PERSONAS[s.authorId]?.name)||'You';
  mount(`
    ${header(name,{back:true,avatarName:name})}
    <div class="screen" id="sv-wrap">
      <div class="screen__scroll" style="background:#F0F2F5;padding:.75rem;" id="sv-content"></div>
    </div>
  `);
  const content=$('sv-content');
  content.appendChild(storyCard(s));
  if(s.replies?.length){
    content.insertAdjacentHTML('beforeend','<div class="section-heading">Replies</div>');
    s.replies.forEach(r=>content.insertAdjacentHTML('beforeend',bubble(r)));
  }
  if(!isUser){
    renderInputBar('sv-wrap',{placeholder:'Reply...',onSend:async({type,text})=>{
      const msg=mkMsg('user',type,text);
      const updStories=S.stories.map(x=>x.id===storyId?{...x,replies:[...(x.replies||[]),msg]}:x);
      set({stories:updStories});
      content.insertAdjacentHTML('beforeend',bubble(msg));
      content.insertAdjacentHTML('beforeend',typingHTML());
      scrollBot(content);
      await delay(1500+Math.random()*1000);
      const ti=$('typing');if(ti)ti.remove();
      const aiText=await claude(s.authorId,[msg],`React to story: "${s.text.slice(0,100)}". User replied: "${text}".`);
      const aiMsg=mkMsg(s.authorId,'text',aiText);
      const updStories2=S.stories.map(x=>x.id===storyId?{...x,replies:[...(x.replies||[]),aiMsg]}:x);
      set({stories:updStories2});
      content.insertAdjacentHTML('beforeend',bubble(aiMsg));
      scrollBot(content);
    }});
  }
}
function showStoryCompose(){
  const bk=sheet(`<div class="bottom-sheet__handle"></div>
    <div class="bottom-sheet__title">Share Your Story</div>
    <div class="compose-chips" id="sc-chips"></div>
    <textarea class="compose-textarea" id="sc-text" placeholder="What would you like to share?" rows="4"></textarea>
    <div class="compose-actions">
      <button class="compose-mic-btn" id="sc-mic">${IC.mic}</button>
      <button class="compose-post-btn" id="sc-post" disabled>Post Story</button>
    </div>`);
  const chips=['Share a recipe memory','Your neighbourhood growing up','A film that changed you','A festival memory'];
  const chipsDiv=$('sc-chips');
  chips.forEach(c=>{const b=document.createElement('button');b.className='compose-chip';b.textContent=c;b.onclick=()=>{$('sc-text').value=c+': ';$('sc-post').disabled=false;};chipsDiv.appendChild(b);});
  $('sc-text').oninput=()=>{$('sc-post').disabled=!$('sc-text').value.trim();};
  let scRec=false,scTxt='';
  $('sc-mic').onclick=()=>{
    if(!canSTT()){toast('Voice not available');return;}
    if(scRec){stopRec();scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;return;}
    scRec=true;scTxt='';$('sc-mic').classList.add('recording');$('sc-mic').innerHTML=IC.micOff;
    startRec({onInterim:t=>{$('sc-text').value=scTxt+t;},onFinal:t=>{scTxt+=t+' ';$('sc-text').value=scTxt.trim();$('sc-post').disabled=!scTxt.trim();},onError:()=>{scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;},onEnd:()=>{scRec=false;$('sc-mic').classList.remove('recording');$('sc-mic').innerHTML=IC.mic;}});
  };
  $('sc-post').onclick=()=>{
    const t=$('sc-text').value.trim();if(!t)return;
    const s=mkStory('user','You',t);
    set({stories:[s,...S.stories]});
    closeSheet(bk);toast('Story shared!');renderStories();
    setTimeout(()=>triggerStoryReactions(s),6000+Math.random()*4000);
  };
}
async function triggerStoryReactions(story){
  const reactors=PERSONA_LIST.slice(0,2);
  for(const p of reactors){
    await delay(3000+Math.random()*3000);
    const t=await claude(p.id,[],`React briefly and warmly to this community story: "${story.text.slice(0,120)}"`);
    const m=mkMsg(p.id,'text',t);
    const upd=S.stories.map(s=>s.id===story.id?{...s,replies:[...(s.replies||[]),m]}:s);
    set({stories:upd});
  }
}

/* ── SHEET HELPERS ── */
function sheet(innerHtml){
  const bk=document.createElement('div');bk.className='bottom-sheet-backdrop';
  bk.onclick=e=>{if(e.target===bk)bk.remove();};
  const sh=document.createElement('div');sh.className='bottom-sheet';sh.innerHTML=innerHtml;
  bk.appendChild(sh);app().appendChild(bk);return bk;
}
function closeSheet(bk){if(bk&&bk.parentNode)bk.remove();}

/* ── COMMUNITIES ── */
function renderCommunities(){
  mount(`
    ${resBar()}
    ${header('Communities',{right:[{icon:IC.search,label:'Search',fn:''}]})}
    <div class="sub-tabs"><button class="sub-tab active" id="ct-joined" onclick="showCommTab('joined')">Joined</button><button class="sub-tab" id="ct-discover" onclick="showCommTab('discover')">Discover</button></div>
    <div class="screen"><div class="screen__scroll" id="comm-content"></div></div>
    ${bottomNav('communities')}
  `);
  showCommTab('joined');
}
function showCommTab(tab){
  ['joined','discover'].forEach(t=>{const b=$('ct-'+t);if(b)b.className='sub-tab'+(t===tab?' active':'');});
  const c=$('comm-content');if(!c)return;c.innerHTML='';
  if(tab==='joined'){
    const joined=S.joinedCommunities||[];
    if(!joined.length){c.innerHTML='<div class="empty-state"><div class="empty-state__icon">👥</div><div class="empty-state__title">No communities yet</div><div class="empty-state__desc">Go to Discover to join communities.</div></div>';return;}
    joined.forEach(id=>{const comm=COMMUNITIES[id];if(!comm)return;c.appendChild(commCard(comm,true));});
    // Also add all available communities with join option
    Object.values(COMMUNITIES).filter(c=>!joined.includes(c.id)).forEach(comm=>c.appendChild(commCard(comm,false)));
  } else {
    c.insertAdjacentHTML('afterbegin','<div class="tag-filter-row" id="tag-row"></div>');
    const tags=[...new Set(Object.values(COMMUNITIES).flatMap(c=>c.tags))];
    const tagRow=$('tag-row');let activeTag=null;
    function renderDiscover(filterTag){
      const existing=c.querySelectorAll('.community-card');existing.forEach(e=>e.remove());
      Object.values(COMMUNITIES).filter(comm=>!filterTag||comm.tags.includes(filterTag)).forEach(comm=>c.appendChild(commCard(comm,S.joinedCommunities.includes(comm.id))));
    }
    tags.forEach(tag=>{const b=document.createElement('button');b.className='tag-chip tag-chip--filter';b.textContent=tag;b.onclick=()=>{activeTag=activeTag===tag?null:tag;tagRow.querySelectorAll('.tag-chip--filter').forEach(x=>x.classList.remove('active'));if(activeTag)b.classList.add('active');renderDiscover(activeTag);};tagRow.appendChild(b);});
    renderDiscover(null);
  }
}
function commCard(comm,joined){
  const div=document.createElement('div');div.className='community-card';
  div.innerHTML=`${avatar(comm.name,'lg')}<div class="community-card__body"><div class="community-card__name">${comm.name}</div><div class="community-card__desc">${comm.desc}</div><div class="community-card__tags">${comm.tags.map(t=>`<span class="tag-chip">${t}</span>`).join('')}</div></div><button class="community-card__join-btn${joined?' joined':''}" onclick="toggleJoin(event,'${comm.id}')">${joined?'Joined':'Join'}</button>`;
  div.onclick=e=>{if(e.target.classList.contains('community-card__join-btn'))return;navigate('#/community/'+comm.id);};
  return div;
}
function toggleJoin(e,commId){
  e.stopPropagation();
  const joined=[...S.joinedCommunities];
  const idx=joined.indexOf(commId);
  if(idx>=0)joined.splice(idx,1);else joined.push(commId);
  set({joinedCommunities:joined});
  showCommTab('discover');
}

/* ── COMMUNITY FEED ── */
function renderCommunity(commId){
  const comm=COMMUNITIES[commId];if(!comm){navigate('#/communities');return;}
  const right=[];
  if(comm.voiceRoom) right.push({icon:IC.voiceRoom,label:'Voice Room',fn:`navigate('#/voiceroom/${comm.voiceRoom}')`});
  mount(`
    ${header(comm.name,{back:true,subtitle:`${comm.members} members`,right})}
    <div class="screen chat-screen" id="comm-wrap">
      <div class="chat-messages" id="comm-msgs"></div>
    </div>
  `);
  const msgs=$('comm-msgs');
  (S.communities[commId]||[]).forEach(m=>msgs.insertAdjacentHTML('beforeend',bubble(m)));
  scrollBot(msgs);
  renderInputBar('comm-wrap',{placeholder:'Message community',onSend:async({type,text})=>{
    const msg=mkMsg('user',type,text);
    addMsg('communities',commId,msg);
    msgs.insertAdjacentHTML('beforeend',bubble(msg));
    scrollBot(msgs);
    msgs.insertAdjacentHTML('beforeend',typingHTML());scrollBot(msgs);
    await delay(1500+Math.random()*1000);
    const ti=$('typing');if(ti)ti.remove();
    const responderId=comm.personas[Math.floor(Math.random()*comm.personas.length)];
    const note=`You are in the "${comm.name}" community group (${comm.tags.join(', ')}). A member just posted: "${text}". Reply naturally as part of this group.`;
    const resp=await claude(responderId,S.communities[commId]||[],note);
    const aiMsg=mkMsg(responderId,'text',resp);
    addMsg('communities',commId,aiMsg);
    msgs.insertAdjacentHTML('beforeend',bubble(aiMsg));
    scrollBot(msgs);
  }});
}

/* ── VOICE ROOMS LIST ── */
function renderVoiceRooms(){
  mount(`
    ${resBar()}
    ${header('Voice Rooms')}
    <div class="screen"><div class="screen__scroll" id="vr-list" style="background:#F0F2F5;"></div></div>
    ${bottomNav('voicerooms')}
  `);
  const list=$('vr-list');
  Object.values(VOICE_ROOMS).forEach(room=>{
    const div=document.createElement('div');div.className='voice-room-card';
    const parts=room.personas.slice(0,3).map(id=>avatar(PERSONAS[id]?.name||'?','sm')).join('');
    div.innerHTML=`<div class="voice-room-card__header"><div class="voice-room-card__name">${room.name}</div><div class="voice-room-card__live"><div class="live-dot"></div>Live</div></div><div class="voice-room-card__theme">${room.themeTag}</div><div class="voice-room-card__participants">${parts}</div>`;
    div.onclick=()=>navigate('#/voiceroom/'+room.id);
    list.appendChild(div);
  });
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
      ${header(room.name,{back:true,subtitle:room.themeTag})}
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
    tile.innerHTML=`<div class="participant-tile__ring${i===0?' speaking':''}">${avatar(p.name,'lg')}</div><div class="participant-tile__name">${p.name.split(' ')[0]}</div>`;
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

/* ── GAMES HUB ── */
function renderGames(){
  const activeGames=Object.values(S.games).filter(g=>g.status==='active');
  const recentGames=Object.values(S.games).filter(g=>g.status==='completed').slice(-5);
  mount(`
    ${resBar()}
    ${header('Games')}
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
  antakshari:{emoji:'🎵',name:'Antakshari',desc:'Song chain — last letter starts next song'},
  'trivia-bollywood':{emoji:'🎬',name:'Bollywood Trivia',desc:'Questions about Hindi films'},
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
      b.innerHTML=`${avatar(p.name,'sm')}<div><div class="persona-pick-item__name">${p.name}</div><div class="persona-pick-item__city">${p.city}</div></div>`;
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
  return`<div class="game-status-bar__item"><div class="game-status-bar__value">${gt?.emoji||'🎮'}</div><div class="game-status-bar__label">Playing</div></div>`;
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

/* ── INIT ── */
loadS();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
window.speechSynthesis?.getVoices(); // pre-load voices

// Generate icon images at runtime (no PNG files needed)
window.addEventListener('load',generateIcons);

// Initial route
const initHash=window.location.hash||'#/';
_stack=[initHash];_cur=initHash;
render();
